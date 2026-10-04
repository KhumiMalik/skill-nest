// Public API of the faculty feature. Other code imports from "@/features/faculty" only.
export { DepartmentsSection } from "./components/DepartmentsSection";
export { FacultyDirectory } from "./components/FacultyDirectory";
export { FacultyDirectorySkeleton } from "./components/FacultyDirectorySkeleton";
export { FacultyProfile } from "./components/FacultyProfile";
export { StaffIndex } from "./components/StaffIndex";
export { TeamSection } from "./components/TeamSection";
export { FACULTY_PAGE_SIZE, getDepartments, getFaculty, getFacultyMember } from "./data";
export { type FacultyFilters, facultyHref, parseFacultyFilters } from "./filters";
export { LEADERSHIP_DEPARTMENT } from "./schemas";
export type * from "./types";
