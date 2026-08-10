# Marrow — a story studio

An AI book-generator: spark → foundation → deep cast → outline → chapter drafting,
with a continuity engine and voice matching. Built with React + Vite, deployed on
Netlify, and connected to Claude through a serverless proxy that keeps your API key
on the server (never in the browser).

## How it connects to Claude

The browser calls `/api/claude`. Netlify routes that to the function in
`netlify/functions/claude.js`, which adds your secret `ANTHROPIC_API_KEY` and
forwards the request to Anthropic. Your key is only ever read server-side.

You need an Anthropic API key: https://console.anthropic.com → API Keys.
Note that every generation spends tokens on **your** key, so if you share the site
publicly, add authentication and watch your usage.

---

## Deploy to Netlify (recommended: connect a Git repo)

1. Push this folder to a new GitHub/GitLab repository.
2. In Netlify: **Add new site → Import an existing project** and pick the repo.
3. Netlify reads `netlify.toml`, so the build settings are already correct
   (build `npm run build`, publish `dist`, functions `netlify/functions`).
4. Before the first deploy finishes, add your key under
   **Site settings → Environment variables**:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your `sk-ant-...` key
5. Deploy. When it's live, open the site and start a story.

If you added the env var after the first build, trigger a redeploy so the
function picks it up (**Deploys → Trigger deploy → Deploy site**).

## Alternative: deploy from your machine with the Netlify CLI

```bash
npm install
npm install -g netlify-cli
netlify deploy --build --prod
```

Set the key once with `netlify env:set ANTHROPIC_API_KEY sk-ant-...` (or in the dashboard).

---

## Run it locally

Use the Netlify CLI so the `/api/claude` function runs alongside the app:

```bash
npm install
cp .env.example .env        # put your real key in .env
netlify dev                 # serves the app + function at http://localhost:8888
```

(Plain `npm run dev` runs the Vite app but NOT the function, so Claude calls will 404.)

---

## Your work / saving

The app autosaves to your browser's `localStorage`. Use **Save** in the top bar to
export the whole story as text you can keep, and **Open** to paste it back — this is
how you move a story between browsers or keep a backup.

---

## Project structure

```
index.html                 app shell
vite.config.js             Vite + React
netlify.toml               build + /api/claude redirect
netlify/functions/claude.js  the serverless proxy (holds the key)
src/main.jsx               React entry
src/Marrow.jsx             the whole app
src/index.css              full-height layout
```

## Notes / next steps

- **Bring-your-own-key variant:** if you'd rather each visitor supply their own key
  (no server, they pay their own way), the app can call Anthropic directly from the
  browser using the `anthropic-dangerous-direct-browser-access: true` header. Ask and
  it can be swapped in.
- **Real .docx export** needs a library that couldn't run in the original sandbox but
  can here — a good enhancement now that it's a normal Node project.
- **Multi-device sync / accounts** would mean moving saves from `localStorage` to a
  database behind a couple more functions.
