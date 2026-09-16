# calango-batucada.com

Static site for Calango Batucada. Plain HTML / CSS / JS, no build step. Design research and rationale: [DESIGN.md](DESIGN.md).

## Run locally

From the repo root (any static server works, no install needed):

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Use a server, not `file://` - fonts and the audio work better over http.

## Structure

```
index.html      page
css/style.css   all styles, palette tokens at the top
js/main.js      plays the carnaval recording, beat/whistle detection drives the dancing letters, ribbons
audio/          carnaval-sao-paulo.mp3 (CC0, Felix Blume, Bloco Lucero, São Paulo)
images/src/     original logo files
images/         web versions (transparent webp logos, favicon, apple-touch-icon, og.png share image)
CNAME           calango-batucada.com
```

## Contact links

- WhatsApp (Simba, 972549791966): 4 links in `index.html` - booking message on nav/booking/footer, join message on the poster.
- Instagram: `https://www.instagram.com/calango.batucada/` - hero pill + footer button.

## Audio

`audio/carnaval-sao-paulo.mp3` is a 90s cut of [Felix Blume - Pre-Carnaval in Sao Paulo with the Bloco Lucero](https://freesound.org/people/felix.blume/sounds/384104/) (CC0),
from 105.40s to 195.40s. No processing besides a 60ms fade-in, 2.5s fade-out and peak normalize.

## GitHub Pages + domain

1. Repo Settings -> Pages -> Source: deploy from branch `main`, folder `/ (root)`.
2. At the domain registrar, DNS:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` -> `shakedash-dev.github.io`
3. Settings -> Pages: custom domain `calango-batucada.com`, then tick **Enforce HTTPS** once the cert is issued.
