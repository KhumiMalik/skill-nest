# Mock API

Realistic sample data and handlers that stand in for the future REST API.

```
mocks/
├── data/            sample content (programs, faculty, news, events, page copy), typed with the feature types
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
- Mock files import only **types** from features (`import type`), never values, to avoid circular imports
  (features → lib/api → mocks → features).
- Images are `placehold.co` PNGs (next/image doesn't optimise SVG).
- Keep `docs/api-contract.md` in sync whenever a handler changes. `mocks.test.ts` checks every response against
  the feature schemas.
