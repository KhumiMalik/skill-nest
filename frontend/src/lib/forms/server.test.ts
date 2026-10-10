import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { readValues, submitForm } from "./server";

// Server actions read the visitor's IP from the request headers.
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }) }));

const schema = z.object({ email: z.email("Enter a valid email address.") });

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
}

/** Each test uses its own form name, because the rate limiter keeps counting across tests. */
function submit(name: string, fields: Record<string, string>, send = vi.fn(async () => ({}))) {
  const formData = form(fields);
  const values = readValues(formData, ["email"]);
  return {
    send,
    result: submitForm({ form: name, formData, values, body: values, schema, send, successMessage: "Thanks!" }),
  };
}

afterEach(() => vi.restoreAllMocks());

describe("readValues", () => {
  it("trims the named text fields and ignores everything else", () => {
    expect(readValues(form({ email: "  a@b.co ", other: "x" }), ["email", "missing"])).toEqual({
      email: "a@b.co",
      missing: "",
    });
  });
});

describe("submitForm", () => {
  it("sends valid input and reports success", async () => {
    const { send, result } = submit("valid", { email: "parent@example.com" });
    expect(await result).toEqual({ status: "success", message: "Thanks!" });
    expect(send).toHaveBeenCalledWith({ email: "parent@example.com" });
  });

  it("returns field errors and keeps the typed values", async () => {
    const { send, result } = submit("invalid", { email: "not-an-email" });
    expect(await result).toEqual({
      status: "error",
      message: "Please correct the errors below.",
      errors: { email: ["Enter a valid email address."] },
      values: { email: "not-an-email" },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("pretends to succeed for bots that fill the honeypot, without sending", async () => {
    const { send, result } = submit("bot", { email: "bot@example.com", website: "https://spam.example" });
    expect((await result).status).toBe("success");
    expect(send).not.toHaveBeenCalled();
  });

  it("asks people who were too quick to send again", async () => {
    const { send, result } = submit("fast", { email: "a@example.com", form_started_at: String(Date.now()) });
    expect(await result).toMatchObject({ status: "error", message: expect.stringContaining("quick") });
    expect(send).not.toHaveBeenCalled();
  });

  it("shows the API's 422 field errors next to the fields, and whole-form errors as the message", async () => {
    const fieldError = vi.fn(async () => {
      throw new ApiError(422, { message: "Invalid.", errors: { email: ["Already registered."] } });
    });
    expect(await submit("api-field", { email: "a@example.com" }, fieldError).result).toMatchObject({
      message: "Please correct the errors below.",
      errors: { email: ["Already registered."] },
    });

    const formError = vi.fn(async () => {
      throw new ApiError(422, { message: "Closed.", errors: { _form: ["Booking has closed."] } });
    });
    expect(await submit("api-form", { email: "a@example.com" }, formError).result).toMatchObject({
      message: "Booking has closed.",
      errors: {},
    });
  });

  it("hides unexpected failures behind a friendly message and logs them", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const broken = vi.fn(async () => {
      throw new Error("connection refused");
    });
    expect(await submit("broken", { email: "a@example.com" }, broken).result).toMatchObject({
      status: "error",
      message: expect.stringContaining("something went wrong"),
      values: { email: "a@example.com" },
    });
    expect(log).toHaveBeenCalled();
  });

  it("limits each visitor to FORM_RATE_LIMIT (5) submissions per form in 10 minutes", async () => {
    for (let i = 0; i < 5; i++) {
      expect((await submit("limited", { email: "a@example.com" }).result).status).toBe("success");
    }
    const { send, result } = submit("limited", { email: "a@example.com" });
    expect(await result).toMatchObject({ status: "error", message: expect.stringContaining("several times") });
    expect(send).not.toHaveBeenCalled();
  });
});
