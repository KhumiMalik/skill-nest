import type { CampusPage } from "@/features/page-content";
import { placeholderImage } from "../../utils";

const slide = (label: string, alt: string) => placeholderImage(1000, 650, label, alt);

export const campusPage: CampusPage = {
  intro: {
    eyebrow: "Our Campus",
    title: "Forty acres of space to learn, play and grow",
    paragraphs: [
      "Greenfield sits on a leafy forty-acre site on the edge of town, with the original 1920s house at its heart and modern teaching buildings around it.",
      "Recent investment includes the Science & Innovation Centre, opened in 2025, and a refurbished Performing Arts Centre with a 400-seat theatre.",
    ],
    stats: [
      { value: 40, label: "Acres" },
      { value: 12, label: "Buildings" },
      { value: 14, label: "Science labs" },
    ],
  },
  facilityGroups: [
    {
      id: "academic",
      label: "Academic",
      images: [
        slide("Science Centre", "The atrium of the Science & Innovation Centre"),
        slide("Library", "Pupils reading in the library"),
        slide("Computing suite", "Pupils programming robots in the computing suite"),
      ],
      facilities: [
        {
          icon: "flask",
          title: "Science & Innovation Centre",
          text: "Fourteen laboratories, a robotics workshop and a rooftop observatory.",
        },
        {
          icon: "book",
          title: "Library",
          text: "Over 25,000 books, quiet study rooms and a dedicated Sixth Form research area.",
        },
      ],
    },
    {
      id: "arts",
      label: "Arts",
      images: [
        slide("Theatre", "The 400-seat theatre in the Performing Arts Centre"),
        slide("Art studios", "Pupils painting in the art studio"),
      ],
      facilities: [
        {
          icon: "music-note-beamed",
          title: "Performing Arts Centre",
          text: "A 400-seat theatre, a recording studio and twelve music practice rooms.",
        },
        {
          icon: "palette",
          title: "Art & Design Studios",
          text: "Painting, ceramics with two kilns, photography darkroom and a design workshop.",
        },
      ],
    },
    {
      id: "sport",
      label: "Sport",
      images: [
        slide("Sports centre", "The sports hall set up for a basketball match"),
        slide("Swimming pool", "Pupils racing in the 25-metre swimming pool"),
        slide("Playing fields", "A hockey match on the all-weather pitch"),
      ],
      facilities: [
        {
          icon: "trophy",
          title: "Sports Centre",
          text: "A four-court sports hall, fitness suite, dance studio and climbing wall.",
        },
        {
          icon: "water",
          title: "Swimming Pool",
          text: "A six-lane, 25-metre pool used by every year group and the swim squad.",
        },
      ],
    },
    {
      id: "services",
      label: "Pupil Services",
      images: [
        slide("Dining hall", "Pupils eating lunch in the dining hall"),
        slide("Medical centre", "The school nurse's room in the medical centre"),
      ],
      facilities: [
        {
          icon: "cup-hot",
          title: "Dining Hall",
          text: "Freshly cooked meals every day, with vegetarian, vegan and allergy-safe options.",
        },
        {
          icon: "heart-pulse",
          title: "Medical Centre",
          text: "Two qualified nurses on site throughout the school day.",
        },
      ],
    },
  ],
  map: {
    title: "Campus Map",
    text: "The main entrance and visitor parking are on Meadow Lane. Please sign in at Reception when you arrive.",
    image: placeholderImage(1200, 800, "Campus site plan", "Site plan of the campus showing the numbered buildings"),
    key: [
      { name: "Main House", text: "Reception, Head's office, admissions" },
      { name: "Science & Innovation Centre", text: "Laboratories and observatory" },
      { name: "Library", text: "Open 8:00 am to 6:00 pm" },
      { name: "Performing Arts Centre", text: "Theatre and music school" },
      { name: "Sports Centre and Pool", text: "Changing rooms on the ground floor" },
      { name: "Junior School", text: "Nursery to Year 6" },
      { name: "Visitor parking", text: "Off Meadow Lane, 40 spaces" },
    ],
  },
  galleryAlbum: "campus-and-grounds",
};
