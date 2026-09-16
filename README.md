# calango-batucada.com

Static site for Calango Batucada. Plain HTML / CSS / JS, no build step. Design research and rationale: [DESIGN.md](DESIGN.md).

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html      page
css/style.css   all styles, palette tokens at the top
js/main.js      sequencer + audio engine, wordmark fit/pulse, scroll lizard, ribbons
favicon.svg     lizard icon
images/         logo.png (nav), og.png (1200x630 social preview) - add these
CNAME           calango-batucada.com
```

Edit the starter groove in `js/main.js` (`INSTRUMENTS[].pattern`, 16 chars, `x` = hit).

## GitHub Pages + domain

1. Repo Settings -> Pages -> Source: deploy from branch `main`, folder `/ (root)`.
2. At the domain registrar, DNS:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` -> `shakedash-dev.github.io`
3. Settings -> Pages: custom domain `calango-batucada.com`, then tick **Enforce HTTPS** once the cert is issued.

## Placeholders to replace

- `hello@calango-batucada.com` - needs email forwarding set up on the domain, or swap for a real address.
- `instagram.com/calangobatucada` - swap for the real handle.
