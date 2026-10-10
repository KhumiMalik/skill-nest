import type { AlumniPage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

export const alumniPage: AlumniPage = {
  intro: {
    eyebrow: "Alumni Network",
    title: "Once a Greenfielder, always a Greenfielder",
    paragraphs: [
      "More than 9,000 former pupils, in over 60 countries, belong to the Greenfield alumni community. Membership is free and lifelong.",
      "We keep you in touch with old friends and the school through reunions, regional groups and our twice-yearly magazine, The Greenfield Leaf.",
    ],
    stats: [
      { value: 9000, suffix: "+", label: "Alumni" },
      { value: 60, suffix: "+", label: "Countries" },
      { value: 12, label: "Regional groups" },
    ],
    image: placeholderImage(800, 650, "Alumni", "Former pupils at a reunion on the school field"),
  },
  connect: [
    {
      icon: "diagram-3",
      title: "Careers Network",
      text: "Offer work experience or talk to Sixth Formers about your career.",
      link: { label: "Careers evening", href: "/events/alumni-careers-evening-2026" },
    },
    {
      icon: "person-hearts",
      title: "Mentoring",
      text: "Support a Year 12 pupil hoping to follow in your footsteps.",
      link: { label: "Become a mentor", href: "mailto:alumni@greenfield-academy.example" },
    },
    {
      icon: "calendar-event",
      title: "Alumni Events",
      text: "Reunions, regional drinks and the annual Reunion Day in June.",
      link: { label: "See all events", href: "/events?category=alumni" },
    },
    {
      icon: "gift",
      title: "Give Back",
      text: "Help fund bursaries so more young people can come to Greenfield.",
      link: { label: "Ways to give", href: "mailto:development@greenfield-academy.example" },
    },
  ],
  spotlights: [
    {
      name: "Dr Priya Raman",
      classOf: 2004,
      role: "Paediatric surgeon",
      story:
        "Priya leads a children's surgical team in Manchester and returns every year to talk to aspiring medics. She credits her biology teacher for her first fascination with the human body.",
      photo: placeholderImage(400, 400, "Priya Raman", "Portrait of Dr Priya Raman"),
    },
    {
      name: "Tom Ashworth",
      classOf: 2011,
      role: "Founder, Brightwater Energy",
      story:
        "Tom started his first business in the school's young enterprise club. His renewable energy company now employs 120 people and offers placements to Greenfield Sixth Formers.",
      photo: placeholderImage(400, 400, "Tom Ashworth", "Portrait of Tom Ashworth"),
    },
    {
      name: "Grace Oyelaran",
      classOf: 2016,
      role: "Actor and playwright",
      story:
        "Grace played Lady Macbeth in her final school production. Her debut play opened in London last year, and she now runs drama workshops for our Year 9 pupils.",
      photo: placeholderImage(400, 400, "Grace Oyelaran", "Portrait of Grace Oyelaran"),
    },
  ],
  giving: {
    title: "Make a Lasting Impact",
    text: "Gifts from alumni fund bursaries for pupils whose families could not otherwise afford Greenfield. Last year, 46 pupils received help with their fees.",
    link: { label: "Contact the Development Office", href: "mailto:development@greenfield-academy.example" },
  },
};
