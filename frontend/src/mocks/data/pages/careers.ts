import type { CareersPage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

export const careersPage: CareersPage = {
  intro: {
    eyebrow: "Work With Us",
    title: "Join a team that loves what it does",
    paragraphs: [
      "Our 220 teachers and support staff are the reason Greenfield is a happy, high-achieving school. We look for people who are excellent at what they do and who care about young people.",
      "In return we offer small classes, generous training budgets, a beautiful place to work and colleagues who support each other.",
    ],
    image: placeholderImage(900, 650, "Staff team", "Teachers chatting in the staff common room"),
  },
  benefits: [
    {
      icon: "mortarboard",
      title: "Professional Growth",
      text: "A personal training budget, funded master's study and a structured early-career programme.",
    },
    {
      icon: "cash-stack",
      title: "Pay and Pension",
      text: "Salaries above the national scales and the Teachers' Pension Scheme or a 10% employer pension.",
    },
    {
      icon: "backpack",
      title: "Fee Remission",
      text: "50% off school fees for the children of all permanent staff.",
    },
    {
      icon: "heart-pulse",
      title: "Wellbeing",
      text: "Free lunches, use of the gym and pool, and a confidential employee assistance service.",
    },
  ],
  process: [
    {
      title: "Apply",
      text: "Download the application pack and email the completed form by the closing date.",
    },
    {
      title: "Shortlisting",
      text: "We contact shortlisted candidates within a week of the closing date and take up references.",
    },
    {
      title: "Interview Day",
      text: "Teachers teach a short lesson; every candidate meets pupils and has a formal interview.",
    },
    {
      title: "Offer and Checks",
      text: "Offers are subject to an enhanced DBS check, references and proof of the right to work in the UK.",
    },
  ],
  safeguarding:
    "Greenfield Academy is committed to safeguarding and promoting the welfare of children and expects all staff and volunteers to share this commitment. All posts are subject to safer recruitment checks, including an enhanced DBS check, two references and online searches for shortlisted candidates. We are an equal opportunities employer and welcome applications from all sections of the community.",
};
