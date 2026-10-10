import { z } from "zod";
import { emailAddressSchema, messageSchema, personNameSchema, phoneNumberSchema } from "@/lib/api/schemas";
import { CONTACT_TOPICS } from "./constants";

export { CONTACT_TOPIC_LABELS, CONTACT_TOPICS } from "./constants";

/** Body of POST /contact-messages. */
export const contactMessageSchema = z.object({
  name: personNameSchema,
  email: emailAddressSchema,
  phone: phoneNumberSchema.optional(),
  topic: z.enum(CONTACT_TOPICS, { error: "Choose what your message is about." }),
  message: messageSchema(3000, "Enter your message."),
});
