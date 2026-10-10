import type { NewsArticle } from "@/features/news";
import type { ContentBlock } from "@/lib/api/schemas";
import { placeholderImage } from "../utils";

// Small helpers to keep the article bodies readable.
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const h = (text: string): ContentBlock => ({ type: "heading", text });
const list = (...items: string[]): ContentBlock => ({ type: "list", items });
const quote = (text: string, cite?: string): ContentBlock => ({ type: "quote", text, cite });
const callout = (title: string, text: string): ContentBlock => ({ type: "callout", title, text });
const figure = (label: string, alt: string, caption?: string): ContentBlock => ({
  type: "image",
  image: placeholderImage(1100, 550, label, alt),
  caption,
});

function author(name: string, role: string, bio: string): NewsArticle["author"] {
  return { name, role, bio, photo: placeholderImage(400, 400, name, "") };
}

const head = author(
  "Dr Eleanor Whitfield",
  "Head of School",
  "Dr Whitfield has led Greenfield Academy since 2018 and still teaches a Year 12 literature group each week.",
);
const pastoral = author(
  "Mrs Aisha Rahman",
  "Deputy Head (Pastoral)",
  "Mrs Rahman leads pastoral care and safeguarding, and introduced the school's peer mentoring scheme.",
);
const sport = author(
  "Mr Jack Harrison",
  "Director of Sport",
  "Mr Harrison leads PE and sport and coaches the senior and under-15 football teams.",
);
const music = author(
  "Ms Olivia Grant",
  "Director of Music",
  "Ms Grant directs the Senior Orchestra and Chamber Choir, and is a professional cellist.",
);
const science = author(
  "Dr Amelia Hart",
  "Head of Science",
  "Dr Hart leads the science faculty and the STEM Academy, and teaches chemistry from GCSE to A Level.",
);
const sixthForm = author(
  "Mr David Okonkwo",
  "Head of Sixth Form",
  "Mr Okonkwo leads the Sixth Form and its university and careers guidance, and teaches A Level economics.",
);
const humanities = author(
  "Mr Thomas Reed",
  "Head of Humanities",
  "Mr Reed leads history, geography and religious studies, and has written two books on local history.",
);
const office = author(
  "Communications Office",
  "Greenfield Academy",
  "The communications team shares news from across the school. Story ideas are always welcome.",
);

function image(label: string, alt: string) {
  return placeholderImage(800, 460, label, alt);
}

/** Unsorted on purpose: the handler sorts newest first, as the real API will. */
export const news: NewsArticle[] = [
  {
    slug: "year-11-celebrate-record-gcse-results",
    title: "Year 11 celebrate record GCSE results",
    excerpt: "98% of grades were 9 to 4 and more than half were 9 to 7, the best results in the school's history.",
    category: "achievements",
    publishedAt: "2026-08-20T10:00:00Z",
    image: image("GCSE results day", "Year 11 pupils opening their GCSE results"),
    author: head,
    tags: ["GCSE", "Results", "Year 11"],
    body: [
      p(
        "There were smiles, hugs and a few happy tears in the Main Hall this morning as Year 11 collected their GCSE results. 98% of all grades were 9 to 4, and 54% were at the top grades of 9 to 7, the strongest set of results in Greenfield's history.",
      ),
      h("Highlights"),
      list(
        "31 pupils achieved at least seven grade 9s",
        "Every pupil passed English and mathematics",
        "Triple science results were the best in the county",
        "Our first computer science cohort averaged a grade 7",
      ),
      quote(
        "These results reflect years of hard work, curiosity and resilience. I am just as proud of the kindness this year group has shown one another along the way.",
        "Dr Eleanor Whitfield, Head of School",
      ),
      h("Looking ahead"),
      p(
        "Most of the year group will continue into our Sixth Form in September, where induction days begin on 2 September. Pupils who would like to discuss their A Level choices can book a meeting with Mr Okonkwo through the school office.",
      ),
      callout(
        "Results queries",
        "If you would like a script to be reviewed, please contact the examinations office by 25 September.",
      ),
    ],
  },
  {
    slug: "a-level-students-secure-university-places",
    title: "A Level students secure places at leading universities",
    excerpt: "78% of A Level grades were A* to B, and 96% of our leavers are heading to their first-choice university.",
    category: "achievements",
    publishedAt: "2026-08-13T09:30:00Z",
    image: image("A Level results", "Sixth Form students celebrating their A Level results"),
    author: sixthForm,
    tags: ["A Level", "Results", "Universities"],
    body: [
      p(
        "Our Year 13 students received their A Level results today, with 78% of grades at A* to B and 41% at A* or A. Ninety-six per cent of leavers have secured a place at their first-choice university or apprenticeship.",
      ),
      h("Where our leavers are going"),
      p(
        "This year's destinations include medicine at Edinburgh and King's College London, engineering at Bath and Imperial, history at Durham and a degree apprenticeship in software engineering with a national bank.",
      ),
      quote(
        "Every one of these offers was earned through two years of real independence and hard work. Our tutors are already looking forward to hearing how they get on.",
        "Mr David Okonkwo, Head of Sixth Form",
      ),
      h("Extended Project success"),
      p(
        "Twenty-two students also completed the Extended Project Qualification, with topics ranging from the ethics of gene editing to the history of Greenfield's own farmhouse library. Eighteen achieved an A* or A.",
      ),
    ],
  },
  {
    slug: "welcome-to-our-new-year-7-pupils",
    title: "A warm welcome to our new Year 7 pupils",
    excerpt:
      "112 pupils joined the Senior School this week, starting with a settling-in day of team challenges and a picnic.",
    category: "school-life",
    publishedAt: "2026-09-04T14:00:00Z",
    image: image("Year 7 welcome day", "New Year 7 pupils taking part in a team challenge"),
    author: pastoral,
    tags: ["Year 7", "Transition"],
    body: [
      p(
        "We were delighted to welcome 112 new pupils to Year 7 this week. Their first day began with team challenges on the field, a tour led by Year 12 mentors and a picnic lunch with their form tutors.",
      ),
      p(
        "Each new pupil has been paired with a Year 12 peer mentor who will meet them every week during the autumn term. Mentors help with everything from finding classrooms to joining clubs.",
      ),
      callout(
        "Settling-in evening",
        "Parents and carers of Year 7 pupils are invited to meet form tutors on Thursday 17 September at 6 pm in the Main Hall.",
      ),
    ],
  },
  {
    slug: "science-centre-wins-design-award",
    title: "Science & Innovation Centre wins regional design award",
    excerpt:
      "The building was praised for its energy-efficient design and flexible laboratories that put practical science first.",
    category: "school-life",
    publishedAt: "2026-09-10T11:00:00Z",
    image: image("Science and Innovation Centre", "The Science and Innovation Centre at dusk"),
    author: science,
    tags: ["Campus", "Science"],
    body: [
      p(
        "Our Science & Innovation Centre, which opened in 2021, has won the education category of this year's regional architecture awards.",
      ),
      h("What the judges said"),
      quote(
        "A building that has clearly been designed with teachers and pupils, not just for them. Every space invites practical, hands-on learning.",
        "Judging panel",
      ),
      h("Built to be sustainable"),
      list(
        "Solar panels provide around 40% of the building's electricity",
        "Rainwater is collected for the rooftop garden",
        "Natural ventilation keeps the laboratories cool without air conditioning",
      ),
      figure(
        "Robotics workshop",
        "Pupils working in the robotics workshop",
        "The robotics workshop is used by the STEM Academy four afternoons a week.",
      ),
      p("Pupils will lead tours of the building at our Open Morning on 17 October."),
    ],
  },
  {
    slug: "pupils-raise-funds-for-local-food-bank",
    title: "Pupils raise £8,400 for the Greenfield Food Bank",
    excerpt:
      "A sponsored walk, bake sales and a staff-versus-pupils netball match raised a record sum for a local charity.",
    category: "community",
    publishedAt: "2026-09-18T15:30:00Z",
    image: image("Charity sponsored walk", "Pupils and staff on the charity sponsored walk"),
    author: pastoral,
    tags: ["Charity", "Community"],
    body: [
      p(
        "Our pupil charity committee chose the Greenfield Food Bank as this term's charity, and the whole school responded. A ten-kilometre sponsored walk, weekly bake sales and a very competitive staff-versus-pupils netball match raised £8,400.",
      ),
      p(
        "Members of the committee presented the cheque to the food bank's volunteers on Friday and spent the afternoon helping to sort donations.",
      ),
      quote("Your support means we can keep our shelves full right through the winter.", "Greenfield Food Bank"),
      callout(
        "Harvest collection",
        "Our Harvest Festival collection on 9 October will also go to the food bank. Tinned food, pasta and toiletries are especially welcome.",
      ),
    ],
  },
  {
    slug: "under-15-footballers-reach-county-cup-final",
    title: "Under-15 footballers reach the County Cup final",
    excerpt: "A 3-1 semi-final win against St Albans School sets up a final on 21 October at Riverside Sports Ground.",
    category: "sports",
    publishedAt: "2026-09-29T17:00:00Z",
    image: image("Under-15 football team", "The under-15 football team celebrating a goal"),
    author: sport,
    tags: ["Football", "Fixtures"],
    body: [
      p(
        "Our under-15 footballers produced a superb second-half performance to beat St Albans School 3-1 in the County Cup semi-final, after going a goal down in the first ten minutes.",
      ),
      p(
        "Goals from Kai Mensah, Leo Hart and captain Sam O'Neill set up the school's first County Cup final in ten years.",
      ),
      callout(
        "Come and support the team",
        "The final is on Wednesday 21 October at 3.30 pm at Riverside Sports Ground. A coach will leave school at 2.45 pm for supporters.",
      ),
    ],
  },
  {
    slug: "autumn-concert-season-opens",
    title: "Autumn concert season opens to a full house",
    excerpt:
      "The Senior Orchestra and Chamber Choir opened the season with Dvořák and Vaughan Williams in the Greenfield Theatre.",
    category: "arts",
    publishedAt: "2026-10-01T20:30:00Z",
    image: image("Senior Orchestra", "The Senior Orchestra performing on stage"),
    author: music,
    tags: ["Music", "Concerts"],
    body: [
      p(
        "The autumn concert season opened on Thursday with a sold-out evening in the Greenfield Theatre. The Senior Orchestra performed the first movement of Dvořák's New World Symphony, and the Chamber Choir sang Vaughan Williams' Five Mystical Songs.",
      ),
      p(
        "Year 13 cellist Anna Kowalski gave a moving performance of Fauré's Élégie, accompanied by Year 11 pianist Rohan Desai.",
      ),
      h("Coming up"),
      list(
        "Autumn Orchestra Concert, 12 November",
        "Carol Service at St Mary's Church, 16 December",
        "Spring Musical: The Wizard of Oz, 25 March",
      ),
    ],
  },
  {
    slug: "robotics-team-qualifies-for-national-final",
    title: "Robotics team qualifies for the national final",
    excerpt: "Our STEM Academy team's autonomous rover finished second out of 40 schools in the regional round.",
    category: "academics",
    publishedAt: "2026-06-25T12:00:00Z",
    image: image("Robotics competition", "Pupils adjusting their robot at the competition"),
    author: science,
    tags: ["STEM", "Robotics", "Competitions"],
    body: [
      p(
        "A team of five Year 10 pupils from our STEM Academy finished second in the regional round of the national schools robotics challenge, beating 38 other schools.",
      ),
      h("The challenge"),
      p(
        "Teams had to design an autonomous rover able to map an unfamiliar course, collect samples and return to base within six minutes. Our team's rover, nicknamed Meadowlark, completed the course in four minutes and twelve seconds.",
      ),
      h("The engineering"),
      p(
        "The team programmed the rover in Python and built a custom sensor arm using the workshop's 3D printers. They spent more than 80 hours on the project, including several Saturday sessions.",
      ),
      h("What's next"),
      p("The national final takes place in Birmingham in July. We wish the team the very best of luck."),
    ],
  },
  {
    slug: "summer-production-a-midsummer-nights-dream",
    title: "A Midsummer Night's Dream delights summer audiences",
    excerpt: "More than 60 pupils from Years 7 to 13 brought Shakespeare's comedy to life in an open-air production.",
    category: "arts",
    publishedAt: "2026-07-02T21:00:00Z",
    image: image("Summer production", "Pupils performing A Midsummer Night's Dream outdoors"),
    author: office,
    tags: ["Drama", "Shakespeare"],
    body: [
      p(
        "Over three warm evenings, more than 600 people watched our open-air production of A Midsummer Night's Dream on the lawn in front of the library.",
      ),
      p(
        "The cast of more than 60 pupils was supported by a backstage crew who built the set, rigged the lighting and made over 80 costumes.",
      ),
      quote("Funny, magical and beautifully spoken. A real triumph.", "A parent in the audience"),
    ],
  },
  {
    slug: "eco-club-rooftop-garden-first-harvest",
    title: "Eco-Club's rooftop garden harvests its first crop",
    excerpt: "Tomatoes, beans and herbs grown on the science block roof are now on the menu in the school dining hall.",
    category: "community",
    publishedAt: "2026-07-08T13:00:00Z",
    image: image("Rooftop garden", "Eco-Club members harvesting vegetables on the roof"),
    author: office,
    tags: ["Eco-Club", "Sustainability"],
    body: [
      p(
        "Members of the Eco-Club have harvested the first crop from the rooftop garden they planted in March: 14 kilograms of tomatoes, runner beans, courgettes and herbs.",
      ),
      p(
        "The produce has been used by the catering team in the dining hall, and the club is now planning a winter crop of salad leaves and garlic.",
      ),
    ],
  },
  {
    slug: "sixth-formers-win-summer-research-placements",
    title: "Eight Sixth Formers win summer research placements",
    excerpt:
      "Students will spend part of the summer working alongside scientists and historians at three universities.",
    category: "achievements",
    publishedAt: "2026-04-30T10:00:00Z",
    image: image("Research placement", "A student working in a university laboratory"),
    author: sixthForm,
    tags: ["Sixth Form", "Universities", "Research"],
    body: [
      p(
        "Eight Year 12 students have won competitive places on university summer research programmes, in fields from neuroscience to medieval history.",
      ),
      list(
        "Three students will join a neuroscience laboratory at a London university",
        "Two will work on a coastal erosion project with geographers in the south-west",
        "Three will catalogue medieval manuscripts with a university library",
      ),
      p("The students will present their research to Year 11 and Year 12 in the autumn term."),
    ],
  },
  {
    slug: "year-9-historians-visit-western-front",
    title: "Year 9 historians walk the Western Front",
    excerpt:
      "Ninety pupils visited the battlefields and memorials of Belgium and northern France on a moving three-day trip.",
    category: "academics",
    publishedAt: "2026-05-14T16:00:00Z",
    image: image("Battlefields trip", "Year 9 pupils at a memorial in Belgium"),
    author: humanities,
    tags: ["History", "Trips", "Year 9"],
    body: [
      p(
        "Ninety Year 9 pupils travelled to Belgium and northern France for our annual battlefields trip, visiting Ypres, the Somme and the Thiepval Memorial.",
      ),
      p(
        "Before the trip, pupils researched former pupils of local schools who served in the First World War. At the Menin Gate, three pupils laid a wreath on behalf of the school.",
      ),
      quote(
        "Seeing the names on the memorials made the history we study feel real. I will never forget it.",
        "A Year 9 pupil",
      ),
    ],
  },
  {
    slug: "forest-school-week",
    title: "Primary pupils go wild for Forest School week",
    excerpt: "Pupils from Nursery to Year 2 spent a whole week learning outdoors in the school woodland.",
    category: "school-life",
    publishedAt: "2026-05-21T13:30:00Z",
    image: image("Forest School week", "Young pupils building a shelter in the woods"),
    author: office,
    tags: ["Primary", "Forest School"],
    body: [
      p(
        "For one week in May, our youngest pupils swapped their classrooms for the woodland. They built shelters, cooked bread on a campfire, went on bug hunts and wrote stories inspired by the trees.",
      ),
      callout(
        "Wellies, please",
        "Forest School continues every week in all weathers. Please make sure your child has wellington boots and a waterproof coat at school.",
      ),
    ],
  },
  {
    slug: "swimmers-make-a-splash-at-regional-championships",
    title: "Swimmers make a splash at the regional championships",
    excerpt: "Greenfield swimmers won six medals, including gold in the under-14 girls' 4 x 50 m relay.",
    category: "sports",
    publishedAt: "2026-03-19T18:00:00Z",
    image: image("Swimming championships", "A Greenfield swimmer racing in the regional championships"),
    author: sport,
    tags: ["Swimming", "Competitions"],
    body: [
      p(
        "Fourteen pupils represented Greenfield at the regional schools swimming championships, winning two gold, one silver and three bronze medals.",
      ),
      p(
        "The under-14 girls' relay team of Maya Collins, Ruby Ahmed, Isla Grant and Zara Nowak set a new school record on their way to gold.",
      ),
    ],
  },
  {
    slug: "spanish-exchange-students-visit-from-salamanca",
    title: "Exchange students visit from Salamanca",
    excerpt: "Twenty pupils from our partner school in Spain spent a week living with Greenfield families.",
    category: "community",
    publishedAt: "2026-03-26T12:00:00Z",
    image: image("Spanish exchange", "Spanish and Greenfield pupils together on a trip"),
    author: office,
    tags: ["Languages", "Exchanges"],
    body: [
      p(
        "Twenty pupils from our partner school in Salamanca spent a week with Greenfield families, joining lessons, visiting London and cooking a Spanish lunch for their hosts.",
      ),
      p("Our Year 10 Spanish students will make the return visit in October."),
    ],
  },
  {
    slug: "new-head-students-appointed",
    title: "New Head Girl and Head Boy appointed",
    excerpt: "Priya Nair and Tom Okafor will lead the student leadership team for the coming year.",
    category: "school-life",
    publishedAt: "2026-06-12T09:00:00Z",
    image: image("Head students", "The new Head Girl and Head Boy outside the library"),
    author: head,
    tags: ["Student leadership", "Sixth Form"],
    body: [
      p(
        "After a rigorous application process, including speeches to the whole Sixth Form, Priya Nair and Tom Okafor have been appointed Head Girl and Head Boy for the coming year.",
      ),
      p(
        "They will lead a team of twelve prefects, represent pupils on the school council and host visitors at events throughout the year.",
      ),
      quote(
        "We want every pupil to feel that their voice is heard and that Greenfield is their school.",
        "Priya Nair, Head Girl",
      ),
    ],
  },
];
