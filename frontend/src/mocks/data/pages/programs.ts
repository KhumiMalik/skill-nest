import type { ProgramsPage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

export const programsPage: ProgramsPage = {
  intro: {
    eyebrow: "Academic Excellence",
    title: "A broad, ambitious curriculum from age 3 to 18",
    paragraphs: [
      "Our curriculum builds steadily from play-based learning in the Early Years to GCSEs, A Levels and university preparation in the Sixth Form.",
      "At every stage, small classes and specialist teaching help pupils master the fundamentals, think for themselves and discover their passions.",
    ],
  },
  stats: [
    { value: 13, label: "Programs and pathways" },
    { value: 118, label: "Specialist teachers" },
    { value: 11, suffix: ":1", label: "Pupil-teacher ratio" },
    { value: 96, suffix: "%", label: "First-choice university places" },
  ],
  spotlight: {
    programSlug: "a-level-programme",
    eyebrow: "Featured Program",
    title: "A Level Programme",
    text: "Our Sixth Form offers 26 A Level subjects taught in small groups, with a dedicated tutor for every student, an Extended Project option and expert guidance on university and career applications.",
    image: placeholderImage(800, 700, "Sixth Form study centre", "Sixth Form students studying in the library"),
    facts: [
      { label: "Duration", value: "2 years" },
      { label: "Subjects", value: "26" },
      { label: "A*-B grades", value: "78%" },
    ],
  },
};
