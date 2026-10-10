import type { StudentLifePage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

export const studentLifePage: StudentLifePage = {
  intro: {
    eyebrow: "Beyond the Classroom",
    title: "A full, busy and happy school day",
    paragraphs: [
      "Learning at Greenfield doesn't stop at the classroom door. Every pupil takes part in clubs, sport, music or service, and many discover a lifelong passion along the way.",
      "Our house system, school council and peer mentors give pupils a real voice and plenty of chances to lead.",
    ],
    stats: [
      { value: 85, suffix: "+", label: "Clubs" },
      { value: 32, label: "Sports teams" },
      { value: 4, label: "Houses" },
    ],
  },
  highlights: [
    {
      icon: "people",
      title: "Clubs & Societies",
      text: "From debating and Model UN to chess, coding and beekeeping, there's a club for every interest.",
    },
    {
      icon: "trophy",
      title: "Sport for All",
      text: "Competitive teams in twelve sports, plus yoga, climbing and dance for those who just want to play.",
    },
    {
      icon: "music-note-beamed",
      title: "Music & Drama",
      text: "Three orchestras, five choirs and two major productions every year.",
    },
    {
      icon: "heart",
      title: "Volunteering",
      text: "Pupils give over 4,000 hours a year to local charities, care homes and primary schools.",
    },
  ],
  activities: [
    {
      id: "clubs",
      label: "Clubs",
      title: "Clubs & Societies",
      text: "More than 85 clubs meet at lunchtime and after school, most of them suggested and run with pupils.",
      points: [
        "Robotics, coding and the electric car team",
        "Debating, Model UN and the school newspaper",
        "Chess, eco-club, beekeeping and gardening",
      ],
      image: placeholderImage(900, 600, "Clubs", "Pupils building a robot in the robotics club"),
    },
    {
      id: "arts",
      label: "Arts",
      title: "Music, Drama & Art",
      text: "Over half our pupils learn an instrument, and every year group performs on the main stage at least once a year.",
      points: [
        "Senior and junior orchestras, jazz band and five choirs",
        "A whole-school musical and a Senior School play each year",
        "Life drawing, ceramics and photography clubs",
      ],
      image: placeholderImage(900, 600, "Arts", "The school orchestra performing in the theatre"),
    },
    {
      id: "leadership",
      label: "Leadership",
      title: "Pupil Leadership",
      text: "Pupils lead from Year 5 onwards, and the Sixth Form runs much of school life.",
      points: [
        "Elected school council with its own budget",
        "Head Pupils, house captains and prefects",
        "Peer mentors trained to support younger pupils",
      ],
      image: placeholderImage(900, 600, "Leadership", "The school council meeting with the Head"),
    },
    {
      id: "service",
      label: "Service",
      title: "Service & Duke of Edinburgh",
      text: "Giving back is part of life at Greenfield, and nearly every Year 10 pupil completes Bronze DofE.",
      points: [
        "Weekly visits to Meadowbank care home",
        "Reading partners at two local primary schools",
        "Duke of Edinburgh's Award at Bronze, Silver and Gold",
      ],
      image: placeholderImage(900, 600, "Service", "Pupils planting trees with local volunteers"),
    },
  ],
  teams: [
    {
      name: "Rugby",
      text: "Teams from Under 11 to 1st XV, with a tour every two years.",
      image: placeholderImage(600, 400, "Rugby", "The 1st XV in a line-out"),
      honours: "2 county titles",
      members: 96,
    },
    {
      name: "Netball",
      text: "Eight teams playing in local and county leagues.",
      image: placeholderImage(600, 400, "Netball", "A netball player shooting at goal"),
      honours: "County champions 2026",
      members: 84,
    },
    {
      name: "Hockey",
      text: "Mixed and girls' teams training on our all-weather pitch.",
      image: placeholderImage(600, 400, "Hockey", "Two hockey players competing for the ball"),
      honours: "Regional finalists",
      members: 72,
    },
    {
      name: "Swimming",
      text: "Squad training before school three mornings a week.",
      image: placeholderImage(600, 400, "Swimming", "Swimmers diving in at the start of a race"),
      honours: "5 national qualifiers",
      members: 38,
    },
    {
      name: "Cricket",
      text: "Summer teams from Year 5 up, with nets open to everyone.",
      image: placeholderImage(600, 400, "Cricket", "A batter playing a shot on the cricket square"),
      honours: "Under 15 county cup",
      members: 60,
    },
  ],
  facilities: {
    title: "Spaces Made for Pupils",
    cards: [
      { icon: "cup-hot", title: "Dining Hall", text: "Hot breakfasts and lunches cooked on site every day." },
      { icon: "house", title: "Sixth Form Centre", text: "A common room, café and quiet study areas." },
      { icon: "book", title: "Study Lounges", text: "Supervised homework rooms open until 6:00 pm." },
      { icon: "bicycle", title: "Recreation", text: "Adventure playground, climbing wall and forest school." },
    ],
    photos: [
      {
        image: placeholderImage(1200, 900, "Dining hall", "Pupils eating lunch together in the dining hall"),
        title: "Dining Hall",
      },
      {
        image: placeholderImage(1200, 900, "Sixth Form Centre", "Students relaxing in the Sixth Form common room"),
        title: "Sixth Form Centre",
      },
      {
        image: placeholderImage(1200, 900, "Study lounge", "Pupils doing homework in a quiet study lounge"),
        title: "Study Lounge",
      },
      {
        image: placeholderImage(1200, 900, "Forest school", "Junior pupils building a shelter at forest school"),
        title: "Forest School",
      },
    ],
  },
  support: [
    {
      icon: "chat-heart",
      title: "Counselling",
      text: "A full-time school counsellor and a drop-in wellbeing room open every day.",
    },
    {
      icon: "briefcase",
      title: "Careers Guidance",
      text: "One-to-one advice from Year 9, work experience in Year 10 and university support in the Sixth Form.",
    },
    {
      icon: "heart-pulse",
      title: "Health Centre",
      text: "Two school nurses on site, and support for pupils with medical needs.",
    },
    {
      icon: "universal-access",
      title: "Learning Support",
      text: "Specialist teachers help pupils with dyslexia and other learning differences.",
    },
  ],
  cta: {
    title: "Have Questions?",
    text: "Our pastoral team is here for pupils and parents. Get in touch if you would like to talk about your child's wellbeing or interests.",
    link: { label: "Contact Pastoral Care", href: "/contact" },
  },
};
