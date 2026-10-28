# Series 3.6.6 — Implementation Checklist

## A. Repository Inspection

- [x] Read root `AGENTS.md` (§88–§91 and the BFF rules)
- [x] Inspect `apps/web/src/shared/forms/useZodForm.ts`
- [x] Inspect `packages/ui/src/components/forms/*`
- [x] Inspect `apps/web/src/features/profile/**`
- [x] Inspect the existing tests and the vitest setup
- [x] Inspect `apps/api` — confirmed to be an empty placeholder

---

## B. Submission Contract

- [x] One contract file owned by the app (`types/form-submission.ts`)
- [x] `FormFieldError` — field path plus user-facing message
- [x] `FormFailureKind` — validation, business, auth, network, unknown
- [x] `FormSubmissionFailure` — the normalized failure
- [x] `FormSubmissionResponse` — the wire body of a BFF route
- [x] `FormSubmissionResult` — what the form layer consumes
- [x] Submitted values and server response typed separately
- [x] No backend error format leaks into the UI

---

## C. BFF Boundary

- [x] Browser calls the BFF, never the Go backend
- [x] `lib/api-client.ts` used by browser code
- [x] `lib/backend-client.ts` used by the BFF, server side only
- [x] `BACKEND_API_URL` never reaches the browser bundle
- [x] No client component imports a route handler or server module
- [x] One route per form, built by `createFormSubmissionRoute`
- [x] Session cookie forwarded from the BFF to the Go API

---

## D. Server Validation

- [x] Payload validated again on the server
- [x] The payload schema is the canonical contract
- [x] The form schema reuses the payload rules, differing in input type only
- [x] Rejected payload answers 400 with one field error per field
- [x] Malformed body answered with 400 and `INVALID_JSON`
- [x] Backend status translated into a failure kind and an HTTP status

---

## E. Error Mapping

- [x] `submitWithFeedback` turns a normalized result into RHF errors
- [x] Validation failure → one field error per field, plus the root error
- [x] Business, auth, network, unknown → the root error only
- [x] Field errors render through `FormMessage`
- [x] The root error renders through `FormRootError`
- [x] An unknown field path is ignored
- [x] The form is never reset and field values never change
- [x] A thrown error is treated as a network failure

---

## F. Submission State

- [x] `isSubmitting` comes from React Hook Form, no local loading state
- [x] The submit button is disabled while a submission is in flight
- [x] A duplicate submission cannot start from the UI
- [x] The success callback is awaited before the handler resolves
- [x] The success confirmation checks `isSubmitSuccessful` and the absence of
      a root error

---

## G. Failure Recovery

- [x] A new attempt starts from a clean slate
- [x] A stale message cannot survive a successful resubmission
- [x] The form stays filled after a failure
- [x] Recovery is resubmission, not a reset

---

## H. Accessibility

- [x] Field errors keep their `role="alert"` announcement
- [x] The root error keeps its `role="alert"` announcement
- [x] The form-level orientation line never duplicates a server error
- [x] Labels, descriptions, and `aria-invalid` stay intact

---

## I. Testing

- [x] Unit tests for the handler (`lib/form-submission-handler.test.ts`)
- [x] Unit tests for the client (`lib/api-client.test.ts`)
- [x] Integration tests for the route (`app/api/profile/route.test.ts`)
- [x] Integration tests for the form (`features/profile/ProfileForm.test.tsx`)
- [x] The 13 component tests of Series 3.6.4 preserved
- [x] Assertions describe requests, messages, and field state
- [x] No test reaches a private helper

---

## J. Documentation

- [x] `AGENTS.md` §92–§99
- [x] `TASK.md`, `CHECKLIST.md`, `README.md`, `FINAL-REPORT.md` in this folder

---

## K. Verification

- [x] `bun run typecheck`
- [x] `bun run lint`
- [x] `bun run test` — 64 tests
- [x] `bun run build`
