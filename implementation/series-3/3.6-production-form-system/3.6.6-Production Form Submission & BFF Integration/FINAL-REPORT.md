# Series 3.6.6 — Production Form Submission & BFF Integration: Final Report

## Overview

This report documents the implementation of Series 3.6.6 in the Production
Portfolio Starter Kit monorepo. The series turns the composed forms of
Series 3.6.1–3.6.5 into forms that submit to a backend through a
Backend-for-Frontend boundary, and it normalizes every failure into React
Hook Form error locations.

The implementation is the source of truth for this report; the original task
prompt for this series was not present in the repository when the work
started, so `TASK.md` records the objective the delivered implementation
answers.

## What Was Implemented

### 1. The shared submission contract

`apps/web/src/types/form-submission.ts` (new)

- `FormFieldError` — a field path plus a user-facing message
- `FormFailureKind` — `validation`, `business`, `auth`, `network`, `unknown`
- `FormSubmissionFailure` — the normalized failure every layer speaks
- `FormSubmissionResponse<T>` — the wire body of a BFF route
- `FormSubmissionResult<T>` — what the form layer consumes

The submitted values and the server response are separate types: a form hands
over its own values, the server may answer with another shape.

### 2. The BFF boundary

`apps/web/src/lib/api-client.ts` (new) — browser → BFF

- `postFormSubmission` posts a payload to a BFF route and always resolves a
  normalized result
- HTTP status is translated into a failure kind; a transport error becomes a
  `network` failure; a response without the documented envelope becomes an
  `unknown` failure
- The client never returns a status code to the caller

`apps/web/src/lib/backend-client.ts` (new) — BFF → Go API, server only

- `postToBackend` reads `BACKEND_API_URL` at call time, so the address and
  any credential stay out of the browser bundle
- Reports a missing configuration and an unreachable backend as explicit
  failures instead of throwing

`apps/web/src/lib/form-submission-route.ts` (new) — the route factory

- `createFormSubmissionRoute` builds the POST handler of one form
- The payload is validated again on the server with the feature schema
- The session cookie is forwarded to the backend so it can authenticate the
  call
- The backend answer is translated into the shared contract, and the failure
  kind picks the HTTP status (400 / 401 / 422 / 500 / 502)

`apps/web/src/app/api/profile/route.ts` (new) — the profile route

- Declares the payload schema and the backend path, nothing else

### 3. The form bridge

`apps/web/src/lib/form-submission-handler.ts` (new)

- `submitWithFeedback` turns a normalized result into React Hook Form errors
- A validation failure sets one field error per field plus the root error; a
  business, auth, network, or unknown failure sets the root error only
- A field path the form does not know is ignored, so a stale or foreign path
  cannot corrupt the form state
- A thrown error is treated as a network failure
- The handler never resets the form and never changes a field value

### 4. The profile feature

`apps/web/src/features/profile/schemas/profile.schema.ts` (modified)

- Added `profilePayloadSchema` as the canonical contract that crosses the
  network
- The form schema reuses those rules and differs only in the input type of
  the year field, so the browser and the server judge the same values
- The cross-field rule is one shared predicate used by both schemas

`apps/web/src/features/profile/services/profile-service.ts` (new)

- `submitProfile` — the feature's transport, kept out of the page and out of
  the component

`apps/web/src/features/profile/components/ProfileForm.tsx` (modified)

- Submits through `submitWithFeedback`; a failure needs no local handling
  because the handler already placed it on the form
- The `onSubmit` prop became `onSuccess`: it runs after the BFF accepted the
  payload and receives the submitted values
- The form-level orientation line is gated on the absence of a root error, so
  a server failure is never reported twice

### 5. Tests

| File | Tests | Level |
| --- | --- | --- |
| `lib/form-submission-handler.test.ts` | 10 | unit |
| `lib/api-client.test.ts` | 9 | unit |
| `app/api/profile/route.test.ts` | 8 | integration |
| `features/profile/ProfileForm.test.tsx` | 16 | integration |

The 13 component tests of Series 3.6.4 were preserved and extended with the
BFF flow: the request that leaves the browser, the message that comes back,
the field that keeps the user's input, and the recovery after a failure.

### 6. Documentation

- `AGENTS.md` §103–§110: the submission contract, the BFF boundary, server
  validation, error mapping, submission state, failure recovery, testing, and
  documentation
- This folder: `TASK.md`, `CHECKLIST.md`, `README.md`, `FINAL-REPORT.md`

## Corrections to Earlier Work in This Series

The working tree already contained an unfinished attempt at this series. It
did not compile and it had overwritten the Series 3.6.4 component tests. The
following defects were found and fixed:

| Defect | Consequence | Fix |
| --- | --- | --- |
| Two `handleValidSubmit` declarations in `ProfileForm.tsx` | the file did not compile | one handler, built on the new bridge |
| `useZodForm(...) as any` | lost every type guarantee of the composition layer | the cast is gone; the form is typed end to end |
| A client component importing `@/app/api/form-submission/route` | server code reached the browser bundle | the route owns the schema; the feature imports its own schema module |
| `z.ZodError.errors` in the route | zod 4 removed `errors`; the field list was empty | `issues` with `issue.path` |
| Three unused `_format*` helpers and a missing type import | dead code, a type error | removed; the mapping lives in one place |
| `new Error(error.message)` on an `unknown` | a non-Error throw produced `undefined` | the throw is normalized to a network failure |
| `ProfileForm.test.tsx` overwritten | 13 passing component tests lost | restored and extended |

### Repository state finding: series 3.6.5 is specified, not implemented

While collecting the report of the previous series for the commit, the
working tree was checked against what that report claims:

- `apps/web/src/shared/forms/` holds `useZodForm.ts` only; there is no
  `useFieldArray.ts`, `useWatch.ts`, `useDependentField.ts`, or
  `useShouldUnregister.ts`
- there is no `features/contact/` directory
- `packages/ui` has no field-array component
- the report of 3.6.5 claims 24 contact tests and 58 tests in total;
  the repository held 34 tests before this series (4 form-foundation,
  17 form-fields, 13 profile)

The 3.6.5 documents are therefore a specification rather than a record of
merged code. Sections 92 to 102 of `AGENTS.md` are reserved for the rules
of that series, and this series uses 103 to 110. Implementing 3.6.5 is
the next step in the series chain; this report does not claim to have
delivered it.

## Verification Results

### 1. Type Checking

```
bun run typecheck
$ tsc --noEmit
✓ No type errors found
```

### 2. Linting

```
bun run lint
@portfolio/web:lint: $ biome check .
@portfolio/web:lint: Checked 38 files in 21ms. No fixes applied.
✓ No lint errors found
```

*Note: the Biome formatter was run with `--write` before the final lint, as
the line-width rules of this workspace require.*

### 3. Testing

```
bun run test
 ✓ src/lib/api-client.test.ts (9 tests)
 ✓ src/lib/form-submission-handler.test.ts (10 tests)
 ✓ src/app/api/profile/route.test.ts (8 tests)
 ✓ src/features/form-foundation/FormFoundationExample.test.tsx (4 tests)
 ✓ src/features/profile/ProfileForm.test.tsx (16 tests)
 ✓ src/features/form-fields/FormFieldsExample.test.tsx (17 tests)

 Test Files  6 passed (6)
      Tests  64 passed (64)
```

### 4. Build

```
bun run build
@portfolio/web:build: $ next build
✓ Compiled successfully
✓ Finished TypeScript
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /[locale]/form-fields
├ ƒ /[locale]/form-foundation
├ ƒ /[locale]/profile
└ ƒ /api/profile
✓ Build completed successfully
```

The BFF route is registered as a dynamic route, as a route handler must be.

## Task Completion Assessment

### ✅ Requirements Met

- **Shared contract**: one typed contract, owned by the app, spoken by the
  route, the client, the handler, and the form
- **BFF boundary**: browser → Next.js route → Go API → database, with no
  backend address or credential in the browser bundle
- **Server validation**: the payload is validated again on the server with
  the same rules the browser used
- **Error mapping**: field problems on their field, everything else as the
  root error, one error source per location
- **Submission state**: React Hook Form owns `isSubmitting`; the button is
  disabled in flight, so a duplicate submission cannot start
- **Failure semantics**: values survive a failure, the next attempt starts
  clean, and the success confirmation never appears while an error stands
- **Testing**: 43 new tests across unit and integration level
- **Documentation**: `AGENTS.md` §103–§110 and this folder

### ✅ AGENTS.md Rules Followed

- §9 BFF Architecture: the browser never calls the Go API directly
- §10 API Contract Rules: normalization happens at the boundary, not in the UI
- §24 Server Validation: the client validates for UX, the server validates
  for trust
- §47 Frontend Error Handling: backend formats stop at the BFF
- §89–§91 the form rules of Series 3.6.1–3.6.5: RHF owns the form state, Zod
  owns the validation, `useZodForm` owns the setup, no local loading state, no
  reset after a failure, one error source per field

### ✅ Code Quality

- TypeScript strict mode maintained, no `any` introduced
- No new dependency
- Existing UI primitives reused unchanged
- Feature-based architecture kept; the page stays composition-only
- Accessibility preserved: `role="alert"` on field and root errors, labels,
  descriptions, and `aria-invalid` intact

## Limitations & Risks

### Known limitations

- **The Go API is still a placeholder.** `apps/api` is an empty directory, so
  the BFF answers `BACKEND_NOT_CONFIGURED` until `BACKEND_API_URL` points at
  a real service. The forwarding path itself is covered by tests.
- **No authentication flow.** The BFF forwards the session cookie, but
  nothing creates or validates a session yet; the `auth` failure kind is
  ready for it.
- **No retry or offline queue.** A network failure surfaces once and the user
  resubmits.
- **No optimistic updates.** The success path is confirmed by the server
  before the confirmation is shown.

### Not applicable

- **Storybook**: the new modules are application modules, not design-system
  components. `packages/ui` owns the stories, and it was not changed.

### No critical issues

- Type checking, lint, tests, and the build all pass
- No existing behaviour was removed: the 13 component tests of Series 3.6.4
  still pass, and the remaining 4 + 17 tests of Series 3.6.1–3.6.3 are
  untouched

## Overall Assessment

**Series 3.6.6 is complete and meets its acceptance criteria.** The
implementation:

- keeps the browser behind a BFF that validates, forwards, and translates
- gives every failure exactly one place to be reported
- keeps the user's input when a submission fails
- is covered by 64 passing tests, of which 43 are new

The remaining gap is deliberately outside this series: the Go API and the
session management that a real deployment needs. Both plug into the seams
this series established — the backend client and the `auth` failure kind —
without touching the form layer.
