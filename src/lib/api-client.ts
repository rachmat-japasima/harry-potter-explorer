/**
 * Minimal API client for the Harry Potter API.
 * Feature-specific logic lives in src/features/<feature>/api.ts.
 */

const DEFAULT_API_URL = "https://hp-api.onrender.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;

/**
 * Application-level API error.
 * The Harry Potter API returns non-JSON error bodies (e.g. plain text
 * "Sorry can't find that!" with status 404), so the message carries the
 * body text when available.
 */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * GET a JSON endpoint under the API base URL.
 * Throws ApiError on network failure, non-2xx response, or invalid JSON.
 */
export async function getJSON(path: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    // The hosted API instance sleeps when idle; first request after a cold
    // start can fail or take tens of seconds.
    throw new ApiError(
      "Could not reach the Harry Potter API. It may be starting up — try again in a moment."
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.text();
      if (body) message = body.trim();
    } catch {
      // keep the default message
    }
    throw new ApiError(message, response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("Received a response that was not valid JSON.");
  }
}
