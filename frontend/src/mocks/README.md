# Mock API

Realistic sample data and handlers that stand in for the future REST API.

```
mocks/
├── data/            sample content (programs, faculty, news, events, FAQs, gallery, vacancies), typed with the feature types
│   └── pages/       editable page copy, one file per GET /pages/{key}
├── <resource>.ts    handlers, e.g. faculty.ts: listFaculty() replaces GET /api/v1/faculty
├── utils.ts         placeholder images, search matching, pagination validation
└── index.ts         `mockApi`, grouped by resource
```

Rules:

- Only `src/lib/api/**` may import from this folder (enforced by ESLint). Feature `data.ts` files get the
  handlers as `mockApi` from `@/lib/api` and pass them to `apiRequest({ mock })`.
- Each handler documents the endpoint it replaces, e.g. `GET /api/v1/events?from=`.
- Handlers return exactly what the real endpoint would return (same JSON shape, list endpoints return summaries
  without detail fields), and throw `ApiError` with the same status codes (404, 422...).
- Mock files import **types** from a feature's index (`import type`) and **values** (enums such as
  `NEWS_CATEGORIES`) only from its `schemas.ts`, which depends on Zod alone. Importing values from the index would be
  circular (feature index → data.ts → lib/api → mocks → feature index).
- Images are `placehold.co` PNGs (next/image doesn't optimise SVG).
- POST endpoints (`forms.ts`, `events.ts` `registerForEvent`) validate the body with the feature's request schema
  (422 like the backend) and record accepted submissions in `mockOutbox` (memory only, lost on restart). Booked
  event places are counted in memory too; the mentoring breakfast starts with 38 of 40 places taken.
- Downloadable documents point to small placeholder PDFs in `public/documents/` (the real API returns absolute URLs).
- Time-dependent data uses real dates in the 2026-27 school year. `listVacancies` filters by the current time and
  takes `now` as a parameter so tests can fix the date.
- Keep `docs/api-contract.md` in sync whenever a handler changes. `mocks.test.ts` checks every response against
  the feature schemas.
