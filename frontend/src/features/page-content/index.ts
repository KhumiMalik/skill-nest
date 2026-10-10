// Public API of the page-content feature: editable copy for the mostly-static pages.
export { AchievementsSection } from "./components/AchievementsSection";
export { HeadMessageSection, HistorySection } from "./components/AboutSections";
export { AdmissionsContact, AdmissionsOverview, FeesSection } from "./components/AdmissionsSections";
export { AlumniEventsSection, AlumniIntro, AlumniSpotlights } from "./components/AlumniSections";
export { CampusFacilities, CampusMap } from "./components/CampusSections";
export { CareersIntro, RecruitmentSection } from "./components/CareersSections";
export { HomeHero } from "./components/HomeHero";
export { LegalContent } from "./components/LegalContent";
export { ProgramSpotlight, ProgramsIntro } from "./components/ProgramsPageSections";
export { StudentLifeSection } from "./components/StudentLifeSection";
export {
  ActivitiesSection,
  StudentFacilitiesSection,
  StudentLifeIntro,
  SupportSection,
  TeamsSection,
} from "./components/StudentLifePageSections";
export { TestimonialsSection } from "./components/TestimonialsSection";
export { WelcomeSection } from "./components/WelcomeSection";
export {
  getAboutPage,
  getAdmissionsPage,
  getAlumniPage,
  getCampusPage,
  getCareersPage,
  getHomePage,
  getLegalPage,
  getProgramsPage,
  getStudentLifePage,
} from "./data";
export type * from "./types";
