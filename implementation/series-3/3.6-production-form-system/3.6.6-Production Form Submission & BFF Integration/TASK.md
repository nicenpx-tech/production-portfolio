# Series 3.6.6 — Production Form Submission & BFF Integration

## Objective

Turn the composed forms of Series 3.6.1–3.6.5 into forms that talk to a
real backend.

This series focuses on:

- one shared contract for form submissions
- a Backend-for-Frontend boundary between browser and Go API
- server-side re-validation of every payload
- mapping backend failures onto React Hook Form error locations
- submission state owned by React Hook Form
- failure recovery that keeps the user's input
- tests at unit and integration level

The implementation builds on the existing:

- React Hook Form
- Zod
- useZodForm
- Form Foundation and the shared field primitives
- the `ProfileForm` example of Series 3.6.4
- the AGENTS.md rules §88–§91

Do NOT create another form abstraction layer. Do NOT introduce a second
validation mechanism.

> Note: the original task prompt for this series was not present in the
> repository when the implementation started. This document records the
> objective the delivered implementation answers.

---

## 1. Prerequisite

Before implementation inspect:

1. Root `AGENTS.md` (§88–§91 and the BFF rules §9, §10, §24, §46, §47)
2. Series 3.6.1 – 3.6.5 reports
3. `apps/web/src/shared/forms/useZodForm.ts`
4. `packages/ui/src/components/forms/*`
5. `apps/web/src/features/profile/**`
6. the existing tests and the vitest setup
7. `apps/api` — the Go backend is an empty placeholder in this repository

The current implementation is the source of truth. Do not assume filenames
or APIs.

---

## 2. Scope

### 2.1 In scope

- `apps/web/src/types/form-submission.ts` — the shared contract
- `apps/web/src/lib/api-client.ts` — browser → BFF client
- `apps/web/src/lib/backend-client.ts` — BFF → Go API client (server only)
- `apps/web/src/lib/form-submission-handler.ts` — result → RHF errors
- `apps/web/src/lib/form-submission-route.ts` — BFF route factory
- `apps/web/src/app/api/profile/route.ts` — the profile BFF route
- `apps/web/src/features/profile/**` — schema, service, form integration
- tests for the client, the handler, the route, and the form
- AGENTS.md §103–§110

### 2.2 Out of scope

- The Go API itself (`apps/api` is still a placeholder)
- Authentication and session management beyond forwarding the cookie
- Retry and offline queues
- File uploads
- Optimistic updates and cache invalidation
- Storybook stories for the new modules (the UI package owns the stories)

---

## 3. Deliverables

| Area | Deliverable |
| --- | --- |
| Contract | `types/form-submission.ts` with `FormFailureKind`, `FormSubmissionFailure`, `FormSubmissionResponse`, `FormSubmissionResult` |
| Browser → BFF | `lib/api-client.ts` with `postFormSubmission` |
| BFF → Go API | `lib/backend-client.ts` with `postToBackend` |
| Form bridge | `lib/form-submission-handler.ts` with `submitWithFeedback` |
| BFF route | `lib/form-submission-route.ts` with `createFormSubmissionRoute` |
| Route instance | `app/api/profile/route.ts` |
| Feature | `features/profile/schemas`, `features/profile/services`, `features/profile/components` |
| Tests | 43 new tests across four files |
| Docs | `AGENTS.md` §103–§110, this folder |

---

## 4. Architecture

```
Browser
  └─ ProfileForm (RHF, useZodForm)
       └─ submitWithFeedback          apps/web/src/lib/form-submission-handler.ts
            └─ submitProfile          apps/web/src/features/profile/services/profile-service.ts
                 └─ postFormSubmission apps/web/src/lib/api-client.ts
                      └─ POST /api/profile
                           └─ createFormSubmissionRoute  apps/web/src/lib/form-submission-route.ts
                                ├─ payload schema (server re-validation)
                                └─ postToBackend            apps/web/src/lib/backend-client.ts
                                     └─ Go API → Database
```

The browser never sees a backend error format, a backend URL, or a backend
credential.

---

## 5. Acceptance criteria

1. A form submits its validated payload to a BFF route.
2. The BFF route validates the payload again and forwards it to the Go API.
3. A rejected payload produces one field error per rejected field.
4. A business, auth, network, or unknown failure produces one root error.
5. A failed submission keeps every value the user typed.
6. A new attempt clears the messages of the previous attempt.
7. The submit button reflects `isSubmitting` and is disabled in flight.
8. The success confirmation never appears while an error stands.
9. Type check, lint, tests, and build all pass.
