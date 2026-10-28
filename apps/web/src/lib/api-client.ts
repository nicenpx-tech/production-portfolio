import type {
  FormSubmissionFailure,
  FormSubmissionResponse,
  FormSubmissionResult,
} from "@/types/form-submission";

/**
 * Root path of the Next.js BFF routes.
 *
 * The browser only ever calls the BFF, never the Go backend directly
 * (AGENTS.md §9).
 */
const BFF_BASE_PATH = "/api";

export interface SubmissionRequestOptions {
  /** Extra headers, e.g. a locale or CSRF token. */
  headers?: Record<string, string>;
  /** Lets the caller cancel an in-flight submission. */
  signal?: AbortSignal;
}

/** Message shown when the request never reached the BFF. */
const NETWORK_ERROR_MESSAGE =
  "Network error. Please check your connection and try again.";

/**
 * Reads the JSON body, tolerating empty or non-JSON responses.
 *
 * A failing endpoint may answer with an HTML error page; that must not
 * crash the form, so the body is treated as optional.
 */
async function readJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/**
 * Extracts the normalized failure from a BFF error body.
 */
function extractFailure(body: unknown): FormSubmissionFailure | undefined {
  if (!body || typeof body !== "object" || !("error" in body)) {
    return undefined;
  }

  const error = body.error;
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const candidate = error as Partial<FormSubmissionFailure>;
  if (typeof candidate.message !== "string") {
    return undefined;
  }

  return {
    kind: candidate.kind ?? "unknown",
    message: candidate.message,
    fieldErrors: candidate.fieldErrors,
    code: candidate.code,
  };
}

/**
 * Maps an HTTP status onto the normalized failure union.
 *
 * Status codes describe the transport, not the domain, so this is where a
 * status becomes a failure kind the UI can act on.
 */
function failureFromStatus(
  status: number,
  body: unknown,
): FormSubmissionFailure {
  const failure = extractFailure(body);

  if (status === 400 || status === 422) {
    if (failure?.fieldErrors?.length) {
      return {
        kind: "validation",
        message: failure.message,
        fieldErrors: failure.fieldErrors,
        code: failure.code,
      };
    }

    return {
      kind: "business",
      message: failure?.message ?? "The submission was rejected.",
      code: failure?.code,
    };
  }

  if (status === 401 || status === 403) {
    return {
      kind: "auth",
      message:
        failure?.message ??
        "Your session is no longer valid. Please sign in and try again.",
      code: failure?.code ?? (status === 401 ? "UNAUTHORIZED" : "FORBIDDEN"),
    };
  }

  if (status >= 500) {
    return {
      kind: "unknown",
      message:
        failure?.message ??
        "Something went wrong on our side. Please try again later.",
      code: failure?.code ?? "INTERNAL_ERROR",
    };
  }

  return {
    kind: "business",
    message: failure?.message ?? "The submission was rejected.",
    code: failure?.code,
  };
}

/**
 * postFormSubmission - Sends a form payload to the BFF.
 *
 * The result is always a normalized success or failure: transport problems,
 * unexpected payloads, and rejected payloads all arrive as
 * `{ ok: false, failure }`, so the caller never inspects status codes.
 */
export async function postFormSubmission<T>(
  path: string,
  payload: unknown,
  options: SubmissionRequestOptions = {},
): Promise<FormSubmissionResult<T>> {
  let response: Response;

  try {
    response = await fetch(`${BFF_BASE_PATH}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(payload),
      signal: options.signal,
    });
  } catch {
    return {
      ok: false,
      failure: {
        kind: "network",
        message: NETWORK_ERROR_MESSAGE,
        code: "NETWORK_ERROR",
      },
    };
  }

  const body = await readJsonBody(response);

  if (!response.ok) {
    return { ok: false, failure: failureFromStatus(response.status, body) };
  }

  if (body && typeof body === "object" && "success" in body) {
    const parsed = body as FormSubmissionResponse<T>;
    if (parsed.success) {
      return { ok: true, data: parsed.data };
    }

    return { ok: false, failure: parsed.error };
  }

  // A 2xx without the documented envelope is a contract violation upstream.
  return {
    ok: false,
    failure: {
      kind: "unknown",
      message: "The server returned an unexpected response.",
      code: "INVALID_RESPONSE",
    },
  };
}
