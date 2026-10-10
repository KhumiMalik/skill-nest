import type { AboutPage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

export const aboutPage: AboutPage = {
  history: {
    title: "Educating young people since 1974",
    paragraphs: [
      "Greenfield Academy was founded in 1974 by a group of local parents and teachers who wanted a school that combined academic rigour with genuine care for each child. It opened with 64 pupils in a converted farmhouse on Meadow Lane.",
      "Five decades later, the farmhouse is our library and the school has grown into a thriving community of more than 1,200 pupils aged 3 to 18. Our founders' belief that every child deserves to be known, challenged and supported still shapes everything we do.",
    ],
    stats: [
      { value: 50, suffix: "+", label: "Years" },
      { value: 9, suffix: "k", label: "Alumni" },
      { value: 96, suffix: "%", label: "University offers" },
    ],
    image: placeholderImage(
      900,
      700,
      "The original farmhouse",
      "The original Meadow Lane farmhouse, now the school library",
    ),
  },
  mission:
    "To provide an outstanding all-round education that helps every child become a curious learner, a kind friend and a responsible citizen. We set high expectations, teach with passion and give every pupil the support they need to meet them.",
  vision:
    "To be a school where every pupil leaves knowing their strengths and values, equipped with the knowledge, skills and character to make a positive difference in a fast-changing world.",
  values: [
    {
      icon: "lightbulb",
      title: "Curiosity",
      text: "We ask questions, explore ideas and enjoy learning for its own sake.",
    },
    {
      icon: "heart",
      title: "Respect",
      text: "We treat everyone with kindness and value the differences that make our community rich.",
    },
    {
      icon: "shield-check",
      title: "Resilience",
      text: "We embrace challenges, learn from our mistakes and keep going when things get hard.",
    },
    {
      icon: "globe",
      title: "Service",
      text: "We use our talents to help others, in school, in our community and beyond.",
    },
  ],
  milestones: {
    title: "Our journey",
    text: "From a farmhouse with 64 pupils to a thriving school for ages 3 to 18, these are some of the moments that shaped Greenfield.",
    entries: [
      {
        year: 1974,
        title: "Greenfield Academy opens",
        text: "64 pupils and six teachers begin lessons in the converted Meadow Lane farmhouse.",
      },
      {
        year: 1988,
        title: "Sixth Form established",
        text: "The first A Level students graduate two years later, with places at universities across the UK.",
      },
      {
        year: 1999,
        title: "Arts Centre and theatre open",
        text: "A 300-seat theatre, a music school and art studios give the creative arts a permanent home.",
      },
      {
        year: 2012,
        title: "Early Years department founded",
        text: "Nursery and Reception classes open, making Greenfield a school for ages 3 to 18.",
      },
      {
        year: 2021,
        title: "Science & Innovation Centre",
        text: "Eight new laboratories, a robotics workshop and a rooftop weather station open.",
      },
      {
        year: 2024,
        title: "Fiftieth anniversary",
        text: "Pupils, staff and alumni celebrate five decades with a festival on the school field.",
      },
    ],
  },
  headMessage: {
    title: "A message from the Head",
    paragraphs: [
      "Thank you for your interest in Greenfield Academy. Every day I am struck by the energy and kindness of our pupils, and by the dedication of the staff who teach and care for them.",
      "We believe a great education is about more than examination results, important as they are. It is about helping each child find what they love, giving them the confidence to take risks, and teaching them to look after one another.",
      "The best way to understand Greenfield is to see it for yourself. I warmly invite you to visit us, meet our pupils and teachers, and discover what makes this school such a special place to learn and grow.",
    ],
    name: "Dr Eleanor Whitfield",
    role: "Head of School",
    photo: placeholderImage(600, 700, "Dr Eleanor Whitfield", "Dr Eleanor Whitfield, Head of School"),
  },
};
