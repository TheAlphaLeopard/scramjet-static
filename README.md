# Scramjet Static GitHub Pages Site

This repository has been converted into a fully static GitHub Pages front-end for Scramjet.

## What changed

- Removed the Node.js proxy server and all server-side dependencies.
- Converted the browser UI into a static GitHub Pages site under `docs/`.
- Updated asset loading to use CDN-hosted Scramjet and BareMux browser bundles.
- Added a configurable `docs/config.js` so the frontend can point to a remote Scramjet/WISP backend.

## Deploying on GitHub Pages

1. Set GitHub Pages to serve from `main` branch and `docs/` folder.
2. Verify `docs/config.js` contains a valid remote `wispUrl`.
3. Push the repository to GitHub.

Your site will then be available at `https://<username>.github.io/<repo>/`.

## Customization

Open `docs/config.js` and set your remote backend URL:

```js
window.SCRAMJET_CONFIG = {
  wispUrl: "wss://your-remote-backend.example.com/wisp/",
  transports: {
    libcurl: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport@1.5.2/dist/index.mjs",
    bareMuxWorker: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@2.1.7/dist/worker.js"
  },
  scramjetFiles: {
    all: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.all.js",
    wasm: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.wasm.wasm",
    sync: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.sync.js"
  }
};
```

## Local preview

```bash
pnpm install
pnpm preview
```

If you do not use `pnpm`, you can also run a simple static server with `npx serve docs`.

## Important note

GitHub Pages is static hosting only. The Scramjet proxy still requires a remote WISP backend to operate. This repo now provides only the static front-end and configuration for that backend.
