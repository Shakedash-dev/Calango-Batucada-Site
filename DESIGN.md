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

## 2. Plan - what makes it not basic (v2, Hebrew)

1. **Real carnaval, reacting live.** "הדליקו את הקרנבל" plays a real field recording (Felix Blume, Bloco Lucero,
   Avenida Paulista, São Paulo, CC0), trimmed to start on the repinique call. Web Audio *listens* to it:
   surdo hits make the "קרנבל!" letters jump, strong hits thump the logo, whistles (apito) shake the stamp,
   the ribbons bounce (they keep a readable speed) and confetti bursts from the drum. Nothing is synthesized.
2. **Booking first.** Main section is "קרנבל באירוע שלכם" with event types and one WhatsApp CTA to Simba.
3. **Real proof.** The band's own drum photo, with the logo painted on the head, pinned like a polaroid.
4. **Recruiting poster, not a form.** "דרושים ודרושות" wheatpaste poster, WhatsApp CTA.
5. **The calango stays in the background.** Faint silhouettes only, no copy about it.

## 3. Anti-generic rules used in implementation

- No gradient blobs, glassmorphism, purple, emoji icons, rotating circle-text badges, or three identical feature cards.
- Hebrew, RTL. Display: **Karantina** (condensed Hebrew poster face). Body: **Rubik**.
- Brand palette sampled from the painted logo: paper `#FBF0DF`, ink `#17130E`, forest green `#2E592A`,
  red `#D72E14`, mustard `#F59B10`.
- The logo is brush/watercolor, the site type is woodcut/poster. Contrast on purpose: the logo is the one
  painted, human thing on the page, everything around it is flat ink.
- Hard offset shadows and thick ink borders instead of soft shadows.
- Paper grain plus an SVG displacement filter for a printed, slightly off look.
- Left-aligned, asymmetric layouts. Things are rotated a degree or two, like pasted by hand.
- Copy has a voice, Hebrew with Brazilian instrument names (סורדו, קאישה, אפיטו).
- No build step, no framework: plain HTML / CSS / JS. GitHub Pages serves it as-is.
- `prefers-reduced-motion` respected. Audio only starts on click.
