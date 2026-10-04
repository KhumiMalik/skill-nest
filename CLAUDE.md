# Greenfield Academy — project guide for Claude

This file hands over the project to any new Claude Code session. Read it fully before doing anything,
then read `frontend/docs/architecture.md` and `frontend/docs/api-contract.md`.

## What this project is

A production-grade school website for the fictional **Greenfield Academy**, built with Next.js in `frontend/`.
A REST backend (Node.js or Python, undecided) will be built later in `backend/` (empty for now). Until then the
frontend runs on a mock API, and switching to the real API must only change `frontend/src/lib/api` internals and
the `API_BASE_URL` env variable.

The visual design comes from an HTML template we built earlier at **`C:\laragon\www\school\`** (17 pages,
`assets/css/style.css`, `assets/js/main.js`). It is our own code. **Never modify that folder.** Look at it to match
the layout and section structure of each page.

## The user

- Is learning Next.js: explain non-obvious decisions briefly and plainly.
- Wants senior, production-grade quality, but simple, explicit code over clever abstractions.

## Working process (agreed, follow strictly)

1. Work **phase by phase**. After each phase run: `npm run typecheck`, `npm run lint`, `npm run format:check`,
   `npm test`, `npm run build`, then `npm run e2e` (needs the build). Fix every error.
2. End each phase with a summary, explanations of non-obvious decisions, a reminder to commit (the user commits
   from `C:\laragon\www\greenfield`), and **wait for the user to say "continue"**.
3. **Read the docs bundled with the installed Next.js** in `frontend/node_modules/next/dist/docs/` before using
   routing, caching, rendering, proxy or server action APIs. This is Next.js 16 and differs from older versions.
4. **Don't add npm packages beyond the approved list without asking.**
5. Check visuals by taking Playwright screenshots of the production build (desktop and mobile) and compare with the
   HTML template. Axe does not catch contrast problems on image backgrounds, so look yourself.

## Phases

| #   | Phase                                                                                                | Status                     |
| --- | ---------------------------------------------------------------------------------------------------- | -------------------------- |
| 1   | Analysis + plan                                                                                      | Done, approved             |
| 2   | Foundation: setup, env, styles, fonts, layout, header/footer, error pages, lib/api, headers, tooling | Done                       |
| 3   | Core pages: Home, About, Programs, Faculty                                                           | **Done** (awaiting commit) |
| 4   | News, Notices, Events (lists, URL filters, calendar view, detail pages)                              | **Next**                   |
| 5   | Admissions, Careers, FAQ, Gallery (+ Campus, Student Life, Alumni, Privacy, Terms)                   | To do                      |
| 6   | Forms: contact, admission inquiry, newsletter, event registration (server actions)                   | To do                      |
| 7   | SEO: metadata, JSON-LD, OG images, sitemap, robots; `/api/revalidate` route                          | To do                      |
| 8   | Quality: tests, Playwright e2e for every form/filter, a11y audit, Lighthouse (mobile 90+), CI, docs  | To do                      |

At the end of Phase 5, enable `typedRoutes: true` in `next.config.ts` (deferred because it rejects links to pages
that don't exist yet).

## Decisions already made (don't re-ask)

- School name: **Greenfield Academy**. Time zone: **UTC** (one setting: `siteConfig.timeZone`).
- Mock content must be **realistic school content, not lorem ipsum**: news, events across several months, faculty,
  programs, notices, gallery albums, FAQs. Images stay as `placehold.co` placeholders.
- **Rendering:** Cache Components (`cacheComponents: true`). Feature `data.ts` functions use `"use cache"` +
  `cacheLife(...)` + `cacheTag(...)` (tags like `news`, `news:{slug}`, `events`, `event:{slug}`, `faculty`,
  `programs`, `pages:{key}`). Request-dependent parts (search params) stream inside `<Suspense>`.
- **Time-dependent output** (upcoming vs past events): cached with `cacheLife("hours")` or computed at request time
  after `connection()`. Never call `new Date()` / `Date.now()` in a prerendered component outside a cache scope,
  because the build fails.
- **Revalidation webhook** (Phase 7): `POST /api/revalidate`, `Authorization: Bearer {REVALIDATE_SECRET}`, body
  `{ "tags": [...] }`, uses `revalidateTag(tag, { expire: 0 })`. Server actions use `updateTag`.
- **CSP:** static policy in `next.config.ts` (`script-src 'self' 'unsafe-inline'`), not nonces, because nonces
  force dynamic rendering on every page. Evaluate experimental SRI in Phase 8.
- **Filters** (news category, event month, faculty department, search) live in URL search params, read on the server.
- **Forms:** Server Actions + Zod + `useActionState`, field errors, honeypot + minimum fill time + simple in-memory
  per-IP rate limit, progressive enhancement. For now submissions go to the mock API layer.
- **Map:** OpenStreetMap iframe (no API key). CSP already allows `frame-src https://www.openstreetmap.org`.
- **Template plugin replacements:** our own small components, with no slider/lightbox/calendar libraries.
  Carousel (pauses for reduced motion), Tabs (WAI-ARIA tabs pattern), Lightbox (native `<dialog>`, dynamically
  imported), calendar = server-rendered month grid with links, FAQ = native `<details>`.
- Dropped from the template: "Starter page" and the demo "Dropdown" menu.
- Brand green darkened to `#0c7f56` for WCAG AA. Use `--color-primary-on-dark` (`#3fd09a`) for green text on dark
  backgrounds.
- Shared schemas: `features/*/schemas.ts` and `lib/api/schemas.ts` import only `zod` (no Next.js), so they can later
  move to `packages/schemas` (Node) or be exported as JSON Schema (Python).
- (Phase 3) Editable page copy comes from `GET /pages/{key}` (`home`, `about`, `programs`), feature `page-content`.
  Section headings and button labels stay in components. Icons in API content are Bootstrap Icons names resolved
  with `toIconName(name, fallback)`.
- (Phase 3) `news` and `events` features exist with summary schemas, mock data and home-page sections only
  (`getLatestNews`, `getUpcomingEvents`). Phase 4 adds filters, detail fields (body etc.) and pages.
- (Phase 3) Home "Featured Programs" filter is client-side (6 cards); the home "Events" section has no month/category
  selects (those filters live on `/events`). Event cards link to `/events/[slug]`; "Add to calendar" is not built yet.
- (Phase 3) Leadership team = faculty in department `senior-leadership`. Faculty directory: `?department=&q=&page=`,
  12 per page, department filter as links, search as a `next/form` GET form.

## Route map

| Route                                 | Source template page                     | Notes                                                           |
| ------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `/`                                   | index.html                               | Static shell; upcoming events `cacheLife("hours")`              |
| `/about`                              | about.html                               | History, mission, leadership message, leadership team           |
| `/programs`, `/programs/[slug]`       | academics.html (+ new detail)            | Level tabs client-side; details prerendered                     |
| `/faculty`, `/faculty/[slug]`         | faculty-staff.html (+ new profile)       | `?department=&q=` on the server                                 |
| `/admissions`                         | admissions.html                          | Process, requirements, deadlines, fees, PDF forms, inquiry form |
| `/campus`, `/student-life`, `/alumni` | campus-facilities, students-life, alumni | Static                                                          |
| `/news`, `/news/[slug]`               | news.html, news-details.html             | `?category=&q=&page=`; recent articles prerendered              |
| `/notices`, `/notices/[slug]`         | new                                      | Same pattern as news                                            |
| `/events`, `/events/[slug]`           | events.html, event-details.html          | `?month=&category=&view=list\|calendar`; registration form      |
| `/gallery`, `/gallery/[album]`        | new (reuse gallery tiles)                | Lazy lightbox                                                   |
| `/careers`, `/careers/[slug]`         | new                                      |                                                                 |
| `/faq`                                | new                                      | `<details>`, FAQPage JSON-LD                                    |
| `/contact`                            | contact.html                             | Form + OpenStreetMap                                            |
| `/privacy`, `/terms`                  | privacy.html, terms-of-service.html      |                                                                 |
| `(portal)/`                           | reserved                                 | README only, no routes                                          |

Future API endpoints are listed in the Phase 1 plan; add each one to `frontend/docs/api-contract.md` (method,
params, response shape, errors, cache tags) as its feature is built.

## Architecture rules

- `src/app/` is routing only: pages and layouts fetch and compose, with no business logic.
- Feature folders `src/features/<name>/`: `components/`, `data.ts` (cached server reads), `actions.ts`,
  `schemas.ts`, `types.ts` (inferred from schemas), `index.ts` (public API).
- Features import each other only via `@/features/<name>` (index). Inside a feature, use relative imports.
  Enforced by ESLint `no-restricted-imports`.
- Pages/components never import mocks; only `src/lib/api/**` may (ESLint-enforced). Call
  `apiRequest({ method, path, query, body, schema, mock })` from `@/lib/api`, passing `mock: () => mockApi.<resource>.<fn>(...)`
  (`mockApi` is re-exported by `@/lib/api`); mock handlers live in `src/mocks/` and document the endpoint they replace (e.g. `GET /api/v1/events?month=`). Mock handlers throw `ApiError`
  (404, 422 `{ message, errors }`), and paginate with `paginate()`.
- Server Components by default; `"use client"` only for interactive leaves, with serializable props.
- Every data route gets proper `loading`, `error` and `not-found` handling. No `any`. No secrets in client code.
- Dates: always use `src/lib/dates.ts` (formats in the school time zone).
- Icons: `<Icon name="..." />` from `@/components/ui/Icon`. To add one, add its Bootstrap Icons name to
  `frontend/scripts/generate-icons.mjs` and run `npm run icons`.
- Styles: Sass partials in `src/styles/` keep the template's class names. Prettier formats SCSS into multi-line
  rules, so match the formatted text when editing.

## Approved packages

Runtime: `next`, `react`, `react-dom`, `zod`, `server-only`, `bootstrap` (Sass only), `bootstrap-icons` (SVG source
for the icon generator).
Dev: `typescript`, `@types/*`, `sass`, `eslint`, `eslint-config-next`, `eslint-plugin-jsx-a11y`,
`eslint-config-prettier`, `prettier`, `husky`, `lint-staged`, `vitest`, `@vitejs/plugin-react`, `jsdom`,
`@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom`,
`@playwright/test`, `@axe-core/playwright`. Lighthouse runs via `npx`.

## Gotchas learned so far

- Next 16: `middleware` is now `proxy.ts`. Error boundaries receive `{ error, retry }`. `revalidateTag` needs a second
  argument. Run `next typegen` before `tsc` (the `typecheck` script does this).
- Bootstrap 5.3.8 Sass needs `node_modules/bootstrap/scss` in `sassOptions.loadPaths` (already configured).
- jsx-a11y rejects keyboard handlers on non-interactive elements: use document listeners in an effect instead.
- `@types/node` is 24 (Vitest 5 requires it). ESLint stays 9 and TypeScript 5 for `eslint-config-next` compatibility.
- Playwright runs against `npm start` on port 3100 (`playwright.config.ts`); build first.
- The Husky hook lives in `frontend/.husky` and runs `lint-staged` from `frontend/`, with `--max-arg-length 7000`
  because Windows `cmd.exe` rejects command lines over 8191 characters (big commits). `.gitattributes` forces LF
  line endings (the user's Git has `core.autocrlf=true`; Prettier and the hook need LF).
- Errors lose their class across a `"use cache"` boundary: detail reads return `null` for 404 and the page calls `notFound()`.
- `notFound()` with Cache Components: correct 404 status, but the not-found UI is rendered client-side (empty HTML body).
  Detail pages export `instant = false` so unknown slugs render blocking (real 404) instead of an App Shell.
- Streamed `<Suspense>` content needs JS to appear: give filter pages a `<noscript>` fallback (see /faculty).
- Remote CSS `background: url(...)` is blocked by the CSP (`img-src self`): use next/image or local files.
- `.reveal` elements are opacity 0 until scrolled into view: axe tests must use `reducedMotion: "reduce"`.
- Stopping a background `npm start` task leaves node listening on 3100; kill it (`Get-NetTCPConnection -LocalPort 3100`)
  or Playwright reuses the stale server.

## Commands (run in `frontend/`)

```bash
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint + format:check + test + build
npm run e2e          # Playwright (after build)
```
