import { z } from "zod";
import { emailAddressSchema, messageSchema, personNameSchema, phoneNumberSchema } from "@/lib/api/schemas";
import { START_OPTIONS, YEAR_GROUPS } from "./constants";

export { START_OPTION_LABELS, START_OPTIONS, YEAR_GROUP_LABELS, YEAR_GROUPS } from "./constants";

/** Body of POST /admission-enquiries. */
export const admissionEnquirySchema = z.object({
  parentName: personNameSchema,
  email: emailAddressSchema,
  phone: phoneNumberSchema.optional(),
  childName: z.string().trim().min(2, "Enter your child's full name.").max(100, "Use 100 characters or fewer."),
  yearGroup: z.enum(YEAR_GROUPS, { error: "Choose the year group your child would join." }),
  start: z.enum(START_OPTIONS, { error: "Choose when your child would like to start." }),
  /** Post a printed prospectus. */
  prospectus: z.boolean(),
  /** Contact the family to arrange a visit. */
  visit: z.boolean(),
  message: messageSchema(2000).optional(),
});
