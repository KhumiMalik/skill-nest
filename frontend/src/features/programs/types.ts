import type { z } from "zod";
import type { programLevelSchema, programListQuerySchema, programSchema, programSummarySchema } from "./schemas";

export type ProgramLevel = z.infer<typeof programLevelSchema>;
export type ProgramSummary = z.infer<typeof programSummarySchema>;
export type Program = z.infer<typeof programSchema>;
export type ProgramListQuery = z.infer<typeof programListQuerySchema>;
