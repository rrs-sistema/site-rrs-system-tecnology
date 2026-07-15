# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **purely static website** (HTML5 + CSS3 + vanilla JavaScript) for "RRS System Technology". See `README.md` for the product overview.

- **No dependencies, no build step, no package manager, no backend.** There is no `package.json`, lockfile, or bundler. External libraries (Font Awesome, Google Fonts) load from CDNs at runtime, so full styling/icons require internet access; the site still functions offline with fallbacks.
- **No lint/test/build tooling is configured.** There are no automated tests, linters, or build commands in this repo.
- **Run it locally** by serving the repo root with any static file server, e.g. `python3 -m http.server 8000` (then open `http://localhost:8000/index.html`). `index.html` can also be opened directly via `file://`.
- **Pages:** `index.html` (landing page), `politica-de-privacidade.html`, `exclusao-de-dados.html`. JS lives in `assets/js/script.js`; styles in `assets/css/`.
- **Contact form is client-side only:** submitting builds a `mailto:` link (no API/backend). In a headless/VM browser this triggers an OS "choose mail application" dialog — that is expected, not a bug.
