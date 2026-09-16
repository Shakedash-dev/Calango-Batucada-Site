# Calango Batucada - design notes

## 1. Research (16 sites attempted, 13 reviewed)

| Site | What it does | Take / avoid |
|---|---|---|
| [Bloco Fogo](https://www.blocofogo.com/) (UK) | Carnival GIFs, Watch / Play / Book cards, testimonials | Take: three clear paths (hear, join, book). Avoid: stock card grid |
| [Wellington Batucada](https://batucada.org.nz/) (NZ) | 2010s WordPress, sidebar, banner photo | Avoid: all of it. Generic, dated |
| [Sambatucada](https://sambatucada.org/) (Vermont) | Lists instruments, rehearsal info, Caymmi quote | Take: explain the instruments, cultural roots |
| [Fogo Azul NYC](https://www.fogoazulnyc.com/) | Founder story as voice | Take: a real voice beats polish |
| [Bloco Swingueira](http://www.swingueira.gr/en/) (Athens) | Bridge WP theme, slider, multilingual | Avoid: slider hero |
| [Bay Batucada](https://www.baybatucada.org.nz/) (NZ) | Book / Join funnel, casual footer copy | Take: conversational copy. Avoid: template look |
| [Olodum](https://olodum.com.br/) (Salvador) | Dark bg, event cards, strong identity colors | Take: bold flat color identity, culture first |
| [STOMP](https://www.stomponline.com/) | One loud color, logo does the work | Take: commit to one color hard |
| [Batala Austria](https://www.batala.at/en/mundo-batala/index.html) | Origin story (bate lá / Obatalá) | Take: tell the story behind the name |
| [Batala New York](https://www.batalanewyork.org/home) | Red/black, axé pattern dividers, FAQ | Take: pattern as section divider |
| [Batala San Francisco](https://batalasanfrancisco.com/) | Local landmark hero | Take: tie to place |
| [Batala Lancaster](https://batalalancaster.com/) | Book / Watch / Join nav | Take: action-first nav |
| [Batala Portsmouth](https://www.batalaportsmouth.com/) | Google Sites template | Avoid |
| batala.com, monobloco.com.br, meute.de, afrobloco.com, blocosderua.com | DNS / TLS / 403 errors | - |

**Takeaway:** the genre is almost all templates plus a photo slider. The bar is low. Copying other band sites gives
"band site #400". Better source: **Brazilian street graphics**:

- **Xilogravura / cordel woodcuts** (Northeast Brazil - calango country): black ink, cream paper, rough edges.
- **Lambe-lambe posters**: wheatpasted street posters, huge condensed wood type, torn edges, tape.
- **Fitas do Senhor do Bonfim**: the colored wish ribbons of Salvador, used as dividers.
- **Olodum / Bahia colors**: flat, loud, no gradients.

## 2. Plan - what makes it not basic

1. **The site plays.** A real 16-step bateria sequencer (Web Audio, synthesized, no audio files). It comes loaded with a
   samba-reggae-ish groove. Visitors toggle hits, change BPM, break it, reset it. It's the centerpiece,
   not a gimmick in the corner.
2. **The wordmark hears the surdo.** Hero letters jump on every low-surdo hit while the groove plays.
   Each letter also stretches on hover (variable font `wdth` axis).
3. **A calango crawls the page.** A small woodcut lizard runs down the right edge as you scroll and turns around
   when you scroll up.
4. **Honest about being new.** No fake gig calendar or empty gallery. A "Year zero" section turns "just started"
   into the story: forming -> rehearsals -> street.
5. **Recruiting poster, not a form.** "PROCURA-SE" wheatpaste poster with tape and torn edges.

## 3. Anti-generic rules used in implementation

- No gradient blobs, glassmorphism, purple, emoji icons, rotating circle-text badges, or three identical feature cards.
- No Inter / Space Grotesk. Display: **Anybody** (variable width, animated). Body: **Familjen Grotesk**.
- Fixed brand palette: paper `#F1E4CB`, ink `#17130E`, calango green `#A8CF3A`, urucum red `#D9461B`,
  sun `#F5B20F`, Bahia teal `#1E6C74` (sparingly). Swap to match the real logo once it's in.
- Hard offset shadows and thick ink borders instead of soft shadows.
- Paper grain plus an SVG displacement filter for a printed, slightly off look.
- Left-aligned, asymmetric layouts. Things are rotated a degree or two, like pasted by hand.
- Copy has a voice and uses a bit of Portuguese (bateria, ensaio, bora) where it fits.
- No build step, no framework: plain HTML / CSS / JS. GitHub Pages serves it as-is.
- `prefers-reduced-motion` respected. Audio only starts on click.
