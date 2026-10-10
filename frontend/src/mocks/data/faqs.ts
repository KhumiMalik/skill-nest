import type { Faq, FaqCategory } from "@/features/faq";

const categories = {
  admissions: { slug: "admissions", name: "Admissions" },
  fees: { slug: "fees", name: "Fees & Bursaries" },
  schoolDay: { slug: "school-day", name: "The School Day" },
  uniform: { slug: "uniform", name: "Uniform & Equipment" },
  transport: { slug: "transport", name: "Getting to School" },
  wellbeing: { slug: "wellbeing", name: "Wellbeing & Support" },
} satisfies Record<string, FaqCategory>;

/** In display order: categories in the order above, questions as the editors ordered them. */
export const faqs: Faq[] = [
  {
    id: "when-to-apply",
    question: "When should we apply?",
    answer: [
      "We recommend applying a year before your child would join. The deadlines for September 2027 entry are 13 November 2026 for the Sixth Form and 4 December 2026 for Year 7.",
      "For other year groups we accept applications all year round, depending on places.",
    ],
    category: categories.admissions,
  },
  {
    id: "entry-points",
    question: "In which year groups can my child join?",
    answer: [
      "The main entry points are Nursery, Reception, Year 3, Year 7 and Year 12, when we add extra classes. We also have occasional places in most other year groups.",
    ],
    category: categories.admissions,
  },
  {
    id: "assessment",
    question: "What does the entrance assessment involve?",
    answer: [
      "Younger children join a play-based session in class. From Year 3, children take short English and maths assessments; from Year 7, an online reasoning test, a group activity and a friendly interview.",
      "We want to see how your child thinks and learns, so there is no need for tutoring or special preparation.",
    ],
    category: categories.admissions,
  },
  {
    id: "send-support",
    question: "Can you support children with special educational needs?",
    answer: [
      "Yes. Our Learning Support team works with pupils with dyslexia, dyspraxia, ADHD and other learning differences. Please tell us about your child's needs when you apply, so we can make sure we can support them well.",
    ],
    category: categories.admissions,
  },
  {
    id: "visit",
    question: "Can we visit before applying?",
    answer: [
      "Of course. Come to one of our open mornings, or book a private tour on any weekday at 9:30 am or 2:00 pm through the admissions office.",
    ],
    category: categories.admissions,
  },
  {
    id: "what-fees-include",
    question: "What do the fees include?",
    answer: [
      "Fees include lunch, textbooks, most day trips, the after-school clubs programme and supervised homework until 6:00 pm. Extras are music lessons, residential trips and some exam entries.",
    ],
    category: categories.fees,
  },
  {
    id: "bursaries",
    question: "Do you offer bursaries?",
    answer: [
      "Yes. Means-tested bursaries cover up to 100% of fees, depending on family income and circumstances. Around one in eight pupils receives a bursary.",
      "Apply with the bursary form at the same time as your admissions application. All applications are treated in confidence.",
    ],
    category: categories.fees,
  },
  {
    id: "scholarships",
    question: "Are there scholarships?",
    answer: [
      "Academic, music, art and sports scholarships are available at Year 7 and Year 12. They come with a fee reduction of up to 10%, and can be combined with a bursary.",
    ],
    category: categories.fees,
  },
  {
    id: "payment-plans",
    question: "Can we pay fees monthly?",
    answer: [
      "Yes. Fees can be paid termly in advance or in ten monthly instalments by Direct Debit, at no extra cost.",
    ],
    category: categories.fees,
  },
  {
    id: "school-day-times",
    question: "What time does the school day start and finish?",
    answer: [
      "The gates open at 7:45 am, with free breakfast club from 7:30 am. Lessons run from 8:30 am to 3:30 pm for the Junior School and to 4:00 pm for the Senior School.",
      "Clubs and supervised homework run until 6:00 pm, Monday to Thursday.",
    ],
    category: categories.schoolDay,
  },
  {
    id: "lunch",
    question: "What do pupils eat at lunch?",
    answer: [
      "Our catering team cooks fresh meals every day, with a vegetarian option and a salad bar. We cater for allergies and medical diets; please give details to the school nurse.",
    ],
    category: categories.schoolDay,
  },
  {
    id: "homework",
    question: "How much homework is set?",
    answer: [
      "Homework builds up gradually: about 20 minutes a night in Year 3, around an hour in Year 7 and up to two hours a night for GCSE pupils. Junior School pupils focus on reading.",
    ],
    category: categories.schoolDay,
  },
  {
    id: "term-dates",
    question: "Where can I find the term dates?",
    answer: [
      "Term dates for this year and next are published on the Notices page, and families receive them in the start-of-year newsletter.",
    ],
    category: categories.schoolDay,
  },
  {
    id: "uniform-shop",
    question: "Where can we buy uniform?",
    answer: [
      "Uniform is sold online through our supplier and at the school shop, open on Wednesdays from 3:00 pm to 5:00 pm. The Parents' Association also runs a second-hand uniform sale each term.",
    ],
    category: categories.uniform,
  },
  {
    id: "devices",
    question: "Does my child need a laptop?",
    answer: [
      "From Year 7, pupils use a school-managed Chromebook, which the school provides for a termly charge on the fees bill. Junior pupils use the school's tablets and computers.",
    ],
    category: categories.uniform,
  },
  {
    id: "mobile-phones",
    question: "Are mobile phones allowed?",
    answer: [
      "Pupils in Years 7 to 11 may bring a phone for the journey, but it stays switched off in their locker during the school day. Sixth Formers may use phones in the Sixth Form Centre.",
    ],
    category: categories.uniform,
  },
  {
    id: "school-buses",
    question: "Is there a school bus?",
    answer: [
      "Yes. Six bus routes cover the surrounding towns and villages, morning and evening, with a late bus at 6:00 pm. Seats are booked termly through the school office.",
    ],
    category: categories.transport,
  },
  {
    id: "parking",
    question: "Where can parents park at drop-off?",
    answer: [
      "Please use the one-way drop-off loop off Meadow Lane, where staff help pupils out of cars from 7:45 am. Visitor parking is next to Main House.",
    ],
    category: categories.transport,
  },
  {
    id: "cycling",
    question: "Can pupils cycle to school?",
    answer: [
      "Pupils from Year 7 may cycle once they have completed the school's cycle safety course. There is covered, secure bike storage by the Sports Centre.",
    ],
    category: categories.transport,
  },
  {
    id: "pastoral-care",
    question: "Who looks after my child's wellbeing?",
    answer: [
      "Every pupil has a form tutor who sees them every day, supported by a Head of Year and the house staff. Our counsellor and two school nurses are on site throughout the school day.",
    ],
    category: categories.wellbeing,
  },
  {
    id: "bullying",
    question: "How does the school deal with bullying?",
    answer: [
      "We take any report of bullying seriously and act quickly. Pupils can speak to any member of staff, a peer mentor or use our anonymous online reporting form. Our anti-bullying policy is available from the school office.",
    ],
    category: categories.wellbeing,
  },
  {
    id: "settling-in",
    question: "How do you help new pupils settle in?",
    answer: [
      "New pupils come to a welcome day in the summer term and are given a buddy in their class. Tutors check in with every new family during the first half term.",
    ],
    category: categories.wellbeing,
  },
];
