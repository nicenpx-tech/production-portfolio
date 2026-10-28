/**
 * Form submission contract.
 *
 * The browser talks to the BFF with this shape, and the BFF translates it to
 * the backend contract. Every failure is normalized into one discriminated
 * union so the form layer never has to parse backend-specific error formats
 * (AGENTS.md §10, §47).
 */

/** A field-level failure reported by the server. */
export interface FormFieldError {
  /** Path of the offending field, e.g. "contactEmail" or "items.0.label". */
  field: string;
  /** Actionable, user-facing message. */
  message: string;
}

/**
 * Why a submission failed.
 *
 * - `validation`: field-level problems, mapped onto RHF field errors
 * - `business`: a domain rule rejected the payload, form-level error
 * - `auth`: the session is missing or lacks permission, form-level error
 * - `network`: the request never reached the server, form-level error
 * - `unknown`: anything else, form-level error
 */
export type FormFailureKind =
  | "validation"
  | "business"
  | "auth"
  | "network"
  | "unknown";

/** Normalized failure shared by the BFF response and the form layer. */
export interface FormSubmissionFailure {
  kind: FormFailureKind;
  /** User-facing message; never a raw stack trace or backend detail. */
  message: string;
  /** Present for validation failures only. */
  fieldErrors?: FormFieldError[];
  /** Backend error code, used for logging and branching. */
  code?: string;
}

/** Wire response body returned by a BFF form-submission route. */
export type FormSubmissionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: FormSubmissionFailure };

/** Result of a submission attempt as consumed by the form layer. */
export type FormSubmissionResult<T> =
  | { ok: true; data: T }
  | { ok: false; failure: FormSubmissionFailure };
