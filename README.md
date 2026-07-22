# Koba Glue Map

Koba Glue Map visualizes cannabis-related businesses, sensitive locations, and
club-compliant zones on Google Maps for Montevideo, Uruguay. It's a static
single-page app — no backend server, no paid hosting.

- **Frontend**: Vite + React + TypeScript, HeroUI components, Google Maps
  JavaScript API.
- **Data**: Firebase Firestore (free Spark plan), read directly from the
  browser.
- **Hosting**: GitHub Pages, deployed by a GitHub Actions workflow.
- **Data refresh**: a manual local script (`npm run sync`) that pulls fresh
  places from the Google Places API and writes them to Firestore. There's no
  scheduled job — rerun it whenever you want an updated dataset.

## One-time setup

### 1. Firebase project

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore Database** (production mode, Spark/free plan is enough).
3. Deploy the security rules in `firestore.rules` (public read, no client
   writes) — either paste them into the Firestore Rules tab in the console, or
   install the Firebase CLI and run `firebase deploy --only firestore:rules`.
4. Under **Project settings > General > Your apps**, add a Web app and copy
   the config values into `VITE_FIREBASE_*` in your `.env` (see
   `.env.template`).
5. Under **Project settings > Service accounts**, click **Generate new private
   key**. Save the downloaded JSON as `serviceAccountKey.json` in the project
   root (already git-ignored) — this is what `npm run sync` uses to write
   data, bypassing the read-only security rules.

### 2. Google Cloud / Maps Platform

1. In the same (or a linked) Google Cloud project, enable **Places API (New)**
   and **Maps JavaScript API**.
2. Create two API keys:
   - A **server key** for `GOOGLE_MAPS_API_KEY` (used only by `npm run sync`,
     never shipped to the browser — restrict it to the Places API).
   - A **browser key** for `VITE_GOOGLE_MAPS_API_KEY`, restricted by **HTTP
     referrer** to your GitHub Pages domain (e.g. `https://<user>.github.io/*`)
     and `http://localhost:*` for local dev.

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Copy `.env.template` to `.env` and fill in the values from steps 1-2.

## Local development

```bash
npm run dev
```

## Refreshing the dataset

Whenever you want updated places data (new businesses, updated schools, etc.):

```bash
npm run sync
```

This reads `GOOGLE_MAPS_API_KEY` and `GOOGLE_APPLICATION_CREDENTIALS` from
`.env`, queries Google Places, and writes the result to Firestore. Any open
tab of the app picks up the new data live (no reload needed) since it
subscribes to Firestore with `onSnapshot`.

## Deployment

1. Push to GitHub. In the repo's **Settings > Pages**, set the source to
   "GitHub Actions".
2. Add these repository secrets (**Settings > Secrets and variables >
   Actions**): `VITE_GOOGLE_MAPS_API_KEY`, `VITE_FIREBASE_API_KEY`,
   `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
   `VITE_FIREBASE_APP_ID`, and optionally `VITE_DEFAULT_LOCATION`.
3. Push to `main` — `.github/workflows/deploy.yml` builds the app and
   publishes `dist/` to GitHub Pages.

## Adding a city

City config lives in `src/lib/config/cities.ts` (name, club-safe buffer
distance, applicable restricted categories) and needs a land-boundary GeoJSON
in `src/data/land/<city>.json` registered in `src/data/land/index.ts`. The
`sync` script and reference-city search area are configured in
`src/lib/config/reference-city.ts`.

## Tech stack

- Vite + React + TypeScript
- HeroUI for components
- Google Maps Platform (Maps JavaScript API + Places API)
- Firebase Firestore
- GitHub Actions + GitHub Pages
