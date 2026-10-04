import type { NewsSummary } from "@/features/news";
import { placeholderImage } from "../utils";

function author(name: string, role: string): NewsSummary["author"] {
  return { name, role, photo: placeholderImage(400, 400, name, "") };
}

const head = author("Dr Eleanor Whitfield", "Head of School");
const pastoral = author("Mrs Aisha Rahman", "Deputy Head (Pastoral)");
const sport = author("Mr Jack Harrison", "Director of Sport");
const music = author("Ms Olivia Grant", "Director of Music");
const science = author("Dr Amelia Hart", "Head of Science");
const sixthForm = author("Mr David Okonkwo", "Head of Sixth Form");
const office = author("Communications Office", "Greenfield Academy");

/** Unsorted on purpose: the handler sorts newest first, as the real API will. */
export const news: NewsSummary[] = [
  {
    slug: "year-11-celebrate-record-gcse-results",
    title: "Year 11 celebrate record GCSE results",
    excerpt: "98% of grades were 9 to 4 and more than half were 9 to 7, the best results in the school's history.",
    category: "achievements",
    publishedAt: "2026-08-20T10:00:00Z",
    image: placeholderImage(800, 460, "GCSE results day", "Year 11 pupils opening their GCSE results"),
    author: head,
  },
  {
    slug: "a-level-students-secure-university-places",
    title: "A Level students secure places at leading universities",
    excerpt: "78% of A Level grades were A* to B, and 96% of our leavers are heading to their first-choice university.",
    category: "achievements",
    publishedAt: "2026-08-13T09:30:00Z",
    image: placeholderImage(800, 460, "A Level results", "Sixth Form students celebrating their A Level results"),
    author: sixthForm,
  },
  {
    slug: "welcome-to-our-new-year-7-pupils",
    title: "A warm welcome to our new Year 7 pupils",
    excerpt:
      "112 pupils joined the Senior School this week, starting with a settling-in day of team challenges and a picnic.",
    category: "school-life",
    publishedAt: "2026-09-04T14:00:00Z",
    image: placeholderImage(800, 460, "Year 7 welcome day", "New Year 7 pupils taking part in a team challenge"),
    author: pastoral,
  },
  {
    slug: "science-centre-wins-design-award",
    title: "Science & Innovation Centre wins regional design award",
    excerpt:
      "The building was praised for its energy-efficient design and flexible laboratories that put practical science first.",
    category: "school-life",
    publishedAt: "2026-09-10T11:00:00Z",
    image: placeholderImage(800, 460, "Science and Innovation Centre", "The Science and Innovation Centre at dusk"),
    author: science,
  },
  {
    slug: "pupils-raise-funds-for-local-food-bank",
    title: "Pupils raise £8,400 for the Greenfield Food Bank",
    excerpt:
      "A sponsored walk, bake sales and a staff-versus-pupils netball match raised a record sum for a local charity.",
    category: "community",
    publishedAt: "2026-09-18T15:30:00Z",
    image: placeholderImage(800, 460, "Charity sponsored walk", "Pupils and staff on the charity sponsored walk"),
    author: pastoral,
  },
  {
    slug: "under-15-footballers-reach-county-cup-final",
    title: "Under-15 footballers reach the County Cup final",
    excerpt: "A 3-1 semi-final win against St Albans School sets up a final on 21 October at Riverside Sports Ground.",
    category: "sports",
    publishedAt: "2026-09-29T17:00:00Z",
    image: placeholderImage(800, 460, "Under-15 football team", "The under-15 football team celebrating a goal"),
    author: sport,
  },
  {
    slug: "autumn-concert-season-opens",
    title: "Autumn concert season opens to a full house",
    excerpt:
      "The Senior Orchestra and Chamber Choir opened the season with Dvořák and Vaughan Williams in the Greenfield Theatre.",
    category: "arts",
    publishedAt: "2026-10-01T20:30:00Z",
    image: placeholderImage(800, 460, "Senior Orchestra", "The Senior Orchestra performing on stage"),
    author: music,
  },
  {
    slug: "robotics-team-qualifies-for-national-final",
    title: "Robotics team qualifies for the national final",
    excerpt: "Our STEM Academy team's autonomous rover finished second out of 40 schools in the regional round.",
    category: "academics",
    publishedAt: "2026-06-25T12:00:00Z",
    image: placeholderImage(800, 460, "Robotics competition", "Pupils adjusting their robot at the competition"),
    author: science,
  },
  {
    slug: "summer-production-a-midsummer-nights-dream",
    title: "A Midsummer Night's Dream delights summer audiences",
    excerpt: "More than 60 pupils from Years 7 to 13 brought Shakespeare's comedy to life in an open-air production.",
    category: "arts",
    publishedAt: "2026-07-02T21:00:00Z",
    image: placeholderImage(800, 460, "Summer production", "Pupils performing A Midsummer Night's Dream outdoors"),
    author: office,
  },
  {
    slug: "eco-club-rooftop-garden-first-harvest",
    title: "Eco-Club's rooftop garden harvests its first crop",
    excerpt: "Tomatoes, beans and herbs grown on the science block roof are now on the menu in the school dining hall.",
    category: "community",
    publishedAt: "2026-07-08T13:00:00Z",
    image: placeholderImage(800, 460, "Rooftop garden", "Eco-Club members harvesting vegetables on the roof"),
    author: office,
  },
];
