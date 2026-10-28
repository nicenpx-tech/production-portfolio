import type {
  FormSubmissionFailure,
  FormSubmissionResponse,
} from "@/types/form-submission";

/**
 * Base URL of the Go backend.
 *
 * Server-only: the browser never learns this address, it only talks to the
 * BFF (AGENTS.md §9, §76). Read per request so the environment stays the
 * single source of truth at call time.
 */
function backendBaseUrl(): string {
  return process.env.BACKEND_API_URL ?? "";
}

export interface BackendRequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/** Reads the JSON body, tolerating empty or non-JSON responses. */
async function readJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

/** Extracts a normalized failure from a backend error body. */
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

/** Maps a backend status onto the normalized failure union. */
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
        "The service is temporarily unavailable. Please try again later.",
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
 * postToBackend - Server-side call from the BFF to the Go backend.
 *
 * Lives on the server so backend addressing and any backend credentials stay
 * out of the browser bundle. The response is already in the shared
 * submission contract, so the route handler can forward it unchanged.
 */
export async function postToBackend<T>(
  path: string,
  payload: unknown,
  options: BackendRequestOptions = {},
): Promise<FormSubmissionResponse<T>> {
  const baseUrl = backendBaseUrl();

  if (!baseUrl) {
    return {
      success: false,
      error: {
        kind: "unknown",
        message: "The API service is not configured.",
        code: "BACKEND_NOT_CONFIGURED",
      },
    };
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(payload),
      signal: options.signal,
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      error: {
        kind: "network",
        message: "The API service could not be reached. Please try again.",
        code: "NETWORK_ERROR",
      },
    };
  }

  const body = await readJsonBody(response);

  if (!response.ok) {
    return { success: false, error: failureFromStatus(response.status, body) };
  }

  return { success: true, data: body as T };
}
