# Greenfield Academy — frontend

Next.js website for Greenfield Academy. Runs against a built-in mock API until the backend exists.

## Requirements

- Node.js 22.12+ (CI uses 24)
- npm

## Getting started

```bash
cp .env.example .env.local   # then adjust if needed
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

| Command              | What it does                                                            |
| -------------------- | ----------------------------------------------------------------------- |
| `npm run dev`        | Development server                                                      |
| `npm run build`      | Production build                                                        |
| `npm start`          | Serve the production build                                              |
| `npm run typecheck`  | Generate route types and run TypeScript                                 |
| `npm run lint`       | ESLint (Next, jsx-a11y, import boundaries); fails on any warning        |
| `npm run format`     | Prettier (write); `format:check` only checks                            |
| `npm test`           | Unit and component tests (Vitest)                                       |
| `npm run e2e`        | End-to-end + accessibility tests (Playwright). Run `build` first.       |
| `npm run check`      | Typecheck, lint, format check, tests and build in one go                |
| `npm run icons`      | Regenerate the inline SVG icon set                                      |
| `npm run lighthouse` | Mobile Lighthouse audit of key pages (needs `npm start -- --port 3100`) |

First-time Playwright setup: `npx playwright install chromium`.

## Environment variables

See `.env.example`. Server variables are validated with Zod at startup (`src/config/env.ts`); the public one is
checked by hand in `src/config/public-env.ts` (that file reaches the browser, where Zod would add ~90 KB).

| Variable               | Where  | Purpose                                                                  |
| ---------------------- | ------ | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical site URL (SEO, sitemap, Open Graph)                            |
| `API_BASE_URL`         | server | Backend URL. Unset = use the mock API                                    |
| `REVALIDATE_SECRET`    | server | Shared secret for `POST /api/revalidate`                                 |
| `MOCK_API_DELAY_MS`    | server | Fake latency for the mock API (default 300 ms in dev)                    |
| `FORM_RATE_LIMIT`      | server | Form submissions per visitor and form in 10 minutes (default 5)          |
| `FORM_MIN_FILL_MS`     | server | Forms sent faster than this after page load count as bots (default 2000) |
| `ALLOW_INDEXING`       | server | `false` on staging/previews: robots.txt blocks crawling (default `true`) |

## Deploying

- Set `NEXT_PUBLIC_SITE_URL` to the real domain **at build time**: canonical URLs, share images, the sitemap and
  structured data are built from it.
- Set `REVALIDATE_SECRET` (32+ characters) and give the same value to the backend, which calls
  `POST /api/revalidate` when content changes.
- Running more than one instance: set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` to the same value everywhere (server
  actions), and note that the form rate limit is kept in memory per instance (see `docs/architecture.md`, "Forms").
- Staging and preview deployments: `ALLOW_INDEXING=false`.

## Quality checks

`npm run check` and `npm run e2e` run in CI (`.github/workflows/frontend.yml`), followed by `npm run lighthouse`.
The end-to-end suite includes axe accessibility scans of every page (desktop and mobile), form tests with and
without JavaScript, SEO checks and a JavaScript budget that fails if server-only code reaches the browser.

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — structure, data layer, caching, security, accessibility
- [`docs/api-contract.md`](docs/api-contract.md) — endpoints the backend must implement

## Git hooks

Husky runs `lint-staged` (ESLint + Prettier on staged files) before every commit.
