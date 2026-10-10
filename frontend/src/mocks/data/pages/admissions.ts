import type { AdmissionsPage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

export const admissionsPage: AdmissionsPage = {
  intro: {
    eyebrow: "Join Us",
    title: "Admissions at Greenfield Academy",
    paragraphs: [
      "We welcome pupils from the age of three, with main entry points in Nursery, Reception, Year 3, Year 7 and Year 12. Places in other year groups open up throughout the year, so it is always worth asking.",
      "We look for curious children who will make the most of everything Greenfield offers. Our assessments help us understand how each child learns; they are not a test to pass or fail.",
    ],
    points: [
      "Small classes of up to 22 pupils (18 in the Early Years)",
      "Means-tested bursaries of up to 100% of fees",
      "Sibling discount of 5% for the second child and 10% for the third",
    ],
    image: placeholderImage(900, 650, "Admissions", "A family being shown around the school by a Sixth Former"),
  },
  steps: [
    {
      title: "Visit the School",
      text: "Come to an open morning or book a private tour to see lessons in action and meet the Head.",
    },
    {
      title: "Apply",
      text: "Send us the application form with a £100 registration fee and your child's latest school report.",
    },
    {
      title: "Assessment Day",
      text: "Your child spends a relaxed morning with us: short assessments, a group activity and an informal interview.",
    },
    {
      title: "Offer and Acceptance",
      text: "We write with our decision within two weeks. Secure the place by returning the acceptance form and deposit.",
    },
  ],
  requirements: [
    {
      icon: "file-earmark-text",
      title: "School Reports",
      text: "The two most recent reports from your child's current school, and any educational assessments.",
    },
    {
      icon: "envelope-paper",
      title: "Confidential Reference",
      text: "We ask your child's current Head for a reference once we receive the application.",
    },
    {
      icon: "pencil-square",
      title: "Entrance Assessment",
      text: "English and maths for entry from Year 3; a short online reasoning test for Year 7 and above.",
    },
    {
      icon: "clipboard-check",
      title: "Sixth Form Entry",
      text: "At least six GCSEs at grade 6 or above, with a 7 in the subjects you plan to take at A Level.",
    },
  ],
  deadlines: {
    title: "Key Dates for September 2027",
    entries: [
      { title: "Sixth Form applications", text: "Deadline for external Year 12 applicants.", date: "2026-11-13" },
      { title: "Year 7 applications", text: "Deadline for the main 11+ entry round.", date: "2026-12-04" },
      { title: "Year 7 assessment day", text: "Reasoning test, group activity and interviews.", date: "2027-01-16" },
      { title: "Offers sent", text: "Letters emailed to all Year 7 and Sixth Form applicants.", date: "2027-02-12" },
      { title: "Acceptance deadline", text: "Return the acceptance form and deposit.", date: "2027-03-05" },
    ],
  },
  fees: {
    title: "Fees for 2026-27",
    rows: [
      { stage: "Early Years", years: "Nursery and Reception", termFee: 4850 },
      { stage: "Primary", years: "Years 1 to 6", termFee: 5650 },
      { stage: "Secondary", years: "Years 7 to 11", termFee: 6950 },
      { stage: "Sixth Form", years: "Years 12 and 13", termFee: 7250 },
    ],
    notes: [
      "Fees include lunch, textbooks, most trips during the school day and the after-school clubs programme.",
      "Nursery places are also available for five mornings a week at £2,900 per term.",
      "Fees are payable termly in advance; a monthly payment plan is available.",
    ],
  },
  documents: [
    {
      title: "Application Form",
      description: "For entry in September 2027.",
      url: "/documents/admissions-application-form-2027.pdf",
      format: "PDF",
      sizeBytes: 796,
    },
    {
      title: "Fees and Charges 2026-27",
      description: "Fees, deposits, discounts and payment terms.",
      url: "/documents/fees-2026-27.pdf",
      format: "PDF",
      sizeBytes: 744,
    },
    {
      title: "Bursary Application Form",
      description: "Return it with your application.",
      url: "/documents/bursary-application-form.pdf",
      format: "PDF",
      sizeBytes: 744,
    },
    {
      title: "School Prospectus",
      url: "/documents/prospectus-2026-27.pdf",
      format: "PDF",
      sizeBytes: 770,
    },
  ],
  visit: {
    title: "Visit Our Campus",
    text: "The best way to get a feel for Greenfield is to see a normal school day. Private tours run every weekday at 9:30 am and 2:00 pm, led by our pupils.",
  },
  apply: {
    title: "Ready to Apply?",
    text: "Download the application form, or ask the admissions team for a paper copy. We are happy to help with any part of the process.",
    link: { label: "Download the Form", href: "/documents/admissions-application-form-2027.pdf" },
  },
};
