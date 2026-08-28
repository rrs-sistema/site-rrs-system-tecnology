# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **purely static website** (HTML5 + CSS3 + vanilla JavaScript) for "RRS System Technology". See `README.md` for the product overview.

- **No dependencies, no build step, no package manager, no backend.** There is no `package.json`, lockfile, or bundler. External libraries (Font Awesome, Google Fonts) load from CDNs at runtime, so full styling/icons require internet access; the site still functions offline with fallbacks.
- **No lint/test/build tooling is configured.** There are no automated tests, linters, or build commands in this repo.
- **Run it locally** by serving the repo root with any static file server, e.g. `python3 -m http.server 8000` (then open `http://localhost:8000/index.html`). `index.html` can also be opened directly via `file://`.
- **Pages:** `index.html` (landing page), product details (`produto-reobote-pdv.html`, `produto-cardapio-digital.html`, `produto-ordem-de-servicos.html`), legal/support pages (`licencas.html`, `termos-de-uso.html`, `politica-de-suporte.html`, `central-de-ajuda.html`, product-specific policies, `politica-de-privacidade.html`, `exclusao-de-dados.html`). JS lives in `assets/js/script.js`; styles in `assets/css/` (`style.css`, `product.css`, `legal.css`).
- **Test installers (PDV / Cardápio):** product pages currently route visitors to request a test version through contact. If direct download is enabled later, place the binaries in `assets/downloads/` using the names documented in `README.md`.
- **Contact form:** submitting uses the Formspree endpoint configured in `index.html`, with a mailto fallback in the client script. Form interest can be preselected via `index.html?interesse=Reobote%20PDV#contato`.
