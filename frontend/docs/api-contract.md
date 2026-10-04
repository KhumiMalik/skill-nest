# API contract

The REST API the Greenfield Academy backend must implement. The frontend's mock API (`src/mocks`) behaves exactly
as described here; keep both in sync.

Endpoints are added to this document as each feature is built (Phases 3-6).

## Conventions

- **Base path:** `/api/v1`. The frontend reads the host from `API_BASE_URL`.
- **Format:** JSON, UTF-8. Request bodies use `Content-Type: application/json`.
- **Dates:** ISO 8601 strings with offset, e.g. `2026-02-15T09:00:00Z`. The frontend displays them in the school's
  time zone.
- **Slugs:** lowercase, hyphen-separated, unique per resource (`annual-science-fair-2026`).
- **Images:** absolute URLs. Each image object is `{ "src": string, "alt": string, "width": number, "height": number }`.

### Lists and pagination

List endpoints accept `page` (default 1) and `pageSize` (default 9, max 50) and return:

```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 9, "total": 23, "totalPages": 3 }
}
```

### Errors

Every non-2xx response has this body:

```json
{ "message": "Human-readable summary" }
```

| Status | When                                      | Extra fields                              |
| ------ | ----------------------------------------- | ----------------------------------------- |
| 404    | Resource (e.g. slug) does not exist       | -                                         |
| 422    | Invalid input (query params or POST body) | `errors`: `{ "field": ["message", ...] }` |
| 429    | Too many submissions from the same client | -                                         |
| 500    | Unexpected server error                   | -                                         |

Example 422:

```json
{
  "message": "The given data was invalid.",
  "errors": { "email": ["Enter a valid email address."] }
}
```

### Successful creation (POST)

`201 Created` with `{ "id": "string", "message": "string" }`.

## Webhook: content revalidation

When content changes, the backend should notify the frontend so cached pages refresh immediately:

```
POST {SITE_URL}/api/revalidate
Authorization: Bearer {REVALIDATE_SECRET}
Content-Type: application/json

{ "tags": ["news", "news:annual-science-fair-2026"] }
```

Tag names are listed with each endpoint below. _(Implemented in Phase 7.)_

## Endpoints

Shapes below use TypeScript notation. The Zod schemas named after each endpoint are the source of truth
(`src/features/*/schemas.ts`); `src/mocks/mocks.test.ts` checks that the mock API matches them.

Shared types:

```ts
type Image = { src: string; alt: string; width: number; height: number };
type Stat = { value: number; prefix?: string; suffix?: string; label: string; icon?: string }; // "11:1" = { value: 11, suffix: ":1" }
type IconCard = { icon: string; title: string; text: string };
type Paginated<T> = { data: T[]; meta: { page: number; pageSize: number; total: number; totalPages: number } };
```

`icon` fields are [Bootstrap Icons](https://icons.getbootstrap.com/) names (e.g. `"trophy"`). The frontend ships a
subset of icons and shows a default icon for names it doesn't know.

**Cache tags:** each endpoint lists the tags the frontend caches its response under. When content changes, send the
listed tags to the revalidation webhook. Sending the collection tag (e.g. `programs`) refreshes everything of that type.

### Page content

#### `GET /pages/{key}`

Editable copy for the mostly-static pages. `key` is one of `home`, `about`, `programs`.

- **200:** the page object. Shapes: `homePageSchema`, `aboutPageSchema`, `programsPageSchema` in
  `src/features/page-content/schemas.ts`. They contain titles, paragraphs, `Stat[]`, `IconCard[]`, testimonials
  (`{ quote, name, role, photo: Image }`), link cards (`{ title, text, href, image }`, `href` is a site path like
  `/campus`) and, for `programs`, a `spotlight` that references a program by `programSlug`.
- **404:** unknown key.
- **Cache tag:** `pages:{key}`

### Programs

```ts
type ProgramLevel = "early-years" | "primary" | "secondary" | "sixth-form";
type ProgramSummary = {
  slug: string;
  title: string;
  level: ProgramLevel;
  ageRange: string; // "Ages 11-14"
  duration: string; // "3 years (Years 7-9)"
  classSize: string; // "Up to 22 pupils"
  summary: string;
  image: Image;
  featured: boolean; // shown on the home page
};
type Program = ProgramSummary & {
  intake: string; // "September (main entry at Year 7)"
  overview: string[]; // paragraphs
  subjects: string[];
  highlights: string[];
};
```

#### `GET /programs?level=&featured=&page=&pageSize=`

- `level` (optional): a `ProgramLevel`. `featured` (optional): `true` or `false`.
- **200:** `Paginated<ProgramSummary>`, in display order (by stage, then as the school lists them).
- **422:** invalid query.
- **Cache tag:** `programs`

#### `GET /programs/{slug}`

- **200:** `Program`. **404:** unknown slug.
- **Cache tags:** `programs`, `program:{slug}`

### Faculty and departments

```ts
type Department = { slug: string; name: string; description: string; icon: string; staffCount: number };
type FacultySummary = {
  slug: string;
  name: string; // with title, e.g. "Dr Amelia Hart"
  role: string;
  department: { slug: string; name: string };
  photo: Image;
  shortBio: string;
  email?: string;
};
type FacultyMember = FacultySummary & {
  bio: string[]; // paragraphs
  qualifications: string[];
  subjects: string[];
  joinedYear: number;
};
```

#### `GET /faculty?department=&q=&page=&pageSize=`

- `department` (optional): a department slug. The senior leadership team is the `senior-leadership` department
  (shown on the About page).
- `q` (optional, max 100 characters): case- and accent-insensitive match on name, role, department name and subjects.
- **200:** `Paginated<FacultySummary>`, in directory order (leadership first, then by department).
- **422:** invalid query.
- **Cache tag:** `faculty`

#### `GET /faculty/{slug}`

- **200:** `FacultyMember`. **404:** unknown slug.
- **Cache tags:** `faculty`, `faculty:{slug}`

#### `GET /departments`

- **200:** `Paginated<Department>`, in display order. `staffCount` is the number of staff in the department.
- **Cache tags:** `faculty`, `departments`

### News _(list only; filters and article detail are added in Phase 4)_

```ts
type NewsCategory = "school-life" | "academics" | "achievements" | "sports" | "arts" | "community";
type NewsSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt: string; // ISO 8601
  image: Image;
  author: { name: string; role: string; photo: Image };
};
```

#### `GET /news?page=&pageSize=`

- **200:** `Paginated<NewsSummary>`, newest first.
- **Cache tag:** `news`

### Events _(upcoming list only; filters, calendar and detail are added in Phase 4)_

```ts
type EventCategory = "academic" | "sports" | "arts" | "community";
type EventSummary = {
  slug: string;
  title: string;
  summary: string;
  category: EventCategory;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601; may be on a later day for multi-day events
  location: string;
  image: Image;
};
```

#### `GET /events?from=&page=&pageSize=`

- `from` (optional): a day, `YYYY-MM-DD`, in the school's time zone. Returns events that **end** on or after that day,
  so an event in progress still counts as upcoming.
- **200:** `Paginated<EventSummary>`, soonest first.
- **422:** invalid query.
- **Cache tag:** `events`
