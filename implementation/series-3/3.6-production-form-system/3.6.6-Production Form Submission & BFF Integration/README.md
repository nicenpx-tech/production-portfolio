# Series 3.6.6 — Production Form Submission & BFF Integration

How a form in this repository reaches the Go API, and how the answer comes
back to the field the user has to fix.

## The shape of a submission

```
Browser
  └─ ProfileForm                      features/profile/components/ProfileForm.tsx
       └─ submitWithFeedback          lib/form-submission-handler.ts
            └─ submitProfile          features/profile/services/profile-service.ts
                 └─ postFormSubmission lib/api-client.ts
                      └─ POST /api/profile
                           └─ createFormSubmissionRoute  lib/form-submission-route.ts
                                ├─ profilePayloadSchema    (server re-validation)
                                └─ postToBackend           lib/backend-client.ts
                                     └─ Go API → Database
```

Every arrow crosses exactly one boundary:

- The **browser** only knows the BFF route. It never sees the Go API address.
- The **BFF route** is the only place that knows the backend. It validates the
  payload again and forwards the session cookie.
- The **backend** answers in whatever format it likes; the BFF translates the
  answer into the shared contract.

## The contract

`apps/web/src/types/form-submission.ts`

```ts
type FormFailureKind = "validation" | "business" | "auth" | "network" | "unknown";

interface FormSubmissionFailure {
  kind: FormFailureKind;
  message: string;
  fieldErrors?: FormFieldError[]; // validation only
  code?: string;
}
```

| Kind | Meaning | Where it lands in the form |
| --- | --- | --- |
| `validation` | field-level problems | one field error per field, plus the root error |
| `business` | a domain rule rejected the payload | root error |
| `auth` | session missing or insufficient | root error |
| `network` | the request never reached the server | root error |
| `unknown` | anything else | root error |

Field errors render through the shared `FormMessage`; the root error renders
through the shared `FormRootError`. The form layer never inspects an HTTP
status code.

## Adding a form that submits

1. **Declare the payload schema** in `features/<feature>/schemas/`. It holds
   the rules and the messages, and it is the schema the BFF route validates
   with.

2. **Derive the form schema** from it when the fields hold a different input
   type. `profile.schema.ts` shows the pattern: the payload schema owns every
   rule, the form schema overrides only the year field and pipes it into the
   payload rule.

3. **Add the service** in `features/<feature>/services/`:

   ```ts
   export function submitProfile(values: ProfileSubmitValues) {
     return postFormSubmission<ProfileSubmitValues>("/profile", values);
   }
   ```

4. **Add the route** in `app/api/<feature>/route.ts`:

   ```ts
   export const POST = createFormSubmissionRoute({
     schema: profilePayloadSchema,
     backendPath: "/profile",
   });
   ```

5. **Wire the form** with `submitWithFeedback`:

   ```tsx
   const result = await submitWithFeedback(values, submitProfile, { form });
   if (!result.ok) return;   // the failure is already on the form
   ```

## Rules that matter

- The submit button reflects `isSubmitting`; there is no local loading state.
- The handler never resets the form and never changes a field value.
- A failed submission keeps everything the user typed.
- A new attempt starts clean, so a stale message cannot survive a successful
  resubmission.
- The success confirmation checks `isSubmitSuccessful` **and** the absence of a
  root error.
- The browser never calls the Go API directly.

The full rules live in `AGENTS.md` §92–§99.

## Environment

| Variable | Scope | Meaning |
| --- | --- | --- |
| `BACKEND_API_URL` | server only | Base URL of the Go API. Without it the BFF answers `BACKEND_NOT_CONFIGURED`. |

## Tests

| File | Level | Covers |
| --- | --- | --- |
| `lib/form-submission-handler.test.ts` | unit | failure → RHF error location, value preservation, unknown field paths |
| `lib/api-client.test.ts` | unit | HTTP status → failure kind, transport failure, malformed body |
| `app/api/profile/route.test.ts` | integration | server re-validation, forwarding, translation, cookie |
| `features/profile/ProfileForm.test.tsx` | integration | the request, the rendered message, the field state, recovery |

Run them with `bun run test`.
