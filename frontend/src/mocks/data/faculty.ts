import type { Department, FacultyMember } from "@/features/faculty";
import { placeholderImage } from "../utils";

/** Departments in display order. `staffCount` is computed by the mock handler. */
export const departments: Omit<Department, "staffCount">[] = [
  {
    slug: "senior-leadership",
    name: "Senior Leadership",
    description: "Sets the school's direction and makes sure every pupil is known, challenged and supported.",
    icon: "diagram-3",
  },
  {
    slug: "early-years-primary",
    name: "Early Years & Primary",
    description: "Class teachers who give children aged 3 to 11 a joyful, secure start to their education.",
    icon: "backpack",
  },
  {
    slug: "english",
    name: "English",
    description: "Building confident readers, writers and speakers, from first stories to A Level literature.",
    icon: "book",
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    description: "Fluency, reasoning and problem solving, with further maths and competitions for keen mathematicians.",
    icon: "calculator",
  },
  {
    slug: "science",
    name: "Science",
    description: "Biology, chemistry and physics taught by specialists in eight modern laboratories.",
    icon: "flask",
  },
  {
    slug: "humanities",
    name: "Humanities",
    description: "History, geography, religious studies and politics, with fieldwork and visits in every year group.",
    icon: "globe",
  },
  {
    slug: "modern-languages",
    name: "Modern Languages",
    description: "French and Spanish from age 5, with exchanges to our partner schools in France and Spain.",
    icon: "translate",
  },
  {
    slug: "creative-arts",
    name: "Creative Arts",
    description: "Art, music and drama in our Arts Centre, with concerts, exhibitions and productions every term.",
    icon: "palette",
  },
  {
    slug: "computing",
    name: "Computing",
    description: "Programming, digital literacy and computer science, from first algorithms to A Level projects.",
    icon: "cpu",
  },
  {
    slug: "physical-education",
    name: "Physical Education & Sport",
    description: "A sport for everyone, with weekly fixtures and coaching for all abilities.",
    icon: "trophy",
  },
  {
    slug: "learning-support",
    name: "Learning Support & Wellbeing",
    description: "Specialist support for pupils with additional needs, and counselling for anyone who needs to talk.",
    icon: "heart-pulse",
  },
];

function department(slug: string): FacultyMember["department"] {
  const found = departments.find((d) => d.slug === slug);
  if (!found) throw new Error(`Unknown department in mock data: ${slug}`);
  return { slug: found.slug, name: found.name };
}

function photo(name: string): FacultyMember["photo"] {
  return placeholderImage(400, 400, name, `Portrait of ${name}`);
}

/** Staff in directory order: leadership first, then by department. */
export const faculty: FacultyMember[] = [
  // Senior Leadership
  {
    slug: "eleanor-whitfield",
    name: "Dr Eleanor Whitfield",
    role: "Head of School",
    department: department("senior-leadership"),
    photo: photo("Dr Eleanor Whitfield"),
    shortBio: "Leads the school with a focus on academic ambition and the wellbeing of every pupil.",
    email: "eleanor.whitfield@greenfield-academy.example",
    bio: [
      "Dr Whitfield became Head of School in 2018, having joined Greenfield as Deputy Head in 2015. Before that she taught English and led the Sixth Form at schools in London and Edinburgh.",
      "She holds a doctorate in education from the University of Bristol, where her research focused on how schools build pupils' confidence as independent learners. She still teaches a Year 12 literature group each week.",
    ],
    qualifications: ["EdD, University of Bristol", "MA English Literature, University of Edinburgh", "PGCE"],
    subjects: ["English literature"],
    joinedYear: 2015,
  },
  {
    slug: "james-thornton",
    name: "Mr James Thornton",
    role: "Deputy Head (Academic)",
    department: department("senior-leadership"),
    photo: photo("Mr James Thornton"),
    shortBio: "Oversees the curriculum, teaching quality and examinations across the school.",
    email: "james.thornton@greenfield-academy.example",
    bio: [
      "Mr Thornton leads teaching and learning across Greenfield, from curriculum design to assessment and staff training. He joined as Head of Physics in 2010.",
      "A keen astronomer, he runs the school's observatory evenings and still teaches GCSE physics.",
    ],
    qualifications: ["MSc Physics, University of Manchester", "PGCE, University of Cambridge"],
    subjects: ["Physics"],
    joinedYear: 2010,
  },
  {
    slug: "aisha-rahman",
    name: "Mrs Aisha Rahman",
    role: "Deputy Head (Pastoral)",
    department: department("senior-leadership"),
    photo: photo("Mrs Aisha Rahman"),
    shortBio: "Leads pastoral care, safeguarding and pupil wellbeing from Nursery to Sixth Form.",
    email: "aisha.rahman@greenfield-academy.example",
    bio: [
      "Mrs Rahman is responsible for pastoral care across the school and is the Designated Safeguarding Lead. She works closely with tutors, the learning support team and families.",
      "She joined Greenfield in 2013 as a geography teacher and introduced the school's peer mentoring scheme and wellbeing curriculum.",
    ],
    qualifications: ["BA Geography, University of Leeds", "PGCE", "Advanced Safeguarding Certificate"],
    subjects: ["Geography", "Personal development"],
    joinedYear: 2013,
  },
  {
    slug: "david-okonkwo",
    name: "Mr David Okonkwo",
    role: "Head of Sixth Form",
    department: department("senior-leadership"),
    photo: photo("Mr David Okonkwo"),
    shortBio: "Guides Sixth Form students through A Levels and their next steps after school.",
    email: "david.okonkwo@greenfield-academy.example",
    bio: [
      "Mr Okonkwo leads the Sixth Form and its team of tutors, and oversees university and careers guidance. Under his leadership, 96% of leavers secured their first-choice university place this year.",
      "He teaches A Level economics and coaches the senior debating team.",
    ],
    qualifications: ["BSc Economics, London School of Economics", "PGCE, UCL Institute of Education"],
    subjects: ["Economics"],
    joinedYear: 2016,
  },
  {
    slug: "claire-bennett",
    name: "Ms Claire Bennett",
    role: "Head of Primary",
    department: department("senior-leadership"),
    photo: photo("Ms Claire Bennett"),
    shortBio: "Leads the Early Years and Primary school, from Nursery to Year 6.",
    email: "claire.bennett@greenfield-academy.example",
    bio: [
      "Ms Bennett leads the Primary school and its 40 staff. She is passionate about early reading and introduced the phonics programme now used from Nursery to Year 2.",
      "Before joining Greenfield she was deputy head of a primary school in Bath.",
    ],
    qualifications: ["BEd Primary Education, University of Exeter", "National Professional Qualification for Headship"],
    subjects: ["Primary curriculum"],
    joinedYear: 2019,
  },

  // Early Years & Primary
  {
    slug: "sophie-turner",
    name: "Mrs Sophie Turner",
    role: "Early Years Lead",
    department: department("early-years-primary"),
    photo: photo("Mrs Sophie Turner"),
    shortBio: "Leads Nursery and Reception, where learning through play comes first.",
    email: "sophie.turner@greenfield-academy.example",
    bio: [
      "Mrs Turner founded Greenfield's Early Years department in 2012 and has led it ever since. She is a qualified Forest School practitioner.",
      "She believes young children learn best through play, talk and time outdoors, and works closely with parents to support each child's first steps in school.",
    ],
    qualifications: [
      "BA Early Childhood Studies, University of Roehampton",
      "Early Years Teacher Status",
      "Forest School Level 3",
    ],
    subjects: ["Early Years Foundation Stage", "Forest School"],
    joinedYear: 2012,
  },
  {
    slug: "hannah-price",
    name: "Miss Hannah Price",
    role: "Reception Class Teacher",
    department: department("early-years-primary"),
    photo: photo("Miss Hannah Price"),
    shortBio: "Teaches Reception and leads early reading across the Early Years.",
    email: "hannah.price@greenfield-academy.example",
    bio: [
      "Miss Price teaches one of our two Reception classes and coordinates phonics in the Early Years.",
      "Outside school she is a keen storyteller and runs the Reception parents' reading workshops each autumn.",
    ],
    qualifications: ["BA Primary Education with QTS, University of Worcester"],
    subjects: ["Reception curriculum", "Phonics"],
    joinedYear: 2021,
  },
  {
    slug: "liam-walsh",
    name: "Mr Liam Walsh",
    role: "Year 4 Class Teacher",
    department: department("early-years-primary"),
    photo: photo("Mr Liam Walsh"),
    shortBio: "Teaches Year 4 and coordinates primary science.",
    email: "liam.walsh@greenfield-academy.example",
    bio: [
      "Mr Walsh teaches Year 4 and leads primary science, organising the annual Primary Science Week and the Year 4 residential trip.",
      "He previously worked as an environmental scientist before training as a teacher.",
    ],
    qualifications: ["BSc Environmental Science, University of Sheffield", "PGCE Primary"],
    subjects: ["Year 4 curriculum", "Primary science"],
    joinedYear: 2018,
  },

  // English
  {
    slug: "rebecca-hughes",
    name: "Dr Rebecca Hughes",
    role: "Head of English",
    department: department("english"),
    photo: photo("Dr Rebecca Hughes"),
    shortBio: "Leads English from Year 7 to A Level and runs the school's creative writing society.",
    email: "rebecca.hughes@greenfield-academy.example",
    bio: [
      "Dr Hughes leads a team of eight English teachers. Her doctorate explored Victorian children's literature, and she loves introducing pupils to authors they would never have picked up on their own.",
      "She runs the creative writing society and edits the school's literary magazine, The Meadow.",
    ],
    qualifications: ["PhD English Literature, University of York", "PGCE"],
    subjects: ["English language", "English literature"],
    joinedYear: 2014,
  },
  {
    slug: "samuel-adeyemi",
    name: "Mr Samuel Adeyemi",
    role: "Teacher of English",
    department: department("english"),
    photo: photo("Mr Samuel Adeyemi"),
    shortBio: "Teaches English across the senior school and coaches the junior debating team.",
    email: "samuel.adeyemi@greenfield-academy.example",
    bio: [
      "Mr Adeyemi teaches English from Year 7 to GCSE and coaches the junior debating team, which reached the regional final in 2026.",
      "He is particularly interested in spoken poetry and organises the annual Poetry Slam.",
    ],
    qualifications: ["BA English, University of Warwick", "PGCE"],
    subjects: ["English language", "English literature", "Debating"],
    joinedYear: 2020,
  },

  // Mathematics
  {
    slug: "raj-patel",
    name: "Mr Raj Patel",
    role: "Head of Mathematics",
    department: department("mathematics"),
    photo: photo("Mr Raj Patel"),
    shortBio: "Leads mathematics and prepares pupils for national maths challenges and olympiads.",
    email: "raj.patel@greenfield-academy.example",
    bio: [
      "Mr Patel leads the mathematics department and teaches further mathematics in the Sixth Form. He worked as an actuary before training as a teacher.",
      "He runs the maths club and prepares pupils for the national mathematics challenges, in which Greenfield pupils win dozens of certificates each year.",
    ],
    qualifications: ["MMath, University of Warwick", "PGCE"],
    subjects: ["Mathematics", "Further mathematics"],
    joinedYear: 2012,
  },
  {
    slug: "emily-clarke",
    name: "Ms Emily Clarke",
    role: "Teacher of Mathematics",
    department: department("mathematics"),
    photo: photo("Ms Emily Clarke"),
    shortBio: "Teaches mathematics from Year 7 to A Level and runs the weekly maths clinic.",
    email: "emily.clarke@greenfield-academy.example",
    bio: [
      "Ms Clarke teaches mathematics across the senior school and runs a drop-in maths clinic every Wednesday lunchtime.",
      "She is also a Year 9 form tutor and coaches the under-13 netball team.",
    ],
    qualifications: ["BSc Mathematics, University of Nottingham", "PGCE"],
    subjects: ["Mathematics", "Statistics"],
    joinedYear: 2019,
  },

  // Science
  {
    slug: "amelia-hart",
    name: "Dr Amelia Hart",
    role: "Head of Science",
    department: department("science"),
    photo: photo("Dr Amelia Hart"),
    shortBio: "Leads the science faculty and teaches chemistry from GCSE to A Level.",
    email: "amelia.hart@greenfield-academy.example",
    bio: [
      "Dr Hart leads a team of twelve science teachers and technicians. She completed a doctorate in materials chemistry before moving into teaching, and helped design the Science & Innovation Centre that opened in 2021.",
      "She coordinates the STEM Academy and the school's partnership with local engineering firms.",
    ],
    qualifications: ["DPhil Chemistry, University of Oxford", "PGCE, University of Cambridge"],
    subjects: ["Chemistry"],
    joinedYear: 2011,
  },
  {
    slug: "benjamin-cole",
    name: "Mr Benjamin Cole",
    role: "Teacher of Physics",
    department: department("science"),
    photo: photo("Mr Benjamin Cole"),
    shortBio: "Teaches physics and leads the STEM Academy's robotics teams.",
    email: "benjamin.cole@greenfield-academy.example",
    bio: [
      "Mr Cole teaches physics from Year 7 to A Level and leads the robotics teams in the STEM Academy, which qualified for the national final in 2026.",
      "Before teaching he worked as a mechanical engineer in the automotive industry.",
    ],
    qualifications: ["MEng Mechanical Engineering, University of Bath", "PGCE"],
    subjects: ["Physics", "Engineering"],
    joinedYear: 2017,
  },
  {
    slug: "nadia-hassan",
    name: "Dr Nadia Hassan",
    role: "Teacher of Biology",
    department: department("science"),
    photo: photo("Dr Nadia Hassan"),
    shortBio: "Teaches biology and supports Sixth Form students applying for medicine.",
    email: "nadia.hassan@greenfield-academy.example",
    bio: [
      "Dr Hassan teaches biology across the senior school and coordinates support for students applying to study medicine, dentistry and veterinary science.",
      "Her research background is in genetics, and she runs the Sixth Form biology journal club.",
    ],
    qualifications: ["PhD Genetics, King's College London", "PGCE"],
    subjects: ["Biology"],
    joinedYear: 2018,
  },

  // Humanities
  {
    slug: "thomas-reed",
    name: "Mr Thomas Reed",
    role: "Head of Humanities",
    department: department("humanities"),
    photo: photo("Mr Thomas Reed"),
    shortBio: "Leads history, geography and religious studies, and organises the battlefields trip.",
    email: "thomas.reed@greenfield-academy.example",
    bio: [
      "Mr Reed leads the humanities faculty and teaches history from Year 7 to A Level. He organises the Year 9 battlefields trip and the Sixth Form history conference.",
      "He is a published author of two books on local history and an examiner for A Level history.",
    ],
    qualifications: ["MA History, University of Durham", "PGCE"],
    subjects: ["History", "Politics"],
    joinedYear: 2009,
  },
  {
    slug: "grace-mitchell",
    name: "Ms Grace Mitchell",
    role: "Teacher of Geography",
    department: department("humanities"),
    photo: photo("Ms Grace Mitchell"),
    shortBio: "Teaches geography and leads fieldwork trips from Year 7 to A Level.",
    email: "grace.mitchell@greenfield-academy.example",
    bio: [
      "Ms Mitchell teaches geography and coordinates fieldwork, from river studies in Year 8 to the A Level residential in the Lake District.",
      "She also leads the school's Eco-Committee and rooftop garden project.",
    ],
    qualifications: ["BSc Geography, University of Southampton", "PGCE"],
    subjects: ["Geography"],
    joinedYear: 2021,
  },

  // Modern Languages
  {
    slug: "isabelle-laurent",
    name: "Mme Isabelle Laurent",
    role: "Head of Modern Languages",
    department: department("modern-languages"),
    photo: photo("Mme Isabelle Laurent"),
    shortBio: "Leads French and Spanish and runs the exchange with our partner school in Lyon.",
    email: "isabelle.laurent@greenfield-academy.example",
    bio: [
      "Mme Laurent grew up in Lyon and has taught French in England for over fifteen years. She leads the modern languages department and the annual exchange with our partner school in Lyon.",
      "She also teaches French in the Primary school, where every pupil starts a language from Year 1.",
    ],
    qualifications: ["Maîtrise, Université Lumière Lyon 2", "PGCE Modern Languages"],
    subjects: ["French"],
    joinedYear: 2011,
  },
  {
    slug: "carlos-ortega",
    name: "Mr Carlos Ortega",
    role: "Teacher of Spanish",
    department: department("modern-languages"),
    photo: photo("Mr Carlos Ortega"),
    shortBio: "Teaches Spanish from Year 3 to A Level and organises the trip to Salamanca.",
    email: "carlos.ortega@greenfield-academy.example",
    bio: [
      "Mr Ortega teaches Spanish across the school and organises the Year 10 language trip to Salamanca.",
      "He runs the Spanish film club and the lunchtime conversation sessions for GCSE and A Level students.",
    ],
    qualifications: ["BA Hispanic Studies, University of Glasgow", "PGCE"],
    subjects: ["Spanish"],
    joinedYear: 2020,
  },

  // Creative Arts
  {
    slug: "olivia-grant",
    name: "Ms Olivia Grant",
    role: "Director of Music",
    department: department("creative-arts"),
    photo: photo("Ms Olivia Grant"),
    shortBio: "Directs the school's orchestras and choirs and leads music from Year 1 to A Level.",
    email: "olivia.grant@greenfield-academy.example",
    bio: [
      "Ms Grant directs the Senior Orchestra, Chamber Choir and Jazz Band, and oversees the team of 22 visiting instrumental teachers.",
      "A professional cellist, she has performed with orchestras across Europe and still plays in a string quartet.",
    ],
    qualifications: ["BMus, Royal Northern College of Music", "PGCE Music"],
    subjects: ["Music"],
    joinedYear: 2015,
  },
  {
    slug: "felix-morgan",
    name: "Mr Felix Morgan",
    role: "Head of Art & Design",
    department: department("creative-arts"),
    photo: photo("Mr Felix Morgan"),
    shortBio: "Leads art and design and curates the Summer Arts Exhibition.",
    email: "felix.morgan@greenfield-academy.example",
    bio: [
      "Mr Morgan leads art and design, teaching painting, printmaking, ceramics and photography. He curates the Summer Arts Exhibition, which showcases work from every year group.",
      "He is a practising printmaker whose work has been exhibited in galleries in London and Bristol.",
    ],
    qualifications: ["BA Fine Art, Goldsmiths, University of London", "PGCE Art and Design"],
    subjects: ["Art and design", "Photography"],
    joinedYear: 2016,
  },

  // Computing
  {
    slug: "arjun-mehta",
    name: "Mr Arjun Mehta",
    role: "Head of Computing",
    department: department("computing"),
    photo: photo("Mr Arjun Mehta"),
    shortBio: "Leads computing and computer science and runs the coding club.",
    email: "arjun.mehta@greenfield-academy.example",
    bio: [
      "Mr Mehta leads computing across the school, from primary digital skills to A Level computer science. He spent eight years as a software developer before teaching.",
      "He runs the coding club and the Year 12 app development challenge.",
    ],
    qualifications: ["BSc Computer Science, University of Southampton", "PGCE Computing"],
    subjects: ["Computer science", "Computing"],
    joinedYear: 2017,
  },

  // Physical Education & Sport
  {
    slug: "jack-harrison",
    name: "Mr Jack Harrison",
    role: "Director of Sport",
    department: department("physical-education"),
    photo: photo("Mr Jack Harrison"),
    shortBio: "Leads PE and sport and coaches the senior football teams.",
    email: "jack.harrison@greenfield-academy.example",
    bio: [
      "Mr Harrison leads a team of ten PE teachers and coaches. He believes every pupil should find a sport they enjoy, and has expanded the fixture list so that every pupil who wants to represent the school can.",
      "A former semi-professional footballer, he coaches the senior football teams and the under-15 squad.",
    ],
    qualifications: ["BSc Sport Science, Loughborough University", "PGCE Physical Education", "UEFA B Licence"],
    subjects: ["Physical education", "Football"],
    joinedYear: 2014,
  },
  {
    slug: "chloe-evans",
    name: "Miss Chloe Evans",
    role: "Teacher of Physical Education",
    department: department("physical-education"),
    photo: photo("Miss Chloe Evans"),
    shortBio: "Teaches PE and leads netball, swimming and the inter-house competitions.",
    email: "chloe.evans@greenfield-academy.example",
    bio: [
      "Miss Evans teaches PE across the senior school and leads netball and swimming. She organises the inter-house competitions, including the swimming gala and Sports Day.",
      "She has represented Wales at under-21 level in netball.",
    ],
    qualifications: ["BSc Physical Education, Cardiff Metropolitan University", "PGCE"],
    subjects: ["Physical education", "Netball", "Swimming"],
    joinedYear: 2022,
  },

  // Learning Support & Wellbeing
  {
    slug: "laura-simmons",
    name: "Mrs Laura Simmons",
    role: "Special Educational Needs Coordinator",
    department: department("learning-support"),
    photo: photo("Mrs Laura Simmons"),
    shortBio: "Coordinates support for pupils with special educational needs across the school.",
    email: "laura.simmons@greenfield-academy.example",
    bio: [
      "Mrs Simmons leads the learning support team, working with pupils, parents and teachers to plan support for pupils with dyslexia, autism, ADHD and other additional needs.",
      "She trains staff in inclusive teaching and coordinates access arrangements for examinations.",
    ],
    qualifications: ["BA Psychology, University of Birmingham", "National Award for SEN Coordination", "PGCE"],
    subjects: ["Learning support", "Study skills"],
    joinedYear: 2016,
  },
  {
    slug: "daniel-foster",
    name: "Mr Daniel Foster",
    role: "School Counsellor",
    department: department("learning-support"),
    photo: photo("Mr Daniel Foster"),
    shortBio: "Offers confidential counselling to pupils and runs wellbeing workshops.",
    email: "daniel.foster@greenfield-academy.example",
    bio: [
      "Mr Foster provides confidential counselling to pupils from Year 5 upwards and runs wellbeing workshops on topics such as exam stress and friendships.",
      "He is an accredited counsellor and trains the school's peer mentors.",
    ],
    qualifications: ["MA Counselling and Psychotherapy, University of Nottingham", "BACP Accredited"],
    subjects: ["Counselling", "Wellbeing"],
    joinedYear: 2020,
  },
];
