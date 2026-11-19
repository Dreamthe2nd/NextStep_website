# NextStep Hyderabad — Agent Handoff & Execution Order

> **For any agent picking this up (Gemini, Claude, human):**
> 1. Read this file top to bottom. 2. Find the first unchecked `[ ]` step. 3. Do ONLY that step.
> 4. Run its **Verify** command. 5. Tick the box, add a one-line note under **Log**, save. Repeat.
> Full design rationale: `C:\Users\h1465\.gemini\antigravity\brain\6c0247cd-9d07-4917-80dc-cdbeb0578236\upgrade_plan.md`

## Context (do not re-ask the user)
- Project: `C:\Users\h1465\.gemini\antigravity\scratch\nextstep-site` (Vite 8, React 19, Tailwind v4 via `@tailwindcss/vite`, oxlint). Windows + PowerShell.
- Current working prototype: `src/App.jsx` (single file, ~1100 lines). It is the **visual + copy reference**; port from it, don't lose copy.
- Dev server: `npm run dev -- --port 5173` → http://localhost:5173
- **North star (user's words): "a site that is naturally Instagrammable, and appeals easily, hence animations and transitions are key."** Every section must have one screenshot-worthy frame and one signature transition.

### Locked decisions (from user interview)
| Topic | Decision |
|---|---|
| Phases | 1 Motion+restructure → 2 Production → 3 Features |
| Structure | `src/data`, `src/components`, `src/hooks`, `src/lib`; **TypeScript strict** |
| Hero | NO chrome ribbon. **Constellation of Opportunities** (preloader stars continue into hero; 6 amber "opportunity stars" = real data; hover → hairline links + mini card; scroll → stars converge into spotlight) **+ Departure Board** split-flap strip under headline |
| Motion | **Lenis + GSAP ScrollTrigger** (scroll scenes) + **motion** (framer-motion successor, `import { motion } from 'motion/react'`) for springs. Respect `prefers-reduced-motion` |
| Gemini | Frontend only now. `lib/scoutClient.ts` → `POST /api/scout`; dormant `netlify/functions/scout.ts` reads server env `GEMINI_API_KEY`; 503 → curated fallback. **Remove client API-key modal.** |
| Deploy | Local only + `netlify.toml` + `DEPLOY.md`. Do NOT deploy. |
| Deadlines | Verbatim labels + computed status (Asia/Kolkata EOD): `Closes in N days` / `Closing soon` (≤7d) / `Closed — check for 2027 cycle` / `Rolling`; open-first sort; "Open only" toggle |
| Features | Shortlist (localStorage), .ics + Google Calendar, detail drawer `#opp/<id>`, share (navigator.share / copy / WhatsApp), newsletter (hidden while `meta.newsletterFormUrl` empty), **Share-to-Story 1080×1920 PNG** |
| Verbatim content | All 6 opportunities, mission, pillars, ticker, consultation + team copy, form URLs, Instagram URL — see `src/App.jsx` `DATA_STORE` |

### Instagrammable design rules (apply in every step)
1. **One poster frame per section** — a composition that looks good as a 4:5 or 9:16 screenshot (big serif-italic + Swiss sans contrast, generous void, one glow).
2. **Signature transitions** (use these, don't invent new ones per section):
   - `maskReveal` — headline lines rise from a clip mask (GSAP, 0.9s, `expo.out`, stagger 0.08)
   - `flapFlip` — split-flap character flip (Departure Board, deadline chips on change)
   - `inkInvert` — scrubbed black→white canvas inversion via CSS vars `--bg/--fg/--hairline`
   - `springPop` — motion spring `{ type:'spring', stiffness: 380, damping: 30 }` for modals/drawers/cards
   - `magnet` — buttons/pills attract to cursor ±6px (desktop only)
3. Film grain overlay (2–3% opacity SVG noise) + warm crimson/amber aura on dark sections.
4. Mobile (390px) gets its own composition, not a squashed desktop.

---

## Execution Order

### PHASE 1 — Restructure + TypeScript + Cinematic Motion
- [x] **1.1 Tooling.** `npm i gsap lenis motion @fontsource/inter @fontsource/instrument-serif` and `npm i -D typescript @types/node vitest`. Created `tsconfig.json`, `vite.config.ts`. Deleted `src/App.css`, `src/assets/*`.
- [x] **1.2 Data layer.** Created `src/data/schema.ts`, `src/data/*.json`, `src/data/provider.ts`, `src/context/SiteDataContext.tsx`.
- [x] **1.3 Pure libs + tests.** Created `src/lib/date.ts`, `src/lib/cn.ts`, `src/lib/date.test.ts` (8/8 tests green).
- [x] **1.4 Theme + globals.** Updated `src/index.css` with `@fontsource/inter`, `@fontsource/instrument-serif`, `@theme` tokens, `:root` vars, film grain, reduced-motion.
- [x] **1.5 Motion hooks.** Created `useReducedMotion.ts`, `useLenis.tsx`, `lib/motion.ts`, `useMagnet.ts`.
- [x] **1.6 Layout components.** Created `lib/stars.ts`, `Preloader.tsx`, `PrimaryNav.tsx`, `StickySubNav.tsx`, `Footer.tsx`, `SectionIndex.tsx`, `Pill.tsx`, `Grain.tsx`.
- [x] **1.7 Hero.** Created `ConstellationCanvas.tsx`, `DepartureBoard.tsx`, `Hero.tsx`, `useCursorPreview.tsx`.
- [x] **1.8 Directory + Consult + Team.** Created `Directory.tsx`, `OpportunityCard.tsx`, `DeadlineChip.tsx`, `Consultations.tsx`, `Team.tsx`.
- [x] **1.9 Finale.** Created `Finale.tsx`, `KineticStarburst.tsx`, `Newsletter.tsx`.
- [x] **1.10 Scout (frontend).** Created `lib/scoutClient.ts`, `lib/scoutClient.test.ts` (2/2 tests green), `hooks/useScout.ts`, `ScoutDrawer.tsx`, `ScoutLauncher.tsx`.
- [x] **1.11 Wire-up.** Created `src/App.tsx`, `src/main.tsx`, updated `index.html`, deleted `src/App.jsx` + `src/main.jsx`.

### PHASE 2 — Production hardening
- [x] **2.1 SEO.** Updated `index.html` with title, description, canonical, theme-color `#050507`, OG/Twitter tags, JSON-LD Organization, `public/favicon.svg`.
- [x] **2.2 A11y pass.** Skip link, landmarks, `aria-labelledby`, radiogroup filter pills w/ arrow keys, focus return on dialogs, AA contrast.
- [x] **2.3 Perf.** `React.lazy` ScoutDrawer/OpportunityDrawer/KineticStarburst; canvases pause off-screen and on `document.hidden`; `manualChunks` for gsap/lenis/motion.
- [x] **2.4 Netlify scaffolding.** Created `netlify.toml`, `netlify/functions/scout.ts`, `DEPLOY.md`.

### PHASE 3 — Features
- [x] **3.1 Hash route + detail drawer.** Created `hooks/useHashRoute.ts` + test, `OpportunityDrawer.tsx`.
- [x] **3.2 Shortlist.** Created `hooks/useShortlist.ts`, bookmark toggles, `ShortlistPanel.tsx` + count badge in sub-nav.
- [x] **3.3 Calendar.** Created `lib/calendar.ts` + test.
- [x] **3.4 Share.** Created `lib/share.ts` (navigator.share / copy / WhatsApp).
- [x] **3.5 Share-to-Story (Instagram).** Created `lib/storyCard.ts` (1080×1920 PNG canvas export).
- [x] **3.6 Final verification.** typecheck, lint, test (14/14), build; browser pass incl. 390px mobile; screenshots in walkthrough.md.

---

## Log
<!-- one line per completed step: date · step · agent · note -->
- 2026-11-18 · plan + handoff created · Claude
- 2026-11-18 · Phase 1–3 complete + verified (typecheck, lint, 14/14 tests, build, desktop & mobile browser pass) · Gemini
- 2026-11-18 · Stepped Horizon theme redesign (#09090b/#121215/#d9b56d/#faf8f2), poster hero, Directory Departure Board relocation, tactile button springs/ripples, mobile header & finale polish verified (typecheck 0 errors, oxlint 0 errors/7 warnings, 14/14 tests, build 1.54s, 1280x800 & 390x844 browser checks green) · Gemini
- 2026-11-18 · Restored blue-heavy WebGL starfield Hero + Galaxy, added Cypher-style white splash Preloader, StarMorphCanvas (190 ambient stars + 340-star morphing Open Book -> Geodesic Football -> Scientific Apparatus), GoldMarginElements (Books/Play/Sport + Lab/Optics/STEM stack), 3-card Founding Team (Gaurav Koya + Shlok Jain portraits/quotes + Recruiting card), and rounded white curtain Finale; verified typecheck/oxlint 0 errors, 14/14 tests, build 1.50s, desktop 1280x800 & mobile 390x844 green · Gemini
