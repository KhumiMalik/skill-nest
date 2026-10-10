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
├── features/<name>/      one folder per domain: page-content, programs, news, events, gallery...
│   ├── components/       feature UI
│   ├── data.ts           cached server reads ("use cache" + cacheTag)
│   ├── actions.ts        server actions (forms)
│   ├── schemas.ts        Zod schemas of the API contract (framework-independent)
│   ├── filters.ts        URL search params -> list filters (frontend only), where a list has filters
│   ├── structured-data.ts JSON-LD for the feature's pages, where search engines show rich results
│   ├── constants.ts      plain values (labels, option lists) Client Components may import; no Zod
│   ├── types.ts          types inferred from schemas
│   └── index.ts          the feature's public API
├── components/
│   ├── layout/           Header, Footer, SiteShell, PageBanner, RevealOnScroll...
│   ├── forms/            form fields, error summary, spam trap, submit button (client)
│   ├── seo/              JsonLd (structured data script)
│   └── ui/               shared primitives: Icon, Tabs, Pagination, Carousel, PhotoGrid...
├── lib/
│   ├── api/              server-only API client (mock now, real backend later)
│   ├── search-params.ts  lenient parsing of filters from the URL
│   ├── dates.ts          date formatting in the school time zone
│   ├── format.ts         currency and file sizes
│   ├── forms/            form state, spam checks, rate limit, submitForm() for server actions
│   ├── seo/              pageMetadata(), JSON-LD builders, share image and icon rendering
│   └── revalidation.ts   the /api/revalidate webhook logic
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

| Route                                                                                           | Rendering                                             | Refreshes                                       |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `/`                                                                                             | Static                                                | hourly (upcoming events), tags                  |
| `/about`, `/programs`                                                                           | Static                                                | daily, tags                                     |
| `/programs/[slug]`, `/faculty/[slug]`                                                           | Static for every known slug (generateStaticParams)    | daily, tags                                     |
| `/faculty`                                                                                      | Static shell + directory streamed per request         | data cached daily, tags                         |
| `/news`, `/events`                                                                              | Static shell + list streamed per request              | data cached hourly, tags                        |
| `/notices`                                                                                      | Static shell + list streamed per request              | every few minutes, tags                         |
| `/news/[slug]`                                                                                  | Static for the 12 newest; older ones on first visit   | daily (sidebar hourly), tags                    |
| `/notices/[slug]`, `/events/[slug]`                                                             | Static for every known slug                           | as their sidebars, tags                         |
| `/events/[slug]/calendar.ics`                                                                   | Route handler, per request (data cached)              | -                                               |
| `/admissions`, `/campus`, `/student-life`, `/faq`, `/gallery`, `/privacy`, `/terms`, `/contact` | Static                                                | daily, tags                                     |
| `/alumni`, `/careers`                                                                           | Static                                                | hourly (upcoming events / open vacancies), tags |
| `/gallery/[album]`                                                                              | Static for every album                                | daily, tags                                     |
| `/careers/[slug]`                                                                               | Static for open vacancies; closed ones on first visit | daily ("closed" note hourly), tags              |

Cache lifetimes follow how urgent a change is when a revalidation webhook is missed: page copy, programs and staff
`days`; news and events lists `hours` (also because "upcoming" moves with the clock); notices `minutes` (a closure
notice must appear quickly). `minutes` is the shortest lifetime that is still prerendered.

### Rich text

Article bodies, notices and event descriptions are **content blocks** (`contentBlockSchema` in `lib/api/schemas.ts`):
`paragraph`, `heading`, `list`, `quote`, `image`, `callout`. `components/ui/ContentBlocks.tsx` renders them with our
own markup, so no HTML from the API is ever injected (no XSS risk, no sanitiser package) and styles stay consistent.
Headings get ids and a table of contents. The trade-off is no inline formatting (bold, links inside a paragraph);
if editors need it later, add an inline-marks field to the paragraph block rather than switching to HTML.

### Events calendar

The calendar is a server-rendered month grid (`features/events/calendar.ts` builds Monday-first weeks; multi-day
events appear on each day). It is a real `<table>` with a caption and column headers; each event is a link. On
phones the CSS turns it into a list of the days that have events. Month navigation and filters are plain links and a
GET form, so the URL always describes what is shown. "Today" and "this month" are read at request time
(`connection()`), inside the streamed part of the page.

### Filters in the URL

List filters (`/faculty?department=science&q=hart&page=2`) are read on the server, so every filtered view is a
shareable, crawlable URL. `features/<x>/filters.ts` parses them leniently (`lib/search-params.ts`): an invalid
value is dropped instead of causing an error. The search box is a GET form (`next/form`), the other filters are links.

**Without JavaScript:** streamed `<Suspense>` content is revealed by a small inline script, so a visitor with
JavaScript disabled only sees the fallback. The directory's fallback therefore includes a `<noscript>` list of all
staff linking to their (static) profile pages. Search engines are not affected: Next.js detects crawlers and sends
them the complete page.

### Links and typed routes

`typedRoutes: true` makes TypeScript check every `next/link` href against the app's routes, so a link to a page that
doesn't exist is a build error.

- Literal hrefs (`"/contact"`) and inline template literals (`` `/news/${slug}` `` directly in `<Link>`) are checked.
- The filter helpers (`newsHref`, `eventsHref`...) return `Route` without a cast: `toQueryString` returns the precise
  type `"" | "?..."`, so `` `/news${toQueryString(...)}` `` is a valid route type.
- Hrefs that come from data (API links, or `/news/${slug}` stored in an object for `MiniPostList`) are cast with
  `as Route` in one place each (`ContentLink`, `MiniPostList`, `LinkIndex`, `AchievementsSection`), with a comment.
- Links from the API are validated by `linkHrefSchema` (site path, http(s) URL or `mailto:`): plain `z.url()` would
  accept `javascript:` URLs, and `startsWith("/")` would accept `//other-site.com`. `ContentLink` renders site paths
  with `next/link` and everything else as a plain `<a>`.
- Links inside a sentence (`p > a`) are underlined, so they aren't distinguished by colour alone (WCAG 1.4.1).

### Photos, lightbox and carousel

- `components/ui/PhotoGrid` renders gallery tiles as links to the full-size image (works without JavaScript and with
  Ctrl/Cmd+click). A normal click opens `Lightbox`, which is loaded with `next/dynamic` only when first opened, so it
  isn't part of any page's initial JavaScript.
- `Lightbox` is a native `<dialog>` opened with `showModal()`: focus trapping, Escape and the inert background come
  from the browser. We add Previous/Next, the arrow keys, closing on the backdrop, a live "Photo 3 of 7" caption and
  returning focus to the tile of the last photo shown.
- `Carousel` follows the WAI-ARIA carousel pattern: it rotates only while on screen, not hovered or focused, and not
  paused; with reduced motion it starts paused. A pause button is always shown (WCAG 2.2.2).
- Gallery tile titles are always visible (the template showed them on hover only, which fails on touch screens).

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
  `revalidateTag(tag, { expire: 0 })` so the next visitor sees fresh content. See "SEO and revalidation" below.

## SEO and revalidation

- **Metadata:** every page calls `pageMetadata({ title, description, path })` (`lib/seo/metadata.ts`): title (with the
  "| Greenfield Academy" template from the root layout), description, canonical URL and Open Graph/Twitter tags.
  `metadataBase` is `NEXT_PUBLIC_SITE_URL`, so set it to the real domain in production. Canonical URLs never include
  search params: filtered and paginated lists point at the main list, and every item is in the sitemap.
- **Share images** are generated with `next/og` (`lib/seo/og-image.tsx`) at build time: a site default
  (`app/opengraph-image.tsx`) and one per news article and event (title, date, venue). A page's `openGraph` replaces its
  parent's, so `pageMetadata` names the default image itself; routes with their own image file pass `ownImage: true`,
  because an image set in metadata would replace theirs. The favicon and Apple touch icon are generated the same way.
- **Structured data (JSON-LD)** via `<JsonLd>` (`components/seo`), which escapes `<` so content can't close the script
  tag: `School` on the home page, `BreadcrumbList` from every `PageBanner`, `NewsArticle`, `Event` (off-site venues
  use their own `address`), `FAQPage`, and `JobPosting` only while a vacancy is open. Builders live in each feature's
  `structured-data.ts`.
- **`/sitemap.xml`** lists every static page and every item (paging through the API), using the same cached reads as the
  pages. **`/robots.txt`** points to it and blocks `/api/`; with `ALLOW_INDEXING=false` (staging) it blocks everything.
- **`POST /api/revalidate`** (`lib/revalidation.ts`): the backend sends `Authorization: Bearer {REVALIDATE_SECRET}` and
  `{ "tags": [...] }`; the token is compared in constant time, tags are validated, and each one is expired with
  `revalidateTag(tag, { expire: 0 })`. Tag names are listed per endpoint in `docs/api-contract.md`.

## Security

- Headers set in `next.config.ts` for every route: Content-Security-Policy, X-Content-Type-Options,
  Referrer-Policy, X-Frame-Options, Permissions-Policy and (production) HSTS. `X-Powered-By` is removed.
- **Why a static CSP instead of nonces:** a nonce must be unique per request, which forces every page to be rendered
  on each request and disables static rendering and caching. A static policy keeps pages cacheable. Next.js injects
  small inline scripts, so `script-src` includes `'unsafe-inline'`; everything else is locked down
  (`object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`, `base-uri 'self'`, images and fonts from our
  own origin only).
- **Experimental SRI was evaluated (Phase 8) and not enabled.** It adds integrity hashes to the external script
  files, but every page also has ~30 inline scripts (the page data React needs to hydrate) without hashes. With
  `'unsafe-inline'` removed, the browser blocked them and pages stopped working, so SRI can't make the policy
  stricter here.
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
- **Audit (Phase 8):** axe with every rule, including best practices (heading order, landmarks), on 31 routes plus
  a form error state, desktop and mobile: no violations. Text over images and gradients, which axe can't judge,
  was checked by hand; that found the CTA band paragraph (88% white on the green gradient, 4.3:1), now solid
  white. A keyboard pass (Tab through 8 pages) found no traps and one element without a focus outline (the map
  iframe, now outlined). Elements on screen are never hidden by the scroll-reveal animation.

## Performance

Lighthouse mobile scores are checked with `npm run lighthouse` (median of 3 runs on 7 key pages). On a quiet
workstation (Lighthouse CPU benchmark ~1700) accessibility, best practices and SEO score 100 on every page, and
performance is 91-94 on five pages and 85-89 on the home page and the news list (October 2026). In real Chrome with
a 4x CPU slowdown, the Largest Contentful Paint happens with the first paint (0.5-1.2 s) on every page; the lab score
is lower because Lighthouse's simulated slow 4G link counts the ~165 KB of React and Next.js JavaScript and the
stylesheet against it. CI requires 80+ for performance because shared runners are slower and noisier.

What made the difference, and the rules that keep it that way:

- **Client Components must not import Zod or the full icon set.** Anything a Client Component imports goes to the
  browser. A label list imported from a `schemas.ts` file put all of Zod (~90 KB) on every page, and `<Icon>` in
  the header added every icon (~18 KB). Client Components import plain values from a feature's `constants.ts`
  (re-exported by `schemas.ts`) and use `<ClientIcon>` (a small, generated set). `public-env.ts` validates its one
  URL by hand for the same reason. `e2e/performance.spec.ts` fails if either comes back, and keeps each page's
  JavaScript under a budget.
- **Server-render inside Client Components when you can:** the home program filter receives cards rendered on the
  server and only toggles `hidden`, so the card code stays on the server.
- **Only the Bootstrap you use:** the utility classes are limited to a list in `main.scss` and the form module to
  the parts in use, which cut the render-blocking stylesheet from 176 KB to 119 KB (21 KB compressed).
- **Don't hide what is on screen:** the scroll-reveal animation shows on-screen elements straight away (it delayed
  the Largest Contentful Paint until JavaScript loaded), and measures all elements before changing classes
  (alternating reads and writes forced a layout per element).
- Fonts are self-hosted and not preloaded; LCP images are preloaded or loaded eagerly (`eagerCount` on photo grids).
- Tried and rejected: `experimental.inlineCss` (the HTML grew to ~100 KB compressed with no gain) and
  `content-visibility: auto` on sections (no measurable gain).

## Forms

Four forms: contact (`/contact`), admissions enquiry (`/admissions`), newsletter (footer) and event booking (event
pages whose `registration` is open). Each is a feature `actions.ts` (server action) plus a client component.

```
ContactForm (client) --useActionState--> sendContactMessage (server action)
                                           └─ submitForm(): spam checks -> Zod validation -> rate limit -> apiRequest POST
```

- **One pipeline:** `lib/forms/server.ts` `submitForm()` runs the same steps for every form and returns a
  `FormState` (`status`, `message`, field `errors`, typed `values`). It never throws for a visitor's mistake;
  unexpected failures are logged and shown as a friendly message.
- **Validation** uses the API's own request schemas (`contactMessageSchema`...), shared field schemas
  (`personNameSchema`, `emailAddressSchema`, `phoneNumberSchema` in `lib/api/schemas.ts`) and messages written for
  visitors. The mock endpoints validate again and answer 422 like the backend; `submitForm` maps 422 field errors
  next to the fields and `_form` errors to the message.
- **Every action is a public POST endpoint:** it reads only the fields it expects (`readValues`), and the booking
  action re-reads the event from the API instead of trusting anything but the slug from the form.
- **Progressive enhancement:** forms post to server actions, so they work before JavaScript loads and without it
  (e2e tests submit with JavaScript disabled). Validation is ours (`noValidate`), so messages look the same either
  way. React resets a form after its action runs, so fields take `defaultValue` from `state.values` to keep what
  the visitor typed.
- **Accessibility:** visible labels, "(optional)" on optional fields, hints and errors linked with
  `aria-describedby`, `aria-invalid`; an error summary ("Please correct the errors below.") with links to each
  field, focused after a failed submit; the success message replaces the form and is focused (`role="status"`).
  `html { scroll-padding-top }` keeps focused messages from scrolling under the fixed header.
- **Spam:** a honeypot field (bots get a fake success), a minimum fill time recorded by the browser
  (`FORM_MIN_FILL_MS`, default 2 s; people who are faster are asked to send again, so no real message is lost;
  skipped without JavaScript), and an in-memory rate limit per IP and form (`FORM_RATE_LIMIT`, default 5 per
  10 minutes, counted after validation). The limiter is per server instance; with several instances use a shared
  store or rely on the backend's 429.
- **Caching:** none of the forms changes content shown on the site, so the actions don't call `updateTag`. If a
  form ever should (e.g. showing "places left"), call `updateTag("event:{slug}")` after the API call.
- **Booking:** the event page shows the form while `hasPassed(deadline)` is false (cached hourly); the action checks
  the deadline exactly, and the API checks capacity ("Only 2 places are left.").
