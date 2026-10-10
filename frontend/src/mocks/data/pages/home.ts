import type { HomePage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

export const homePage: HomePage = {
  hero: {
    title: "Where curious minds grow into confident young people",
    lead: "An independent day school for ages 3 to 18, combining academic ambition with care, creativity and a strong sense of community.",
    // Same solid dark grey as the template's hero placeholder (text colour = background, so no label shows).
    image: placeholderImage(1920, 1080, "Hero", "Pupils walking across the school field on a sunny morning", {
      background: "6b6f6c",
      text: "6b6f6c",
    }),
  },
  highlights: [
    { value: 96, suffix: "%", label: "First-choice university places", icon: "trophy" },
    { value: 11, suffix: ":1", label: "Pupil-to-teacher ratio", icon: "mortarboard" },
    { value: 85, suffix: "+", label: "Clubs and activities", icon: "people" },
    { value: 12, label: "Partner schools worldwide", icon: "globe" },
  ],
  welcome: {
    title: "A school with a proud tradition,",
    titleHighlight: "and its eyes on the future",
    lead: "Since 1974, Greenfield Academy has helped children discover what they love and gain the discipline to pursue it. Small classes, inspiring teachers and a broad curriculum give every pupil room to shine.",
    stats: [
      { value: 50, suffix: "+", label: "Years" },
      { value: 1240, label: "Pupils" },
      { value: 118, label: "Teachers" },
    ],
    images: [
      placeholderImage(700, 470, "Main school building", "The main school building and front lawn"),
      placeholderImage(700, 470, "Year 5 classroom", "A Year 5 class working on a group project"),
    ],
    signature: { name: "Dr Eleanor Whitfield", role: "Head of School" },
  },
  pillars: [
    {
      icon: "rocket-takeoff",
      title: "Our Mission",
      text: "To provide an outstanding all-round education that helps every child become a curious learner, a kind friend and a responsible citizen.",
    },
    {
      icon: "eye",
      title: "Our Vision",
      text: "A school where every pupil leaves knowing their strengths, ready to make a positive difference in a fast-changing world.",
    },
    {
      icon: "star",
      title: "Our Values",
      text: "Curiosity, respect, resilience and service guide everything we do, from the classroom to the sports field and beyond.",
    },
  ],
  studentLife: {
    feature: {
      title: "Life beyond the classroom",
      image: placeholderImage(900, 1000, "Pupils rehearsing a play", "Pupils rehearsing a scene on the theatre stage"),
    },
    cards: [
      {
        icon: "people",
        title: "Clubs & Societies",
        text: "From robotics and debating to chess and gardening, there is a club for every interest, many of them run by pupils.",
      },
      {
        icon: "trophy",
        title: "Sport",
        text: "Football, netball, hockey, swimming and athletics, with fixtures every week and a team place for everyone who wants one.",
      },
      {
        icon: "music-note-beamed",
        title: "Music & Drama",
        text: "Three orchestras, four choirs and two major productions a year, staged in our 300-seat theatre.",
      },
      {
        icon: "globe-americas",
        title: "Trips & Exchanges",
        text: "Field trips, residential weeks and exchanges with our partner schools in France, Spain and Japan.",
      },
    ],
  },
  testimonials: [
    {
      quote:
        "My daughter started in Reception painfully shy. Six years on she reads in assemblies and leads the eco-club. Her teachers noticed her and gave her confidence.",
      name: "Priya Sharma",
      role: "Parent of a Year 6 pupil",
      photo: placeholderImage(400, 400, "Priya Sharma", "Priya Sharma"),
    },
    {
      quote:
        "The Sixth Form tutors helped me through every step of my medicine application, from work experience to mock interviews. I could not have done it without them.",
      name: "Daniel Okafor",
      role: "Class of 2025, now studying Medicine",
      photo: placeholderImage(400, 400, "Daniel Okafor", "Daniel Okafor"),
    },
    {
      quote:
        "What strikes me most as a governor is how well the staff know each child. The results are excellent, but it is the care behind them that makes Greenfield special.",
      name: "Margaret Ellis",
      role: "Chair of Governors",
      photo: placeholderImage(400, 400, "Margaret Ellis", "Margaret Ellis"),
    },
    {
      quote:
        "Our son is autistic and we worried about the move to secondary school. The learning support team planned every detail with us, and he has thrived.",
      name: "Tom and Rachel Burke",
      role: "Parents of a Year 8 pupil",
      photo: placeholderImage(400, 400, "Tom and Rachel Burke", "Tom and Rachel Burke"),
    },
    {
      quote:
        "I joined in Year 12 from overseas. Within weeks I was in the debating team and the orchestra. Greenfield felt like home far sooner than I expected.",
      name: "Mei Lin Zhou",
      role: "Year 13 pupil",
      photo: placeholderImage(400, 400, "Mei Lin Zhou", "Mei Lin Zhou"),
    },
    {
      quote:
        "The STEM Academy gave me my first taste of real engineering. The weather station we built is still running on the roof of the science block.",
      name: "Oliver Shaw",
      role: "Class of 2023, now studying Engineering",
      photo: placeholderImage(400, 400, "Oliver Shaw", "Oliver Shaw"),
    },
  ],
  achievements: {
    title: "Fifty years of learning, achievement and community",
    text: "Greenfield pupils consistently achieve results well above the national average. We measure success more broadly too: in the confidence, kindness and curiosity our pupils take with them when they leave.",
    stats: [
      { value: 98, suffix: "%", label: "GCSE grades 9-4", icon: "award" },
      { value: 11, suffix: ":1", label: "Pupil-teacher ratio", icon: "person-video3" },
      { value: 85, suffix: "+", label: "Clubs and activities", icon: "people-fill" },
      { value: 40, suffix: "+", label: "Bursaries each year", icon: "cash-stack" },
    ],
    links: [
      {
        title: "Campus & Facilities",
        text: "Science labs, a 300-seat theatre, a sports hall and 25 acres of grounds.",
        href: "/campus",
        image: placeholderImage(800, 500, "Science and Innovation Centre", "The Science and Innovation Centre"),
      },
      {
        title: "Student Life",
        text: "Clubs, sport, music and trips that build friendships and character.",
        href: "/student-life",
        image: placeholderImage(800, 500, "Pupils at a club", "Pupils building a robot in the robotics club"),
      },
      {
        title: "Alumni Network",
        text: "Over 9,000 former pupils who stay connected and give back.",
        href: "/alumni",
        image: placeholderImage(800, 500, "Alumni reunion", "Former pupils at the annual alumni reunion"),
      },
    ],
  },
};
