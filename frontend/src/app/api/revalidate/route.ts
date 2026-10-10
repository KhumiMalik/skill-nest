import { revalidateTag } from "next/cache";
import { serverEnv } from "@/config/env";
import { handleRevalidateRequest } from "@/lib/revalidation";

/**
 * Webhook for the backend: expires the given cache tags so the next visitor gets fresh content.
 * `expire: 0` means stale content is never served afterwards (updateTag is only for server actions).
 */
export async function POST(request: Request) {
  return handleRevalidateRequest(request, {
    secret: serverEnv.REVALIDATE_SECRET,
    revalidate: (tag) => revalidateTag(tag, { expire: 0 }),
  });
}
