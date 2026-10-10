import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";
import { checkSpam } from "./spam";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
}

describe("checkSpam", () => {
  const now = 1_000_000;

  it("flags a filled honeypot as a bot", () => {
    expect(checkSpam(form({ website: "https://spam.example" }), { now, minFillMs: 2000 })).toBe("bot");
  });

  it("flags forms sent sooner than the minimum fill time", () => {
    expect(checkSpam(form({ form_started_at: String(now - 500) }), { now, minFillMs: 2000 })).toBe("too-fast");
    expect(checkSpam(form({ form_started_at: String(now - 5000) }), { now, minFillMs: 2000 })).toBe("ok");
  });

  it("skips the time check without JavaScript (no start time)", () => {
    expect(checkSpam(form({ website: "" }), { now, minFillMs: 2000 })).toBe("ok");
  });
});

describe("createRateLimiter", () => {
  it("allows `limit` hits per window and key", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.allow("contact:1.2.3.4", 0)).toBe(true);
    expect(limiter.allow("contact:1.2.3.4", 10)).toBe(true);
    expect(limiter.allow("contact:1.2.3.4", 20)).toBe(false);
    // Other visitors and other forms have their own budget.
    expect(limiter.allow("contact:5.6.7.8", 20)).toBe(true);
    expect(limiter.allow("newsletter:1.2.3.4", 20)).toBe(true);
    // Hits older than the window no longer count.
    expect(limiter.allow("contact:1.2.3.4", 1011)).toBe(true);
  });
});
