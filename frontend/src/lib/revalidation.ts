import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { validationError } from "./api/errors";

/** Body of POST /api/revalidate: the cache tags to refresh, e.g. ["news", "news:sports-day-2026"]. */
export const revalidateBodySchema = z.object({
  tags: z
    .array(
      z
        .string()
        .max(256, "Tags are at most 256 characters.")
        .regex(/^[a-z0-9][a-z0-9:-]*$/, 'Tags look like "news" or "news:sports-day-2026".'),
    )
    .min(1, "Send at least one tag.")
    .max(100, "Send at most 100 tags at once."),
});

/**
 * Compares the token with the secret in constant time, so response times don't reveal how many
 * characters were right. Hashing first makes both values the same length, as timingSafeEqual requires.
 */
function isValidToken(token: string, secret: string): boolean {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(token), hash(secret));
}

type RevalidateOptions = {
  /** REVALIDATE_SECRET; undefined when the webhook isn't configured. */
  secret: string | undefined;
  /** Expires one cache tag (revalidateTag in the route; a spy in tests). */
  revalidate: (tag: string) => void;
};

/**
 * The revalidation webhook the backend calls when content changes (see docs/api-contract.md):
 *   POST /api/revalidate, Authorization: Bearer {REVALIDATE_SECRET}, body { "tags": [...] }
 * Errors use the same JSON shape as the API: { message, errors? }.
 */
export async function handleRevalidateRequest(request: Request, options: RevalidateOptions): Promise<Response> {
  if (!options.secret) {
    return Response.json({ message: "Revalidation is not configured on this server." }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token || !isValidToken(token, options.secret)) {
    return Response.json(
      { message: "Missing or invalid token." },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
    );
  }

  const json: unknown = await request.json().catch(() => undefined);
  const parsed = revalidateBodySchema.safeParse(json);
  if (!parsed.success) {
    const { body } = validationError(parsed.error);
    return Response.json(body, { status: 422 });
  }

  const tags = [...new Set(parsed.data.tags)];
  for (const tag of tags) options.revalidate(tag);
  return Response.json({ revalidated: tags, now: new Date().toISOString() });
}
