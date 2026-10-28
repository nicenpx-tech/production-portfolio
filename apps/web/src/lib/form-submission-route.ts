import { type NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { postToBackend } from "@/lib/backend-client";
import type {
  FormFailureKind,
  FormFieldError,
  FormSubmissionResponse,
} from "@/types/form-submission";

/**
 * BFF route factory for form submissions.
 *
 * Server-only: the browser posts to the route, the route validates the
 * payload again, forwards it to the Go backend, and answers with the shared
 * submission contract (AGENTS.md §9, §24, §46).
 */

export interface FormSubmissionRouteOptions<Output, Input = Output> {
  /** Schema that validates the incoming payload on the server. */
  schema: z.ZodType<Output, Input>;
  /** Backend path the validated payload is forwarded to. */
  backendPath: string;
}

/** Message used when the payload does not satisfy the schema. */
const VALIDATION_MESSAGE =
  "Please correct the highlighted fields and try again.";

/**
 * Maps schema issues onto field errors.
 *
 * An issue without a path belongs to the payload as a whole; it is reported
 * through the root error instead of a field.
 */
function toFieldErrors(issues: readonly z.core.$ZodIssue[]): FormFieldError[] {
  const fieldErrors: FormFieldError[] = [];

  for (const issue of issues) {
    const field = issue.path.join(".");
    if (!field) {
      continue;
    }

    fieldErrors.push({ field, message: issue.message });
  }

  return fieldErrors;
}

/**
 * createFormSubmissionRoute - Builds the POST handler of one form route.
 *
 * Client-side validation is UX only, so the payload is validated again here
 * before it reaches the backend. The session cookie travels with the request
 * so the backend can authenticate the call without the browser ever seeing a
 * backend credential.
 */
export function createFormSubmissionRoute<Output, Input = Output>(
  options: FormSubmissionRouteOptions<Output, Input>,
) {
  return async function POST(
    request: NextRequest,
  ): Promise<NextResponse<FormSubmissionResponse<Output>>> {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return NextResponse.json<FormSubmissionResponse<Output>>(
        {
          success: false,
          error: {
            kind: "validation",
            message: "The request body must be valid JSON.",
            code: "INVALID_JSON",
          },
        },
        { status: 400 },
      );
    }

    const parsed = options.schema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json<FormSubmissionResponse<Output>>(
        {
          success: false,
          error: {
            kind: "validation",
            message: VALIDATION_MESSAGE,
            fieldErrors: toFieldErrors(parsed.error.issues),
          },
        },
        { status: 400 },
      );
    }

    const headers: Record<string, string> = {};
    const cookie = request.headers.get("cookie");
    if (cookie) {
      headers.cookie = cookie;
    }

    const response = await postToBackend<Output>(
      options.backendPath,
      parsed.data,
      {
        headers,
      },
    );

    return NextResponse.json<FormSubmissionResponse<Output>>(response, {
      status: response.success ? 200 : statusForFailure(response.error.kind),
    });
  };
}

/**
 * Picks the HTTP status that matches a failure kind.
 *
 * The status describes the outcome for HTTP clients; the failure kind stays
 * the source of truth for the UI.
 */
function statusForFailure(kind: FormFailureKind): number {
  switch (kind) {
    case "validation":
      return 400;
    case "auth":
      return 401;
    case "network":
      return 502;
    case "business":
      return 422;
    default:
      return 500;
  }
}
