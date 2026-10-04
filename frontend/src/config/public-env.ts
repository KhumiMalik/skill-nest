import { z } from "zod";

/**
 * Public environment variables. These are inlined into the browser bundle at build time,
 * so each one must be read as a literal `process.env.NEXT_PUBLIC_*` expression.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

const result = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!result.success) {
  throw new Error(`Invalid public environment variables:\n${z.prettifyError(result.error)}`);
}

export const publicEnv = result.data;
