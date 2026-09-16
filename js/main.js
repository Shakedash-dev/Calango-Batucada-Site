/* קלאנגו - real carnaval recording with letters that dance to its drum hits, ribbon fill. No dependencies. */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- carnaval: play the recording, react to what's in it ---------------- */
  const audio = document.getElementById("carnaval");
  const toggles = document.querySelectorAll("[data-carnaval]");
  const letters = [...document.querySelectorAll(".dance .w")];
  const logo = document.querySelector(".hero__logo img");
  const stamp = document.querySelector(".hero__stamp");
  const hero = document.querySelector(".hero");
  const fitas = document.querySelector(".fitas");

  // confetti bursts out of the painted drum on the big hits
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  if (logo) logo.parentElement.appendChild(confetti);
  const CONFETTI_COLORS = ["var(--red)", "var(--sun)", "var(--green)", "var(--sun-lt)", "var(--red)"];
  function burst(strength) {
    const count = Math.round(6 + strength * 8);
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("i");
      const angle = rand(0, Math.PI * 2);
      const dist = rand(90, 260) * (0.6 + strength * 0.6);
      bit.style.setProperty("--x", `${Math.cos(angle) * dist}px`);
      bit.style.setProperty("--y", `${Math.sin(angle) * dist * 0.8 + rand(20, 80)}px`);
      bit.style.setProperty("--r", `${rand(-540, 540)}deg`);
      bit.style.setProperty("--c", CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
      bit.style.setProperty("--w", `${rand(6, 12)}px`);
      bit.style.setProperty("--h", `${rand(14, 28)}px`);
      bit.style.setProperty("--t", `${rand(0.8, 1.3)}s`);
      bit.addEventListener("animationend", () => bit.remove());
      confetti.appendChild(bit);
    }
  }

  let ctx = null;
  let analyser = null;
  let bins = null;
  let playing = false;

  // Web Audio is only used to *listen* to the recording. If it fails (old browser, file://),
  // the audio still plays and the letters fall back to a steady samba pulse.
  function connectAnalyser() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.15;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      bins = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      analyser = null;
    }
  }

  const hzToBin = (hz) => Math.round(hz / (ctx.sampleRate / analyser.fftSize));
  function bandAvg(lo, hi) {
    let sum = 0;
    const a = hzToBin(lo), b = hzToBin(hi);
    for (let i = a; i <= b; i++) sum += bins[i];
    return sum / (b - a + 1);
  }
  function bandPeakRatio(lo, hi) {
    const a = hzToBin(lo), b = hzToBin(hi);
    const slice = Array.from(bins.subarray(a, b + 1)).sort((x, y) => x - y);
    return { peak: slice[slice.length - 1], ratio: slice[slice.length - 1] / (slice[slice.length >> 1] + 1) };
  }

  const rand = (min, max) => min + Math.random() * (max - min);

  function danceLetter(strength) {
    if (!letters.length) return;
    const el = letters[Math.floor(Math.random() * letters.length)];
    el.style.setProperty("--dx", `${rand(-0.12, 0.12) * strength}em`);
    el.style.setProperty("--dy", `${-rand(0.08, 0.3) * strength}em`);
    el.style.setProperty("--rot", `${rand(-16, 16) * strength}deg`);
    el.style.setProperty("--s", String(1 + rand(0.04, 0.16) * strength));
    el.style.setProperty("--dur", `${rand(0.32, 0.5)}s`);
    el.classList.remove("hit");
    void el.offsetWidth; // restart animation
    el.classList.add("hit");
  }

  function restart(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function onBeat(strength) {
    if (reduceMotion) return;
    danceLetter(strength);
    if (strength > 0.55) danceLetter(strength * 0.8);
    const now = performance.now();
    if (strength > 0.8 && now - lastThump > 380) { lastThump = now; restart(logo, "thump"); }
    if (strength > 0.7 && now - lastBump > 300) { lastBump = now; restart(fitas, "bump"); }
    if (strength > 0.85 && now - lastBurst > 650 && confetti.childElementCount < 60) { lastBurst = now; burst(strength); }
  }

  // onset detection on the surdo band: spectral flux vs. its own recent history
  const history = [];
  let prevLow = 0;
  let lastBeat = 0;
  let lastWhistle = 0;
  let lastFallback = 0;
  let lastThump = 0;
  let lastBump = 0;
  let lastBurst = 0;

  function frame(now) {
    if (!playing) return;

    if (analyser && ctx.state === "running") {
      analyser.getByteFrequencyData(bins);
      const low = bandAvg(45, 160);
      const flux = Math.max(0, low - prevLow);
      prevLow = low;

      history.push(flux);
      if (history.length > 45) history.shift();
      const mean = history.reduce((s, v) => s + v, 0) / history.length;
      const sd = Math.sqrt(history.reduce((s, v) => s + (v - mean) ** 2, 0) / history.length);

      if (flux > mean + 1.3 * sd && flux > 4 && now - lastBeat > 105) {
        lastBeat = now;
        onBeat(Math.min(1, 0.35 + flux / 30));
      }

      // apito: a loud, narrow tone between 2 and 4.5 kHz
      const w = bandPeakRatio(2000, 4500);
      if (w.peak > 170 && w.ratio > 1.9 && now - lastWhistle > 700) {
        lastWhistle = now;
        if (!reduceMotion) restart(stamp, "whistle");
      }

      hero.style.setProperty("--energy", (low / 255).toFixed(3));
    } else if (now - lastFallback > 390) {
      // ~77 bpm half-time surdo, same feel as the recording
      lastFallback = now;
      onBeat(0.7);
    }

    requestAnimationFrame(frame);
  }


  function syncUi() {
    document.body.classList.toggle("is-live", playing);
    toggles.forEach((b) => {
      b.setAttribute("aria-pressed", String(playing));
      const label = b.querySelector(".btn__label");
      if (label) label.textContent = playing ? label.dataset.on : label.dataset.off;
    });
  }

  async function start() {
    if (location.protocol !== "file:") connectAnalyser(); // file:// would mute a MediaElementSource
    if (ctx && ctx.state === "suspended") await ctx.resume();
    try {
      await audio.play();
    } catch (e) {
      return;
    }
    playing = true;
    syncUi();
    requestAnimationFrame(frame);
  }

  function stop() {
    audio.pause();
    playing = false;
    hero.style.setProperty("--energy", "0");
    syncUi();
  }

  if (audio) {
    toggles.forEach((b) => b.addEventListener("click", () => (playing ? stop() : start())));
    audio.addEventListener("pause", () => { if (playing) stop(); });
  }

  /* ---------------- ribbons: fill width, loop seamlessly ---------------- */
  function fillRibbons() {
    document.querySelectorAll(".fita span").forEach((span) => {
      const unit = span.dataset.unit || (span.dataset.unit = span.textContent);
      span.textContent = unit;
      const k = Math.max(1, Math.ceil(span.parentElement.offsetWidth / Math.max(1, span.offsetWidth)));
      span.textContent = unit.repeat(k * 2); // two identical halves, animation moves by 50%
    });
  }
  fillRibbons();
  if (document.fonts) document.fonts.ready.then(fillRibbons);
  let resizeT;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(fillRibbons, 150); });

})();
