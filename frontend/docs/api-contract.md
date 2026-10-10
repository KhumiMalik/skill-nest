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

Tag names are listed with each endpoint below.

Responses (same error shape as the API):

| Status | When                                                                  |
| ------ | --------------------------------------------------------------------- |
| 200    | `{ "revalidated": ["news", ...], "now": "2026-10-09T12:00:00.000Z" }` |
| 401    | Missing or wrong token (`WWW-Authenticate: Bearer`)                   |
| 422    | Invalid body: 1-100 tags, each lowercase letters, digits, `-` and `:` |
| 503    | `REVALIDATE_SECRET` is not set on the frontend                        |

The frontend expires the tags immediately (`revalidateTag(tag, { expire: 0 })`): the next request for an affected
page waits for fresh data instead of getting stale content.

## Endpoints

Shapes below use TypeScript notation. The Zod schemas named after each endpoint are the source of truth
(`src/features/*/schemas.ts`); `src/mocks/mocks.test.ts` checks that the mock API matches them.

Shared types:

```ts
type Image = { src: string; alt: string; width: number; height: number };
type Stat = { value: number; prefix?: string; suffix?: string; label: string; icon?: string }; // "11:1" = { value: 11, suffix: ":1" }
type IconCard = { icon: string; title: string; text: string };
type Paginated<T> = { data: T[]; meta: { page: number; pageSize: number; total: number; totalPages: number } };
type Photo = { image: Image; title?: string; caption?: string }; // title on the tile, caption in the lightbox
type Link = { label: string; href: string }; // href: site path ("/campus"), http(s) URL or "mailto:"; never "javascript:"
type Cta = { title: string; text: string; link: Link };
type File = { title: string; description?: string; url: string; format: string; sizeBytes: number }; // format: "PDF"

// Rich text (article bodies, notices, event descriptions): a list of typed blocks, never HTML.
// Text is plain (no inline markup). Headings are rendered as h2 and build the table of contents.
type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: Image; caption?: string }
  | { type: "callout"; title: string; text: string };
```

`icon` fields are [Bootstrap Icons](https://icons.getbootstrap.com/) names (e.g. `"trophy"`). The frontend ships a
subset of icons and shows a default icon for names it doesn't know.

**Cache tags:** each endpoint lists the tags the frontend caches its response under. When content changes, send the
listed tags to the revalidation webhook. Sending the collection tag (e.g. `programs`) refreshes everything of that type.

### Page content

#### `GET /pages/{key}`

Editable copy for the mostly-static pages. `key` is one of `home`, `about`, `programs`, `admissions`, `campus`,
`student-life`, `alumni`, `careers`, `privacy`, `terms`.

- **200:** the page object. Shapes: `homePageSchema`, `aboutPageSchema`, `programsPageSchema`, `admissionsPageSchema`,
  `campusPageSchema`, `studentLifePageSchema`, `alumniPageSchema`, `careersPageSchema` and `legalPageSchema` (for both
  `privacy` and `terms`) in `src/features/page-content/schemas.ts`. They contain titles, paragraphs, `Stat[]`,
  `IconCard[]`, testimonials (`{ quote, name, role, photo: Image }`), link cards (`{ title, text, href, image }`, `href`
  is a site path like `/campus`), `Link`s, `Cta`s, `Photo`s and `File`s. Cross-references: the programs `spotlight`
  names a program by `programSlug`; the campus page names a gallery album by `galleryAlbum`.
- Admissions: `deadlines.entries[].date` is a day (`YYYY-MM-DD`); `fees.rows[].termFee` is a whole number of pounds.
- Legal pages: `{ summary, updatedOn: "YYYY-MM-DD", body: ContentBlock[] }`.
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

### News

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
type NewsArticle = NewsSummary & {
  body: ContentBlock[];
  tags: string[];
  author: { name: string; role: string; photo: Image; bio: string };
};
```

#### `GET /news?category=&q=&page=&pageSize=`

- `category` (optional): a `NewsCategory`. `q` (optional, max 100 characters): case- and accent-insensitive match on
  title, excerpt and tags.
- **200:** `Paginated<NewsSummary>`, newest first.
- **422:** invalid query.
- **Cache tag:** `news`

#### `GET /news/{slug}`

- **200:** `NewsArticle`. **404:** unknown slug.
- **Cache tags:** `news`, `news:{slug}`

#### `GET /news/categories`

- **200:** `Paginated<{ category: NewsCategory; count: number }>`: every category in display order, with its number
  of published articles (0 included).
- **Cache tag:** `news`

### Notices

```ts
type NoticeCategory = "general" | "term-dates" | "exams" | "closures" | "health" | "admissions";
type NoticeSummary = {
  slug: string;
  title: string;
  summary: string;
  category: NoticeCategory;
  publishedAt: string; // ISO 8601
  important: boolean; // badge, and listed first
  audience: string[]; // e.g. ["Parents", "Year 11"]
};
type Notice = NoticeSummary & {
  body: ContentBlock[];
  contact?: { name: string; email: string };
};
```

#### `GET /notices?category=&q=&page=&pageSize=`

- `category` (optional): a `NoticeCategory`. `q` (optional, max 100 characters): matches title and summary.
- **200:** `Paginated<NoticeSummary>`: important notices first, then newest first. Expired notices should not be
  returned.
- **422:** invalid query.
- **Cache tag:** `notices` (the frontend also refreshes notice lists every few minutes without a webhook, because
  notices can be urgent)

#### `GET /notices/{slug}`

- **200:** `Notice`. **404:** unknown slug.
- **Cache tags:** `notices`, `notice:{slug}`

### Events

```ts
type EventCategory = "academic" | "sports" | "arts" | "community" | "alumni"; // alumni events also appear on /alumni
type EventSummary = {
  slug: string;
  title: string;
  summary: string;
  category: EventCategory;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601; may be on a later day for multi-day events
  location: string; // venue name, e.g. "Main Hall" or "St Mary's Church"
  image: Image;
  featured: boolean; // highlighted in the events sidebar
};
type SchoolEvent = EventSummary & {
  description: ContentBlock[];
  schedule: { time: string; title: string; text: string }[]; // time "HH:MM", school time zone; may be empty
  address?: string; // postal address, only for venues away from the school, e.g. "Church Street, Greenfield GF1 4SM"
  organizer: { name: string; role: string; email: string };
  cost: string; // "Free", "£8 adults, £4 pupils"
  registration: { deadline: string; capacity?: number } | null; // null = no booking needed
};
```

#### `GET /events?from=&to=&category=&featured=&page=&pageSize=`

- `from`, `to` (optional): days, `YYYY-MM-DD`, in the school's time zone. An event matches when it **overlaps** the
  range: it ends on or after `from` and starts on or before `to`. So a multi-day event appears in every month it runs
  in, and an event in progress still counts as upcoming.
- `category` (optional): an `EventCategory`. `featured` (optional): `true` or `false`.
- **200:** `Paginated<EventSummary>`, soonest first.
- **422:** invalid query.
- **Cache tag:** `events`

The frontend uses it for: upcoming events (`from=today`), a month in the list or calendar view (`from` and `to` =
first and last day of the month), the featured event (`from=today&featured=true&pageSize=1`) and related events
(`from=today&category=...`).

#### `GET /events/{slug}`

- **200:** `SchoolEvent`. **404:** unknown slug.
- **Cache tags:** `events`, `event:{slug}`

#### Frontend only: `GET {SITE_URL}/events/{slug}/calendar.ics`

Not a backend endpoint. The frontend turns `GET /events/{slug}` into an iCalendar file for "Add to Calendar".

### FAQ

```ts
type Faq = {
  id: string; // slug, also the question's anchor: /faq#school-day-times
  question: string;
  answer: string[]; // paragraphs of plain text
  category: { slug: string; name: string };
};
```

#### `GET /faqs?category=&page=&pageSize=`

- `category` (optional): a category slug (e.g. `admissions`, shown on the admissions page).
- **200:** `Paginated<Faq>` in display order: categories in the editors' order, then questions in the editors' order.
  The frontend groups questions by category in the order they arrive.
- **422:** invalid query.
- **Cache tag:** `faqs`

### Gallery

```ts
type AlbumSummary = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD, when the photos were taken
  cover: Image;
  photoCount: number;
};
type Album = AlbumSummary & { photos: Photo[] }; // images at full size (e.g. 1400px wide); the frontend resizes them
```

#### `GET /gallery/albums?page=&pageSize=`

- **200:** `Paginated<AlbumSummary>`, newest first.
- **Cache tag:** `gallery`

#### `GET /gallery/albums/{slug}`

- **200:** `Album`. **404:** unknown slug.
- **Cache tags:** `gallery`, `album:{slug}`

### Careers

```ts
type VacancySummary = {
  slug: string;
  title: string;
  category: "teaching" | "support";
  department: string;
  contract: "permanent" | "fixed-term";
  pattern: "full-time" | "part-time";
  salary: string; // as advertised, e.g. "£24,500 - £26,800 per annum"
  startDate: string; // free text, e.g. "January 2027"
  postedAt: string; // ISO 8601, when the vacancy was advertised
  closesAt: string; // ISO 8601
  summary: string;
};
type Vacancy = VacancySummary & {
  description: ContentBlock[];
  responsibilities: string[];
  requirements: string[];
  applicationPack: File | null;
  contact: { name: string; role: string; email: string };
};
```

#### `GET /careers/vacancies?category=&page=&pageSize=`

- `category` (optional): `teaching` or `support`.
- **200:** `Paginated<VacancySummary>`: **open vacancies only** (`closesAt` in the future), closing soonest first.
- **422:** invalid query.
- **Cache tag:** `careers` (the frontend also refreshes the list hourly, so a vacancy disappears soon after it closes)

#### `GET /careers/vacancies/{slug}`

- **200:** `Vacancy`, **also after it has closed** (old links then show "Applications closed"). **404:** unknown or
  deleted slug.
- **Cache tags:** `careers`, `vacancy:{slug}`

### Form submissions (POST)

All four endpoints take JSON, validate it with the schema named below (the frontend validates with the same schema
first) and answer:

- **201:** `{ "id": string, "message": string }`.
- **422:** `{ message, errors: { field: [messages] } }`. Error messages are shown to visitors, so write them for
  people ("Enter your full name."). An error about the whole submission uses the key `_form`.
- **429:** too many submissions from one client. The frontend also limits submissions per IP address.

The frontend sends no cache tags here: none of these submissions changes content shown on the site.

```ts
type ContactMessage = {
  name: string; // 2-100 characters
  email: string;
  phone?: string;
  topic: "general" | "admissions" | "fees" | "events" | "alumni" | "careers";
  message: string; // 1-3000 characters
};
type AdmissionEnquiry = {
  parentName: string;
  email: string;
  phone?: string;
  childName: string;
  yearGroup: "nursery" | "reception" | "year-1" | "year-2" /* ... */ | "year-13";
  start: "as-soon-as-possible" | "next-september" | "following-september";
  prospectus: boolean; // post a printed prospectus
  visit: boolean; // contact the family to arrange a visit
  message?: string; // up to 2000 characters
};
type NewsletterSubscription = { email: string };
type EventRegistration = {
  name: string;
  email: string;
  phone?: string;
  places: number; // 1-10
  notes?: string; // access or dietary needs, up to 500 characters
};
```

| Endpoint                            | Body                     | Schema                                                 | Notes                                                                                                                                         |
| ----------------------------------- | ------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /contact-messages`            | `ContactMessage`         | `contactMessageSchema` (`features/contact`)            | Route to the right team by `topic`.                                                                                                           |
| `POST /admission-enquiries`         | `AdmissionEnquiry`       | `admissionEnquirySchema` (`features/admissions`)       |                                                                                                                                               |
| `POST /newsletter-subscriptions`    | `NewsletterSubscription` | `newsletterSubscriptionSchema` (`features/newsletter`) | Answer 201 even if the address is already subscribed (don't reveal the list); send a confirmation email (double opt-in).                      |
| `POST /events/{slug}/registrations` | `EventRegistration`      | `eventRegistrationSchema` (`features/events`)          | **404** unknown event. **422** with `_form` when the event has no booking or the deadline has passed; with `places` when not enough are left. |
