import { publicEnv } from "./public-env";

export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const siteConfig = {
  name: "Greenfield Academy",
  shortName: "Greenfield",
  description:
    "Greenfield Academy is an independent day school offering primary, secondary and sixth-form education with a focus on curiosity, character and community.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  locale: "en-GB",
  /** All dates and times on the site are shown in this IANA time zone. */
  timeZone: "UTC",
  foundedYear: 1974,
  contact: {
    addressLines: ["42 Meadow Lane", "Greenfield, GF1 2AB"],
    phone: "+44 20 7946 0321",
    email: "info@greenfield-academy.example",
    admissionsEmail: "admissions@greenfield-academy.example",
    hours: ["Mon - Fri: 8:00 am - 5:00 pm", "Sat: 9:00 am - 1:00 pm"],
    /** Map centre for the OpenStreetMap embed on the contact page. */
    map: { lat: 51.5072, lon: -0.1276 },
  },
  social: [
    { label: "X (Twitter)", href: "https://x.com/", icon: "twitter-x" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  ],
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Admissions", href: "/admissions" },
      { label: "Faculty & Staff", href: "/faculty" },
      { label: "Campus & Facilities", href: "/campus" },
    ],
  },
  { label: "Programs", href: "/programs" },
  { label: "Student Life", href: "/student-life" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Alumni", href: "/alumni" },
  {
    label: "More",
    children: [
      { label: "Notices", href: "/notices" },
      { label: "Gallery", href: "/gallery" },
      { label: "Careers", href: "/careers" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "School",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Faculty & Staff", href: "/faculty" },
      { label: "Campus & Facilities", href: "/campus" },
      { label: "Careers", href: "/careers" },
      { label: "Alumni", href: "/alumni" },
    ],
  },
  {
    title: "Learning",
    links: [
      { label: "Programs", href: "/programs" },
      { label: "Admissions", href: "/admissions" },
      { label: "Student Life", href: "/student-life" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Stay Informed",
    links: [
      { label: "News", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Notices", href: "/notices" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
