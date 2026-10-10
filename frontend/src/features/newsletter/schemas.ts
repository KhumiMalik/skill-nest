import { z } from "zod";
import { emailAddressSchema } from "@/lib/api/schemas";

/** Body of POST /newsletter-subscriptions. */
export const newsletterSubscriptionSchema = z.object({ email: emailAddressSchema });
