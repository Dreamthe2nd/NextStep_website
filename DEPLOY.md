# Deploying NextStep Hyderabad to Netlify

## 1. Local Verification
```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## 2. Deploy Preview vs Production
Using the Netlify CLI:
```bash
# Deploy a shareable preview URL
npx netlify-cli deploy

# Deploy to production (nextstephyderabad.netlify.app)
npx netlify-cli deploy --prod
```

## 3. Enabling Live Gemini Flash Research Scout
The frontend automatically calls `POST /api/scout`, which routes to `netlify/functions/scout.ts`.
While `GEMINI_API_KEY` is unset, the function returns `503` and the UI gracefully shows curated offline results.

To activate the live AI Scout:
1. Open **Netlify Dashboard → Site configuration → Environment variables**.
2. Add `GEMINI_API_KEY` with your Google AI Studio key (kept server-side only).
3. Trigger a redeploy. No frontend code changes are required.

## 4. Updating Opportunities & Content
Edit the JSON files in `src/data/` (`opportunities.json`, `site.json`, `consultations.json`, `team.json`, `scout-fallback.json`).
To connect a headless CMS later, update `getSiteData()` in `src/data/provider.ts`.
