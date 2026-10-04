# Architecture

This document explains how the Greenfield Academy frontend is organised and why.
It grows phase by phase; sections marked _(planned)_ are filled in later.

## Stack

- **Next.js 16 (App Router)** with **Cache Components** (`cacheComponents: true`), React 19, TypeScript (strict,
  `noUncheckedIndexedAccess`).
- **Styling:** Sass. Only the Bootstrap modules we use (grid, forms, utilities...) plus the template's styles,
  split into partials in `src/styles/`. No Bootstrap JavaScript, no jQuery.
- **Icons:** a generated subset of Bootstrap Icons as inline SVG (`npm run icons`), so no icon font is downloaded.
- **Fonts:** `next/font` (self-hosted at build time).
- **Validation:** Zod for env variables, API responses and form input.
- **Tests:** Vitest + React Testing Library (unit/component), Playwright + axe (end-to-end and accessibility).

## Folder structure

```
src/
├── app/                  routing only: thin pages, layouts, route files
│   ├── (site)/           public pages (share the header/footer layout)
│   ├── (portal)/         reserved for a future student/parent portal
│   ├── layout.tsx        <html>, fonts, global styles
│   ├── not-found.tsx     404 (wraps itself in the site shell)
│   └── global-error.tsx  last-resort error boundary
├── features/<name>/      one folder per domain: page-content, programs, faculty, news, events...
│   ├── components/       feature UI
│   ├── data.ts           cached server reads ("use cache" + cacheTag)
│   ├── actions.ts        server actions (forms)
│   ├── schemas.ts        Zod schemas of the API contract (framework-independent)
│   ├── filters.ts        URL search params -> list filters (frontend only), where a list has filters
│   ├── types.ts          types inferred from schemas
│   └── index.ts          the feature's public API
├── components/
│   ├── layout/           Header, Footer, SiteShell, PageBanner, RevealOnScroll...
│   └── ui/               shared primitives: Icon, SectionTitle, Tabs, Pagination, Counter
├── lib/
│   ├── api/              server-only API client (mock now, real backend later)
│   ├── search-params.ts  lenient parsing of filters from the URL
│   └── dates.ts          date formatting in the school time zone
├── mocks/                mock API (only lib/api may import)
│   ├── data/             realistic sample content, typed with the feature types
│   ├── <resource>.ts     handlers, one per endpoint, named after what they replace
│   └── index.ts          `mockApi`, handed to data.ts files through `@/lib/api`
├── config/
│   ├── env.ts            server env, Zod-validated, server-only
│   ├── public-env.ts     NEXT_PUBLIC_* env
│   └── site.ts           school name, contact details, navigation
└── styles/               Sass partials
```

### Boundaries (enforced by ESLint `no-restricted-imports`)

- Another feature can only be imported through its `index.ts` (`@/features/news`, never `@/features/news/data`).
- Only `src/lib/api` may import from `src/mocks`.
- `src/lib/api` and `src/config/env.ts` import `server-only`, so importing them from a Client Component fails the build.

## Data layer

```
page.tsx ──> features/<x>/data.ts ──> lib/api (apiRequest) ──┬──> mocks/ handler   (API_BASE_URL unset)
 (compose)    ("use cache", tags)      (validate with Zod)    └──> fetch(API_BASE_URL/api/v1/...)
```

- Every API call goes through `request()` in `src/lib/api/request.ts`. It takes the HTTP method, path, query/body,
  a Zod **schema** for the response and a **mock** implementation of the same endpoint.
- Without `API_BASE_URL` the mock runs (with a small delay in development); with it, the real API is called.
  Both paths are validated by the same schema and throw the same `ApiError` (`status`, `{ message, errors }`), so
  **switching to the real backend is an environment change only**.
- Response shapes are documented in `docs/api-contract.md`. `src/mocks/mocks.test.ts` validates every mock
  response against the same schemas, so the mocks can't drift from the contract.

A typical cached read (`features/programs/data.ts`):

```ts
export async function getPrograms(filters: ProgramListQuery = {}) {
  "use cache"; // the result is cached; the arguments are part of the cache key
  cacheLife("days"); // safety net; content changes normally arrive via tag revalidation
  cacheTag("programs"); // the backend sends this tag to refresh it
  const query = { ...filters, pageSize: 50 };
  const result = await apiRequest({
    method: "GET",
    path: "/programs",
    query,
    schema: paginatedSchema(programSummarySchema),
    mock: () => mockApi.programs.list(query), // ignored once API_BASE_URL is set
  });
  return result.data;
}
```

Conventions:

- **Not found:** detail reads (`getProgram(slug)`) return `null` for a 404 instead of throwing, because an
  `ApiError` loses its class when it crosses a cache boundary. The page then calls `notFound()`.
- **Malformed slugs** are rejected before the cache scope, so junk URLs never reach the API or fill the cache.
- **Page copy** (home, about, programs intro) comes from `GET /pages/{key}` too, so editors can change it without a
  deploy. Section headings and button labels stay in the components.

### Sharing schemas with the backend (later)

Schemas only import `zod`, never Next.js. When the backend starts:

- **Node backend:** move `features/*/schemas.ts` and `lib/api/schemas.ts` into a `packages/schemas` npm workspace
  imported by both apps.
- **Python backend:** export JSON Schema from the Zod schemas (`z.toJSONSchema`) and generate Pydantic models from it,
  or treat `docs/api-contract.md` as the source of truth and test the backend against it.

## Rendering and caching

- **Cache Components** is enabled. Data is dynamic by default; we opt in to caching with `"use cache"`, give each
  cached function a lifetime with `cacheLife` and tag it with `cacheTag` (e.g. `news`, `event:{slug}`).
- Pages prerender a static shell. Anything that depends on the request (search params for filters) streams inside
  `<Suspense>`.
- Reading the clock during prerender is not allowed, so time-dependent output is either cached with a short life
  (the footer year: `cacheLife("days")`; "upcoming events": `cacheLife("hours")`) or rendered at request time.

How each page renders (from `next build`):

| Route                                 | Rendering                                          | Refreshes                      |
| ------------------------------------- | -------------------------------------------------- | ------------------------------ |
| `/`                                   | Static                                             | hourly (upcoming events), tags |
| `/about`, `/programs`                 | Static                                             | daily, tags                    |
| `/programs/[slug]`, `/faculty/[slug]` | Static for every known slug (generateStaticParams) | daily, tags                    |
| `/faculty`                            | Static shell + directory streamed per request      | data cached daily, tags        |

### Filters in the URL

List filters (`/faculty?department=science&q=hart&page=2`) are read on the server, so every filtered view is a
shareable, crawlable URL. `features/<x>/filters.ts` parses them leniently (`lib/search-params.ts`): an invalid
value is dropped instead of causing an error. The search box is a GET form (`next/form`), the other filters are links.

**Without JavaScript:** streamed `<Suspense>` content is revealed by a small inline script, so a visitor with
JavaScript disabled only sees the fallback. The directory's fallback therefore includes a `<noscript>` list of all
staff linking to their (static) profile pages. Search engines are not affected: Next.js detects crawlers and sends
them the complete page.

### Dynamic routes and not-found pages

- Detail pages prerender every known slug with `generateStaticParams`. Slugs added later (or mistyped) are rendered
  on their first request. These pages set `export const instant = false` ("blocking route"): with an unknown slug the
  server renders the page fully instead of sending an App Shell first, so a missing slug gets a real **404 status**.
- With Cache Components, the not-found UI of a `notFound()` call is rendered in the browser from the response data
  (the HTML body is an empty shell). The status code and `noindex` are correct; only visitors without JavaScript
  see a blank page. Unmatched URLs (no route at all) are fully server-rendered by `app/not-found.tsx`.
- `programs/[slug]/not-found.tsx` and `faculty/[slug]/not-found.tsx` give those routes specific messages; they render
  inside the site layout, unlike the root `not-found.tsx`, which wraps itself in the site shell.
- The backend will call `POST /api/revalidate` with a shared secret and a list of tags; we expire them with
  `revalidateTag(tag, { expire: 0 })` so the next visitor sees fresh content. _(Phase 7)_

## Security

- Headers set in `next.config.ts` for every route: Content-Security-Policy, X-Content-Type-Options,
  Referrer-Policy, X-Frame-Options, Permissions-Policy and (production) HSTS. `X-Powered-By` is removed.
- **Why a static CSP instead of nonces:** a nonce must be unique per request, which forces every page to be rendered
  on each request and disables static rendering and caching. A static policy keeps pages cacheable. Next.js injects
  small inline scripts, so `script-src` includes `'unsafe-inline'`; everything else is locked down
  (`object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`, `base-uri 'self'`, images and fonts from our
  own origin only). Next.js's experimental hash-based alternative (SRI) will be evaluated in Phase 8.
- Images from remote hosts are fetched and optimised by the Next.js server (`next/image`), so the browser only loads
  images from our origin.
- Secrets live in server-only env variables; only `NEXT_PUBLIC_*` values reach the browser.

## Accessibility

Target: WCAG 2.2 AA.

- Skip link, landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page.
- Navigation dropdowns are `<button aria-expanded>` disclosures: keyboard operable, Escape closes and returns focus.
- Visible focus outline (`:focus-visible`) on everything interactive.
- Brand colours were darkened slightly from the template to reach 4.5:1 contrast. Other template colours fixed for
  the same reason: the "Community" event badge, `.btn-soft`, the event-strip buttons, the eyebrow label on tinted
  sections, and the gradients behind text on image cards (at least 60% black wherever text sits).
- Animations (scroll reveal, counters, sliders) are disabled for `prefers-reduced-motion`, and content is visible
  without JavaScript. Counters render the final number on the server; screen readers only get that number.
- Tabs follow the WAI-ARIA tabs pattern (arrow keys, Home/End, one tab stop). Filter buttons are toggle buttons
  (`aria-pressed`) with a polite live region announcing the result count.
- Card grids are lists (`<ul>`), card titles are `h3` under the section's `h2`, and decorative images have empty alt.
- Playwright runs axe on every page in the end-to-end suite, with reduced motion so that elements waiting to be
  revealed (opacity 0) aren't reported as low contrast.

## Forms _(Phase 6)_

Server Actions, Zod validation, `useActionState`, honeypot + rate limiting, progressive enhancement.
