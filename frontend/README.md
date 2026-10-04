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

| Command             | What it does                                                      |
| ------------------- | ----------------------------------------------------------------- |
| `npm run dev`       | Development server                                                |
| `npm run build`     | Production build                                                  |
| `npm start`         | Serve the production build                                        |
| `npm run typecheck` | Generate route types and run TypeScript                           |
| `npm run lint`      | ESLint (Next, jsx-a11y, import boundaries); fails on any warning  |
| `npm run format`    | Prettier (write); `format:check` only checks                      |
| `npm test`          | Unit and component tests (Vitest)                                 |
| `npm run e2e`       | End-to-end + accessibility tests (Playwright). Run `build` first. |
| `npm run check`     | Typecheck, lint, format check, tests and build in one go          |
| `npm run icons`     | Regenerate the inline SVG icon set                                |

First-time Playwright setup: `npx playwright install chromium`.

## Environment variables

See `.env.example`. All are validated with Zod at startup (`src/config/env.ts`, `src/config/public-env.ts`).

| Variable               | Where  | Purpose                                               |
| ---------------------- | ------ | ----------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical site URL (SEO, sitemap, Open Graph)         |
| `API_BASE_URL`         | server | Backend URL. Unset = use the mock API                 |
| `REVALIDATE_SECRET`    | server | Shared secret for `POST /api/revalidate`              |
| `MOCK_API_DELAY_MS`    | server | Fake latency for the mock API (default 300 ms in dev) |

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — structure, data layer, caching, security, accessibility
- [`docs/api-contract.md`](docs/api-contract.md) — endpoints the backend must implement

## Git hooks

Husky runs `lint-staged` (ESLint + Prettier on staged files) before every commit.
