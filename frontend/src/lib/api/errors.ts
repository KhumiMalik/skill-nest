import type { z } from "zod";
import type { ApiErrorBody } from "./schemas";

/** Error thrown by the API layer for any non-2xx response (real or mocked). */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  get fieldErrors(): Record<string, string[]> {
    return this.body.errors ?? {};
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNotFound(error: unknown): boolean {
  return isApiError(error) && error.status === 404;
}

/** Builds the 422 error the backend returns for invalid input, from a Zod error. */
export function validationError(error: z.ZodError, message = "The given data was invalid."): ApiError {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_form";
    (errors[key] ??= []).push(issue.message);
  }
  return new ApiError(422, { message, errors });
}
