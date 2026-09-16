/* Calango Batucada - bateria sequencer (Web Audio, all synthesized), wordmark pulse,
   scroll lizard, ribbon fill. No dependencies. */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STEPS = 16;

  // Samba-reggae-ish starter groove. "x" = hit. Edit freely.
  const INSTRUMENTS = [
    { id: "fundo",    name: "Surdo fundo", note: "The heartbeat. Biggest, lowest.",  color: "#D9461B", pattern: "....x.......x..." },
    { id: "dobra",    name: "Surdo dobra", note: "Answers the fundo.",               color: "#F5B20F", pattern: "x.....x.x.....x." },
    { id: "caixa",    name: "Caixa",       note: "Snare. Keeps everyone honest.",    color: "#A8CF3A", pattern: "x..x..x...x.x..." },
    { id: "repique",  name: "Repique",     note: "The caller. Starts and stops it.", color: "#F1E4CB", pattern: "..x..x....x..xx." },
    { id: "agogo",    name: "Agogô",       note: "Two bells, one melody.",           color: "#6FB7BF", pattern: "x.x..x.xx.x..x.." },
    { id: "chocalho", name: "Chocalho",    note: "Shaker. The sizzle on top.",       color: "#E7D6B6", pattern: ".x.x.x.x.x.x.x.x" },
  ];

  const toBools = (p) => [...p].map((c) => c === "x");
  let grid = INSTRUMENTS.map((i) => toBools(i.pattern));

  /* ---------------- audio ---------------- */
  let ctx = null;
  let master = null;
  let noise = null;

  function initAudio() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(comp).connect(ctx.destination);

    noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function env(t, peak, decay) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    g.connect(master);
    return g;
  }

  function tone(t, type, f0, f1, sweep, peak, decay) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
    o.connect(env(t, peak, decay));
    o.start(t);
    o.stop(t + decay + 0.05);
  }

  function hiss(t, filterType, freq, q, peak, decay) {
    const s = ctx.createBufferSource();
    s.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    f.Q.value = q;
    s.connect(f).connect(env(t, peak, decay));
    s.start(t);
    s.stop(t + decay + 0.05);
  }

  const VOICES = {
    fundo(t)    { tone(t, "sine", 120, 52, 0.09, 1.0, 0.7); hiss(t, "lowpass", 400, 0.7, 0.25, 0.05); },
    dobra(t)    { tone(t, "sine", 170, 82, 0.07, 0.8, 0.45); hiss(t, "lowpass", 600, 0.7, 0.2, 0.04); },
    caixa(t)    { hiss(t, "highpass", 1800, 0.8, 0.5, 0.11); tone(t, "triangle", 260, 180, 0.03, 0.18, 0.06); },
    repique(t)  { tone(t, "triangle", 520, 360, 0.04, 0.5, 0.14); hiss(t, "bandpass", 2600, 1.2, 0.3, 0.06); },
    agogo(t, s) {
      const high = s % 4 !== 2; // alternate bells for a little melody
      const f = high ? 930 : 690;
      tone(t, "sine", f, 0, 0, 0.32, 0.3);
      tone(t, "square", f * 2.01, 0, 0, 0.035, 0.12);
    },
    chocalho(t, s) { hiss(t, "highpass", 6500, 0.6, s % 2 ? 0.2 : 0.09, 0.05); },
  };

  /* ---------------- scheduler ---------------- */
  let bpm = 98;
  let playing = false;
  let step = 0;
  let nextTime = 0;
  let timer = null;
  const visualQueue = [];

  const stepDur = () => 60 / bpm / 4;

  function schedule() {
    while (nextTime < ctx.currentTime + 0.12) {
      // light swing on the "e" and "a" of each beat, samba doesn't sit square
      const swing = step % 2 ? stepDur() * 0.08 : 0;
      const t = nextTime + swing;
      INSTRUMENTS.forEach((inst, r) => { if (grid[r][step]) VOICES[inst.id](t, step); });
      visualQueue.push({ step, time: t });
      nextTime += stepDur();
      step = (step + 1) % STEPS;
    }
  }

  function start() {
    initAudio();
    if (ctx.state === "suspended") ctx.resume();
    playing = true;
    step = 0;
    nextTime = ctx.currentTime + 0.06;
    timer = setInterval(schedule, 25);
    schedule();
    syncButtons();
    requestAnimationFrame(draw);
  }

  function stop() {
    playing = false;
    clearInterval(timer);
    visualQueue.length = 0;
    clearHead();
    syncButtons();
  }

  const toggleButtons = document.querySelectorAll("[data-toggle-groove]");
  function syncButtons() {
    toggleButtons.forEach((b) => {
      b.setAttribute("aria-pressed", String(playing));
      const label = b.querySelector(".btn__label");
      const base = b.dataset.base || (b.dataset.base = label.textContent);
      label.textContent = playing ? "Stop" : base;
    });
  }
  toggleButtons.forEach((b) => b.addEventListener("click", () => (playing ? stop() : start())));

  /* ---------------- grid UI ---------------- */
  const gridEl = document.getElementById("grid");
  const cells = [];
  const rows = [];

  function buildGrid() {
    gridEl.textContent = "";
    INSTRUMENTS.forEach((inst, r) => {
      const row = document.createElement("div");
      row.className = "row";
      row.style.setProperty("--c", inst.color);
      row.innerHTML = `<div class="row__name"><b>${inst.name}</b><small>${inst.note}</small></div>`;
      const cellWrap = document.createElement("div");
      cellWrap.className = "cells";
      cells[r] = [];
      let beat;
      for (let s = 0; s < STEPS; s++) {
        if (s % 4 === 0) { beat = document.createElement("div"); beat.className = "beat"; cellWrap.appendChild(beat); }
        const c = document.createElement("button");
        c.type = "button";
        c.className = "cell";
        c.setAttribute("aria-label", `${inst.name}, step ${s + 1}`);
        c.setAttribute("aria-pressed", String(grid[r][s]));
        c.addEventListener("click", () => {
          grid[r][s] = !grid[r][s];
          c.setAttribute("aria-pressed", String(grid[r][s]));
          // audition the hit when stopped, feels better than silence
          if (!playing && grid[r][s]) { initAudio(); ctx.resume(); VOICES[inst.id](ctx.currentTime + 0.01, s); }
        });
        beat.appendChild(c);
        cells[r][s] = c;
      }
      row.appendChild(cellWrap);
      gridEl.appendChild(row);
      rows[r] = row;
    });
  }

  function refreshGrid() {
    grid.forEach((line, r) => line.forEach((on, s) => cells[r][s].setAttribute("aria-pressed", String(on))));
  }

  let lastHead = -1;
  function clearHead() {
    if (lastHead < 0) return;
    cells.forEach((line) => line[lastHead].classList.remove("is-head"));
    lastHead = -1;
  }

  const letters = document.querySelectorAll(".hero__word .w");
  let letterIdx = 0;
  function pulseWord() {
    if (reduceMotion || !letters.length) return;
    const el = letters[letterIdx++ % letters.length];
    el.classList.remove("hit");
    void el.offsetWidth; // restart animation
    el.classList.add("hit");
  }

  function draw() {
    if (!playing) return;
    let current = null;
    while (visualQueue.length && visualQueue[0].time <= ctx.currentTime) current = visualQueue.shift();
    if (current) {
      clearHead();
      cells.forEach((line) => line[current.step].classList.add("is-head"));
      lastHead = current.step;
      INSTRUMENTS.forEach((inst, r) => rows[r].classList.toggle("is-hit", grid[r][current.step]));
      if (grid[0][current.step] || grid[1][current.step]) pulseWord();
    }
    requestAnimationFrame(draw);
  }

  const bpmInput = document.getElementById("bpm");
  const bpmOut = document.getElementById("bpm-out");
  bpmInput.addEventListener("input", () => { bpm = +bpmInput.value; bpmOut.value = bpm; });

  document.getElementById("reset").addEventListener("click", () => {
    grid = INSTRUMENTS.map((i) => toBools(i.pattern));
    refreshGrid();
  });
  document.getElementById("clear").addEventListener("click", () => {
    grid = INSTRUMENTS.map(() => Array(STEPS).fill(false));
    refreshGrid();
  });

  // Space toggles the groove when focus isn't on a control
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space" || e.target.closest("button, a, input, textarea")) return;
    e.preventDefault();
    playing ? stop() : start();
  });

  // Browsers throttle timers in background tabs, stop cleanly instead of stuttering
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) stop(); });

  buildGrid();

  /* ---------------- wordmark: fill the hero width exactly ---------------- */
  const word = document.querySelector(".hero__word");
  function fitWord() {
    if (!word) return;
    word.style.fontSize = "";
    const avail = word.parentElement.clientWidth - parseFloat(getComputedStyle(word.parentElement).paddingLeft) * 2;
    const size = parseFloat(getComputedStyle(word).fontSize);
    // sum the letters: the h1 itself is stretched by the flex column, so its own width lies
    const w = [...word.children].reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
    word.style.fontSize = `${Math.min(size * (avail / w) * 0.995, 360)}px`;
  }
  fitWord();
  document.fonts && document.fonts.ready.then(fitWord);

  /* ---------------- ribbons: fill width, loop seamlessly ---------------- */
  function fillRibbons() {
    document.querySelectorAll(".fita span").forEach((span) => {
      const unit = span.dataset.unit || (span.dataset.unit = span.textContent);
      span.textContent = unit;
      const k = Math.max(1, Math.ceil(span.parentElement.offsetWidth / Math.max(1, span.offsetWidth)));
      span.textContent = unit.repeat(k * 2); // two identical halves, animation moves by -50%
    });
  }
  fillRibbons();
  document.fonts && document.fonts.ready.then(fillRibbons);
  let resizeT;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { fitWord(); fillRibbons(); }, 150); });

  /* ---------------- crawler lizard ---------------- */
  const crawler = document.querySelector(".crawler");
  if (crawler && !reduceMotion) {
    let lastY = window.scrollY;
    let idle;
    let ticking = false;
    const place = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const top = 84; // start below the header
      const travel = window.innerHeight - crawler.offsetHeight - top - 12;
      crawler.style.transform = `translateY(${top + p * travel}px)`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y !== lastY) crawler.classList.toggle("is-up", y < lastY);
      lastY = y;
      crawler.classList.add("is-moving");
      clearTimeout(idle);
      idle = setTimeout(() => crawler.classList.remove("is-moving"), 140);
      if (!ticking) { ticking = true; requestAnimationFrame(place); }
    }, { passive: true });
    place();
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
