import type { Vacancy } from "@/features/careers";
import type { ApiFile, ContentBlock } from "@/lib/api/schemas";

const p = (text: string): ContentBlock => ({ type: "paragraph", text });

const packs = {
  teaching: {
    title: "Application Pack (Teaching Staff)",
    description: "Job description, person specification and application form.",
    url: "/documents/application-pack-teaching.pdf",
    format: "PDF",
    sizeBytes: 762,
  },
  support: {
    title: "Application Pack (Support Staff)",
    description: "Job description, person specification and application form.",
    url: "/documents/application-pack-support-staff.pdf",
    format: "PDF",
    sizeBytes: 760,
  },
} satisfies Record<string, ApiFile>;

const hr = { name: "Mrs Sarah Collins", role: "HR Manager", email: "recruitment@greenfield-academy.example" };

/** Vacancies, including one that has already closed (its page shows "Applications closed"). */
export const vacancies: Vacancy[] = [
  {
    slug: "teacher-of-physics-2027",
    title: "Teacher of Physics",
    category: "teaching",
    department: "Science",
    contract: "permanent",
    pattern: "full-time",
    salary: "Greenfield pay scale (£38,500 - £56,200), plus TLR for the right candidate",
    startDate: "January 2027",
    postedAt: "2026-09-28T09:00:00Z",
    closesAt: "2026-10-30T12:00:00Z",
    summary:
      "We are looking for an enthusiastic physicist to teach across Years 7 to 13 in our new Science & Innovation Centre.",
    description: [
      p(
        "The Physics department is a team of five specialists, with excellent results: 68% of A Level candidates achieved A* or A last summer, and many go on to study physics or engineering.",
      ),
      p(
        "You will teach Key Stage 3 science and GCSE and A Level physics, with the opportunity to run the astronomy club in our rooftop observatory.",
      ),
    ],
    responsibilities: [
      "Plan and teach engaging physics lessons from Year 7 to Year 13",
      "Track pupils' progress and give regular, helpful feedback",
      "Act as a form tutor and contribute to the pastoral life of the school",
      "Lead or support at least one co-curricular activity",
    ],
    requirements: [
      "A degree in physics or a closely related subject",
      "Qualified Teacher Status, or working towards it",
      "The ability to teach physics confidently to A Level",
      "A commitment to safeguarding and the wellbeing of young people",
    ],
    applicationPack: packs.teaching,
    contact: hr,
  },
  {
    slug: "head-of-modern-languages-2027",
    title: "Head of Modern Languages",
    category: "teaching",
    department: "Modern Languages",
    contract: "permanent",
    pattern: "full-time",
    salary: "Greenfield pay scale plus Head of Department allowance (£6,800)",
    startDate: "September 2027",
    postedAt: "2026-10-05T09:00:00Z",
    closesAt: "2026-11-20T12:00:00Z",
    summary:
      "Lead a department of eight teaching French, Spanish, German and Mandarin, and shape our languages curriculum.",
    description: [
      p(
        "Our current Head of Department is retiring after nineteen years. We are looking for an inspiring linguist to lead a strong, friendly team and build on excellent exchange and trip programmes.",
      ),
      p("You will join the Middle Leaders' group and report to the Deputy Head (Academic)."),
    ],
    responsibilities: [
      "Lead, manage and develop a team of eight teachers and two language assistants",
      "Set the department's vision and review the curriculum from Year 5 to Year 13",
      "Organise exchanges with our partner schools in Lyon, Seville and Hamburg",
      "Teach a reduced timetable across the age range",
    ],
    requirements: [
      "An excellent degree in a modern foreign language",
      "Qualified Teacher Status and successful experience teaching to A Level",
      "Experience of leading a team or a major area of work",
      "Fluency in at least two of the languages we teach",
    ],
    applicationPack: packs.teaching,
    contact: hr,
  },
  {
    slug: "primary-teacher-maternity-cover-2027",
    title: "Year 4 Class Teacher (Maternity Cover)",
    category: "teaching",
    department: "Junior School",
    contract: "fixed-term",
    pattern: "full-time",
    salary: "Greenfield pay scale (£35,200 - £54,100)",
    startDate: "February 2027 until July 2027",
    postedAt: "2026-10-01T09:00:00Z",
    closesAt: "2026-11-06T12:00:00Z",
    summary: "Teach a happy Year 4 class of 20 pupils in our Junior School, covering maternity leave.",
    description: [
      p(
        "Our Junior School is a warm, ambitious community where children learn through curiosity and play. You will be supported by a full-time teaching assistant and an experienced year group partner.",
      ),
    ],
    responsibilities: [
      "Teach the Year 4 curriculum, including English, maths, science and the humanities",
      "Keep in close touch with parents through reading records and termly meetings",
      "Contribute to Junior School assemblies, trips and events",
    ],
    requirements: [
      "Qualified Teacher Status with primary experience",
      "Excellent classroom practice and high expectations of every child",
      "Warmth, energy and a sense of humour",
    ],
    applicationPack: packs.teaching,
    contact: hr,
  },
  {
    slug: "learning-support-assistant-2026",
    title: "Learning Support Assistant",
    category: "support",
    department: "Learning Support",
    contract: "permanent",
    pattern: "part-time",
    salary: "£15,800 per annum (£22,600 full-time equivalent), term time only",
    startDate: "As soon as possible",
    postedAt: "2026-09-30T09:00:00Z",
    closesAt: "2026-10-23T12:00:00Z",
    summary: "Help pupils with learning differences get the most out of their lessons, working four days a week.",
    description: [
      p(
        "You will work alongside teachers in the classroom and in small groups, supporting pupils with dyslexia, dyspraxia and other learning needs. Full training is provided.",
      ),
    ],
    responsibilities: [
      "Support individual pupils and small groups in lessons",
      "Run short reading and spelling interventions",
      "Keep careful notes and share pupils' progress with the Learning Support team",
    ],
    requirements: [
      "GCSEs (or equivalent) in English and maths at grade 4 or above",
      "Experience of working with children or young people",
      "Patience, kindness and good communication skills",
    ],
    applicationPack: packs.support,
    contact: hr,
  },
  {
    slug: "grounds-person-2027",
    title: "Grounds Person",
    category: "support",
    department: "Estates",
    contract: "permanent",
    pattern: "full-time",
    salary: "£24,500 - £26,800 per annum",
    startDate: "January 2027",
    postedAt: "2026-10-07T09:00:00Z",
    closesAt: "2027-01-08T12:00:00Z",
    summary: "Help keep our forty-acre campus, playing fields and cricket square in first-class condition.",
    description: [
      p(
        "Join a team of four looking after our sports pitches, gardens and woodland. You'll work 40 hours a week, Monday to Friday, with occasional Saturday mornings in the summer term for cricket fixtures.",
      ),
    ],
    responsibilities: [
      "Mow, mark and maintain sports pitches and the cricket square",
      "Look after gardens, hedges and woodland paths",
      "Operate and maintain grounds machinery safely",
    ],
    requirements: [
      "Experience of grounds maintenance or horticulture",
      "A full UK driving licence",
      "NPTC certificates in pesticide use are desirable but not essential",
    ],
    applicationPack: packs.support,
    contact: hr,
  },
  {
    slug: "school-receptionist-2026",
    title: "School Receptionist",
    category: "support",
    department: "School Office",
    contract: "permanent",
    pattern: "full-time",
    salary: "£23,900 per annum",
    startDate: "November 2026",
    postedAt: "2026-09-04T09:00:00Z",
    closesAt: "2026-09-25T12:00:00Z",
    summary: "Be the friendly first point of contact for visitors, parents and pupils at Main House Reception.",
    description: [
      p(
        "You will welcome visitors, answer calls and emails, and keep the signing-in system running smoothly. This is a busy, varied role at the heart of the school.",
      ),
    ],
    responsibilities: [
      "Welcome visitors and manage the signing-in and visitor badge system",
      "Answer the main school telephone line and inbox",
      "Support the school office with post, bookings and administration",
    ],
    requirements: [
      "Excellent communication and organisation skills",
      "Confidence with email, spreadsheets and booking systems",
      "A calm, friendly and professional manner",
    ],
    applicationPack: packs.support,
    contact: hr,
  },
];
