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
| 3   | Core pages: Home, About, Programs, Faculty                                                           | Done                       |
| 4   | News, Notices, Events (lists, URL filters, calendar view, detail pages)                              | Done                       |
| 5   | Admissions, Careers, FAQ, Gallery (+ Campus, Student Life, Alumni, Privacy, Terms)                   | Done                       |
| 6   | Forms: contact, admission inquiry, newsletter, event registration (server actions)                   | Done                       |
| 7   | SEO: metadata, JSON-LD, OG images, sitemap, robots; `/api/revalidate` route                          | Done                       |
| 8   | Quality: tests, Playwright e2e for every form/filter, a11y audit, Lighthouse (mobile 90+), CI, docs  | **Done** (awaiting commit) |

`typedRoutes: true` is enabled (end of Phase 5): links to pages that don't exist fail the type check. See
"Links and typed routes" in `frontend/docs/architecture.md` for when `as Route` is allowed.

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
- (Phase 4) Rich text from the API = content blocks (`contentBlockSchema`, rendered by `components/ui/ContentBlocks`),
  never HTML. Lists stream inside `<Suspense>` with `ResultsSkeleton` + a `<noscript>` `LinkIndex` fallback.
  News list: top stories on the plain first page only. Notices: important first. Events: `?month=&category=&view=`,
  list default = upcoming, calendar default = current month; `from`/`to` overlap query on the API.
  Event registration form is Phase 6 (sidebar currently says "email to book"). `.ics` route:
  `/events/[slug]/calendar.ics`.
- (Phase 3) Leadership team = faculty in department `senior-leadership`. Faculty directory: `?department=&q=&page=`,
  12 per page, department filter as links, search as a `next/form` GET form.
- (Phase 5) Page copy for admissions, campus, student-life, alumni, careers, privacy, terms also comes from
  `GET /pages/{key}` (mock files in `src/mocks/data/pages/`). New features: `faq` (`GET /faqs`, `<details>`),
  `gallery` (`GET /gallery/albums`, no filters, all albums static), `careers` (`GET /careers/vacancies`: open
  vacancies only; detail returns closed ones too, with an hourly-cached "closed" note), `contact` (details + map now,
  form in Phase 6). Alumni events = event category `alumni`. Admissions FAQ = `getFaqs("admissions")`.
  Downloads are `fileSchema` objects; placeholder PDFs live in `public/documents/`.
- (Phase 5) Links from the API use `linkHrefSchema`/`sitePathSchema` (never plain `z.url()`, which allows
  `javascript:`), rendered with `components/ui/ContentLink`. Gallery tiles: `components/ui/PhotoGrid` + lazy
  `Lightbox` (native `<dialog>`). Slideshows: `components/ui/Carousel`.
- (Phase 6) Forms = feature `actions.ts` + client component using `useActionState`; every action calls
  `submitForm()` from `lib/forms/server.ts` (spam checks -> Zod with the API request schema -> rate limit -> POST).
  Field components in `components/forms/`. Endpoints: `POST /contact-messages`, `/admission-enquiries`,
  `/newsletter-subscriptions`, `/events/{slug}/registrations`. Our own validation (`noValidate`), error summary
  focused after a failed submit, success message replaces the form. No `updateTag` (no form changes shown content).
  Spam settings: `FORM_RATE_LIMIT` (5 per 10 min) and `FORM_MIN_FILL_MS` (2000); e2e relaxes both.

- (Phase 7) Every page's metadata comes from `pageMetadata({ title, description, path })` (canonical without search
  params). Share images: `app/opengraph-image.tsx` (default) + `news/[slug]` and `events/[slug]` image routes
  (prerendered, `ownImage: true` in their metadata). JSON-LD via `<JsonLd>`: School (home), BreadcrumbList
  (PageBanner), NewsArticle, Event, FAQPage, JobPosting (open vacancies only). `app/sitemap.ts`, `app/robots.ts`
  (`ALLOW_INDEXING=false` blocks crawling), generated `icon`/`apple-icon` (favicon.ico removed). Events have an optional
  `address` (off-site venues); vacancies have `postedAt`. Webhook: `app/api/revalidate/route.ts` + `lib/revalidation.ts`.

- (Phase 8) CSP stays `'unsafe-inline'`: experimental SRI was tried and can't hash Next's inline scripts.
  Lighthouse: `npm run lighthouse` (median of 3 runs, 7 pages; CI requires performance 80+, others 90+). Client
  bundle rules (see "Performance" in architecture.md): Client Components import labels from a feature's
  `constants.ts` (no Zod) and use `<ClientIcon>`; `e2e/performance.spec.ts` enforces it plus a JS budget (550 KB).
  Bootstrap utilities are limited to a list in `styles/main.scss` (add a utility there before using it).

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
- Icons: `<Icon name="..." />` from `@/components/ui/Icon` in Server Components; `<ClientIcon>` in Client
  Components (only the icons in `CLIENT_ICONS`). To add one, add its Bootstrap Icons name to
  `frontend/scripts/generate-icons.mjs` (and `CLIENT_ICONS` if a Client Component needs it), then `npm run icons`.
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
- The React Compiler lint (`react-hooks/purity`) rejects `Date.now()` in components, even in a `"use cache"`
  component: put clock reads in a cached data function (e.g. `hasPassed` in events) and await it.
- Mocks may import a feature's `schemas.ts` directly (ESLint override), never its index (circular import).
- `.sidebar-box > h2` styles only the box title (direct child); headings inside box content keep their own styles.
- Node on Windows can't read heredocs via `/dev/stdin`; write temp files or use the Edit tool.
- Stopping a background `npm start` task leaves node listening on 3100; kill it (`Get-NetTCPConnection -LocalPort 3100`)
  or Playwright reuses the stale server.
- `.card-box` has `height: 100%`: when stacking two cards in one column, give the column `d-flex flex-column gap-4`
  and the card `h-auto`, or the second card overflows into the next section.
- jsdom has no `<dialog>` methods; `src/test/setup.ts` stubs `showModal`/`close`.
- Typed routes: `/news/${slug}` is only checked inline in `<Link>`; stored in an object it needs `as Route`.
- Shell (Git Bash) commands mangle backslashes and break on apostrophes inside `node -e '...'`: write scripts to
  the scratchpad with the Write tool instead.
- React resets a form after its action runs: fields must use `defaultValue={state.values[name]}` to keep input.
- Server actions are public POST endpoints: read only the expected fields and re-read records (e.g. the event) from
  the API; never trust hidden inputs beyond an id.
- A visually hidden prefix needs an explicit space (`<span className="visually-hidden">Error:</span> {error}`):
  Prettier moves JSX children onto new lines, which drops trailing spaces.
- Metadata merging: a page's `openGraph` replaces the parent's entirely (images included), and an image set in
  metadata replaces a route's own `opengraph-image` file. Hence `DEFAULT_OG_IMAGE` in `pageMetadata` and `ownImage`.
- `next/og` (ImageResponse) supports flexbox and inline styles only, draws SVG via `<img src="data:...">`, and its
  built-in font has no bold.
- Anything a Client Component imports (also through components it renders) is shipped to the browser: a
  `schemas.ts` import brings all of Zod. Check `.next/static/chunks` for "ZodError" if bundles grow.
- Reading layout (`getBoundingClientRect`) between DOM writes forces a layout each time: measure first, then write.
- Lighthouse scores on this Windows machine swing with load (other apps): the script prints the CPU benchmark;
  below ~1000 the performance scores are not meaningful.
- Playwright never reuses a running server (`reuseExistingServer: false`): one started by hand lacks the e2e env
  (`FORM_MIN_FILL_MS=0` etc.) and the form tests fail. Stop servers on 3100 before `npm run e2e`.
- The mock data is dated (2026-27 school year). Some e2e tests depend on today's date (open vacancies, upcoming
  events), so they need new dates once those days pass.

## Commands (run in `frontend/`)

```bash
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint + format:check + test + build
npm run e2e          # Playwright (after build)
```
