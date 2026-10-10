/**
 * A fixed-window rate limiter kept in memory: at most `limit` hits per key in `windowMs`.
 *
 * Good enough for a single server. With several instances (or serverless), each has its own
 * memory, so the real limit is `limit x instances`; move this to a shared store (e.g. Redis) or
 * rely on the backend's 429 responses then.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return {
    /** Records a hit for `key` and returns false if the key is over its limit. */
    allow(key: string, now: number): boolean {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      // Drop keys that have gone quiet, so the map can't grow forever.
      if (hits.size > 10_000) {
        for (const [otherKey, times] of hits) {
          if (times.every((time) => now - time >= windowMs)) hits.delete(otherKey);
        }
      }
      return true;
    },
  };
}
