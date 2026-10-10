import type { Notice } from "@/features/notices";
import type { ContentBlock } from "@/lib/api/schemas";

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const h = (text: string): ContentBlock => ({ type: "heading", text });
const list = (...items: string[]): ContentBlock => ({ type: "list", items });
const callout = (title: string, text: string): ContentBlock => ({ type: "callout", title, text });

const office = { name: "School Office", email: "info@greenfield-academy.example" };
const exams = { name: "Examinations Office", email: "exams@greenfield-academy.example" };
const admissions = { name: "Admissions Team", email: "admissions@greenfield-academy.example" };
const nurse = { name: "School Nurse", email: "health@greenfield-academy.example" };

/** Unsorted on purpose: the handler sorts important first, then newest first. */
export const notices: Notice[] = [
  {
    slug: "term-dates-2026-27",
    title: "Term dates for 2026-27",
    summary: "Term, half-term and staff training dates for the whole school year.",
    category: "term-dates",
    publishedAt: "2026-06-30T09:00:00Z",
    important: false,
    audience: ["Parents", "Pupils"],
    contact: office,
    body: [
      p("Please find below the term dates for the 2026-27 school year. All dates apply to every year group."),
      h("Autumn term"),
      list(
        "Staff training days: 1 and 2 September 2026",
        "Term starts: Thursday 3 September 2026",
        "Half term: 26 to 30 October 2026",
        "Term ends: Friday 18 December 2026 at 12.30 pm",
      ),
      h("Spring term"),
      list(
        "Staff training day: 4 January 2027",
        "Term starts: Tuesday 5 January 2027",
        "Half term: 15 to 19 February 2027",
        "Term ends: Friday 26 March 2027",
      ),
      h("Summer term"),
      list(
        "Term starts: Monday 12 April 2027",
        "May Day holiday: Monday 3 May 2027",
        "Half term: 31 May to 4 June 2027",
        "Term ends: Friday 16 July 2027",
      ),
    ],
  },
  {
    slug: "parking-changes-during-building-work",
    title: "Changes to parking during building work",
    summary: "The front car park is closed from 12 October while the new sports pavilion is built.",
    category: "general",
    publishedAt: "2026-10-02T08:00:00Z",
    important: true,
    audience: ["Parents"],
    contact: office,
    body: [
      p(
        "Work on our new sports pavilion begins on Monday 12 October and is expected to finish at Easter. To keep everyone safe, the front car park will be closed to parents for the duration of the work.",
      ),
      h("Drop-off and collection"),
      list(
        "Please use the Meadow Lane entrance and the one-way system around the field",
        "The drop-off zone is open from 8.00 am to 8.40 am and from 3.20 pm to 4.00 pm",
        "Parents of Nursery and Reception children may park in the staff car park at those times",
      ),
      callout(
        "Walk, cycle or scoot",
        "If you can leave the car at home, please do. The bike shelters by the sports hall have space for 120 bikes and scooters.",
      ),
    ],
  },
  {
    slug: "flu-vaccinations-autumn-2026",
    title: "Flu vaccinations: consent forms due 16 October",
    summary: "The school immunisation team will offer the nasal flu vaccine to pupils in Reception to Year 11.",
    category: "health",
    publishedAt: "2026-09-25T10:00:00Z",
    important: true,
    audience: ["Parents"],
    contact: nurse,
    body: [
      p(
        "The local school immunisation team will visit Greenfield on Tuesday 3 November to offer the nasal flu vaccine to pupils from Reception to Year 11.",
      ),
      p(
        "Parents and carers should complete the online consent form by Friday 16 October, whether or not they would like their child to be vaccinated.",
      ),
      callout(
        "Pupils with medical conditions",
        "If your child has asthma, a weakened immune system or an egg allergy, please speak to the school nurse before completing the form.",
      ),
    ],
  },
  {
    slug: "gcse-mock-examinations-december-2026",
    title: "Year 11 mock examinations: 30 November to 11 December",
    summary: "The timetable and examination rules for the Year 11 winter mock examinations.",
    category: "exams",
    publishedAt: "2026-09-28T12:00:00Z",
    important: false,
    audience: ["Year 11", "Parents"],
    contact: exams,
    body: [
      p(
        "Year 11 mock examinations take place in the Examination Hall from Monday 30 November to Friday 11 December. Pupils will receive their personal timetables from their form tutors on 2 November.",
      ),
      h("What to bring"),
      list(
        "Black pens, a pencil, a ruler and an eraser in a clear pencil case",
        "A scientific calculator for mathematics and science papers",
        "A clear water bottle with the label removed",
      ),
      h("Rules"),
      p(
        "Mobile phones and smart watches must be handed in before every examination. Pupils who arrive late should report to the examinations office.",
      ),
    ],
  },
  {
    slug: "a-level-mock-examinations-january-2027",
    title: "Year 13 mock examinations: 11 to 22 January",
    summary: "Mock A Level examinations for Year 13, with results returned before February half term.",
    category: "exams",
    publishedAt: "2026-09-15T12:00:00Z",
    important: false,
    audience: ["Year 13", "Parents"],
    contact: exams,
    body: [
      p(
        "Year 13 will sit mock A Level examinations from Monday 11 to Friday 22 January. Students will receive their timetables before the Christmas holidays.",
      ),
      p("Teachers will return marked papers and go through them in lessons before February half term."),
    ],
  },
  {
    slug: "year-7-entry-2027-applications-open",
    title: "Year 7 entry 2027: applications now open",
    summary: "Applications for Year 7 places in September 2027 close on 13 November 2026.",
    category: "admissions",
    publishedAt: "2026-09-01T09:00:00Z",
    important: false,
    audience: ["Prospective parents"],
    contact: admissions,
    body: [
      p(
        "We are now accepting applications for Year 7 places starting in September 2027. The closing date for applications is Friday 13 November 2026.",
      ),
      h("Key dates"),
      list(
        "Whole-school open morning: Saturday 17 October 2026",
        "Applications close: Friday 13 November 2026",
        "Assessment morning: Saturday 9 January 2027",
        "Offers sent: Monday 1 March 2027",
      ),
      callout(
        "Bursaries",
        "Means-tested bursaries of up to 100% of fees are available. Please indicate on your application form if you would like to apply.",
      ),
    ],
  },
  {
    slug: "updated-mobile-phone-policy",
    title: "Updated mobile phone policy from September",
    summary: "Phones must be switched off and kept in lockers during the school day for pupils in Years 7 to 11.",
    category: "general",
    publishedAt: "2026-07-10T09:00:00Z",
    important: false,
    audience: ["Parents", "Pupils"],
    contact: office,
    body: [
      p(
        "Following consultation with parents, pupils and staff, our updated mobile phone policy applies from September. Pupils in Years 7 to 11 must switch off their phones and keep them in their lockers between 8.40 am and 3.30 pm.",
      ),
      p(
        "Sixth Form students may use phones in the Sixth Form Centre only. Parents who need to contact their child urgently should call the school office.",
      ),
    ],
  },
  {
    slug: "severe-weather-closure-procedure",
    title: "What happens if the school has to close for bad weather",
    summary: "How we decide to close, how we tell you, and how remote learning works on a closure day.",
    category: "closures",
    publishedAt: "2026-09-08T09:00:00Z",
    important: false,
    audience: ["Parents", "Pupils"],
    contact: office,
    body: [
      p(
        "We do everything we can to stay open, but very occasionally snow or flooding makes it unsafe to travel. The Head makes a decision by 7.00 am.",
      ),
      h("How you will hear"),
      list("A text message and email to all parents", "A notice at the top of this page", "Local radio announcements"),
      h("Learning from home"),
      p(
        "On a closure day, lessons continue online from 9.30 am. Pupils should log in to the learning platform and follow their normal timetable.",
      ),
    ],
  },
  {
    slug: "lost-property-sale",
    title: "Lost property: unnamed items donated at half term",
    summary: "Please check the lost property cupboard before 23 October. Unnamed items will go to charity.",
    category: "general",
    publishedAt: "2026-09-30T14:00:00Z",
    important: false,
    audience: ["Parents", "Pupils"],
    contact: office,
    body: [
      p(
        "The lost property cupboard outside the sports hall is overflowing. Please ask your child to check it, or visit the school office before Friday 23 October.",
      ),
      p(
        "Unnamed items still unclaimed at half term will be donated to the Parents' Association second-hand uniform sale.",
      ),
    ],
  },
  {
    slug: "school-photographs-2026",
    title: "School photographs: 14 and 15 October",
    summary: "Individual and sibling photographs will be taken in the library. Full uniform, please.",
    category: "general",
    publishedAt: "2026-09-22T09:00:00Z",
    important: false,
    audience: ["Parents"],
    contact: office,
    body: [
      p(
        "Individual photographs will be taken on Wednesday 14 October (Primary) and Thursday 15 October (Senior School and Sixth Form). Sibling photographs can be taken before school on either day from 8.00 am.",
      ),
      p("Proofs will be sent home within two weeks, with instructions for ordering online."),
    ],
  },
];
