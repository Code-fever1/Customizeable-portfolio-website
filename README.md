# Portfolio Builder

A React + Vite portfolio builder where users can:
- create/edit profile data
- customize templates and backgrounds
- attach a CV
- preview changes live while editing
- export profile JSON
- download a hosting-ready website ZIP

## Tech Stack

- Vite
- React + TypeScript
- Tailwind CSS
- shadcn/ui

## Getting Started

```sh
npm install
npm run dev
```

Open `http://localhost:8080`.

## Main Features

1. Builder with live side-by-side preview (`Create Yours` page).
2. Profile import/export as JSON.
3. CV attachment (included in profile data and available as download button on portfolio page).
4. Template and background options:
   - `neo` / `minimal`
   - solid / gradient / image backgrounds
5. Saved profiles in localStorage with slug-based routes (`/u/:slug`).
6. Exported-build UI rules:
   - hide `Create Yours`
   - hide `Download Website ZIP`
   - hide `Download Profile JSON`
   - keep `Projects`, `CV`, and `Contact` actions

## Website ZIP Export Behavior

`Download Website ZIP` uses two modes:

1. Server export (preferred): calls `POST /__export/web` and returns a ZIP built from the export pipeline.
2. Client fallback (for deployed/static hosting): builds ZIP in-browser from currently hosted files + generated `profile.json`.

### ZIP structure

- ZIP contains files at the root (no `dist/` subfolder in deployed fallback).
- Upload extracted files directly to static hosting.

## Scripts

```sh
npm run dev
npm run build
npm run preview
npm run test
npm run lint
```

## Notes

- Profiles are stored locally in browser storage.
- The export endpoint exists in Vite config for local/export-server flows.
- Large bundled JS warning may appear after adding ZIP tooling (`jszip`); build still succeeds.
