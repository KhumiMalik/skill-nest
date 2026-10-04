import type { z } from "zod";
import type { departmentSchema, facultyListQuerySchema, facultyMemberSchema, facultySummarySchema } from "./schemas";

export type Department = z.infer<typeof departmentSchema>;
export type FacultySummary = z.infer<typeof facultySummarySchema>;
export type FacultyMember = z.infer<typeof facultyMemberSchema>;
export type FacultyListQuery = z.infer<typeof facultyListQuerySchema>;
