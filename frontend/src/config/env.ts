import "server-only";
import { z } from "zod";

/**
 * Server-only environment variables, validated once at startup.
 * Never import this file from a Client Component: `server-only` makes that a build error.
 * Public values (NEXT_PUBLIC_*) live in `public-env.ts`.
 */
const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    /** Base URL of the Node/Python REST API. Leave unset to use the mock API in `src/mocks`. */
    API_BASE_URL: z.url().optional(),
    /** Shared secret the backend sends to POST /api/revalidate. */
    REVALIDATE_SECRET: z.string().min(32).optional(),
    /** Artificial latency for the mock API so loading states are visible in development. */
    MOCK_API_DELAY_MS: z.coerce.number().int().min(0).max(5000).optional(),
    /** Form submissions allowed per visitor (IP address) and form in 10 minutes. */
    FORM_RATE_LIMIT: z.coerce.number().int().min(1).default(5),
    /** Forms sent faster than this after the page loaded are treated as bots (asked to send again). */
    FORM_MIN_FILL_MS: z.coerce.number().int().min(0).default(2000),
    /** "false" on staging and previews: robots.txt then asks search engines not to crawl the site. */
    ALLOW_INDEXING: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && env.API_BASE_URL && !env.REVALIDATE_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["REVALIDATE_SECRET"],
        message: "REVALIDATE_SECRET is required in production when API_BASE_URL is set.",
      });
    }
  });

function parseServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid server environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const serverEnv = parseServerEnv();
