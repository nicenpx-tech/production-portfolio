# Series 3.6.5 — Advanced Form Patterns & Field Arrays: Final Report

## Status

**PASS** — the patterns are implemented, tested, and documented.

## Files Created

- `apps/web/src/features/contact/schemas/contact.schema.ts` — the collection
  rules, the per-item rules, the dependency rule, and the payload transform
- `apps/web/src/features/contact/components/ContactForm.tsx` — the example
  form
- `apps/web/src/features/contact/ContactForm.test.tsx` — 16 behavioral tests
- `apps/web/src/features/contact/index.ts` — the public feature API
- `apps/web/src/app/[locale]/contact/page.tsx` — a composition-only route

## Files Modified

- `AGENTS.md` — the sections §92 to §102

## Implementation Summary

The series delivers the three patterns of the task, in one example form:

- a **field array** of contact methods, with the stable identity React Hook
  Form supplies for every item
- a **conditional field**, where only the slot of the selected contact type
  is rendered and validated
- a **dependent field**, where the country decides which regions may be
  chosen

The shared composition layer (`apps/web/src/shared/forms/`) was **not**
extended. The task forbids an abstraction that only wraps a line of React
Hook Form code, and nothing in this series needs one: the form uses
`useFieldArray` and `useWatch` directly, and the only shared piece stays
`useZodForm`.

## Architecture Decisions

- **The schema owns the payload.** The item schema validates the slot of the
  selected type and transforms the item into `{ type, value }`, so the
  payload carries exactly the visible value. The form state keeps both
  slots; the payload publishes one.
- **The rules live in one place.** The collection rules live on the array,
  the item rules on the item, and the dependency rule on the object, where
  it names the field it belongs to.
- **The dependency stays local.** `REGIONS_BY_COUNTRY` is a constant in the
  schema module, so the dependent field never needs a request.
- **No mirrored state.** The visible slot and the region list are derived
  from `useWatch`, never from a copy in `useState`.

## Field Array Behavior

- The items come from `useFieldArray`, so every item carries the stable
  `id` of React Hook Form. The index is only used to address the field.
- `append` adds an empty method, `remove` drops one, and the values of the
  remaining items are untouched.
- The minimum of one and the maximum of three live on the array in the
  schema. The add control is disabled at the maximum, so the user cannot
  create a collection the schema rejects.
- A collection error belongs to no single item, so it is rendered once
  next to the collection, announced through `role="alert"`.

## Conditional Field Behavior

- The contact type decides which slot is rendered: the email input or the
  phone input. The other one is not in the document.
- Only the visible slot is validated. An invalid email that the user typed
  before switching to phone does not block the submission.
- The item schema transforms the item into `{ type, value }`, so the hidden
  slot never reaches the payload.

## Cleanup / Unregister Decision

**The form state retains the value of a hidden field; the payload publishes
only the visible value.**

- Retention keeps what the user typed, so switching the type back and forth
  does not destroy the input.
- The schema decides what leaves the payload, which gives every form of
  this project one policy.
- A form that needs a different policy states it in its own feature.

## Tests

`apps/web/src/features/contact/ContactForm.test.tsx` — 16 tests:

- the initial collection and the accessible names of every control
- adding, removing, and editing an item
- the value of a removed item does not reach the payload
- the validated payload carries the transformed value
- an invalid email and an invalid phone number are reported on their field
- the minimum length is reported when every item is removed
- the add control stops at the maximum
- the phone field replaces the email field when the type changes
- a hidden field does not block the submission
- the regions follow the country, and a changed country clears the region
- a region that does not belong to the country is reported
- the entered values survive a rejected submission
- the dynamic fields keep their labels and their accessible names

## Validation

- `bun run typecheck` — no type errors
- `bun run lint` — no lint errors (Biome formatter applied first). The
  committed `ProfileForm.test.tsx` did not satisfy the formatter, so the
  lint gate of `develop` failed before this series; the single line the
  formatter reports is fixed in its own commit
- `bun run test` — 50 tests passed in 4 files
  - form-foundation 4, form-fields 17, profile 13, contact 16
- `bun run build` — successful, the route `/[locale]/contact` is registered
- Storybook — not applicable, the shared UI package was not changed

## Compliance

- React Hook Form owns the state, Zod owns the validation
- `useZodForm` owns the setup, the feature declares only schema and
  defaults
- no mirrored field state, no `useState` copy of a field value
- stable field identity, the array index is never a React key
- the dynamic fields keep their labels, their descriptions, and their
  `role="alert"` messages
- the tests are colocated with the feature
- Tailwind classes only, no new UI library
- no unrelated change

## Known Limitations

- **The form state widens the literal types of an enum.** `useZodForm`
  infers its input and output through the type parameters of `z.ZodType`,
  which widens `"jp" | "us" | "de"` to `string` in the form state. The
  payload types stay precise. The example narrows the watched country
  through the known options instead of casting it.
- **The example does not submit anywhere.** The series forbids BFF
  integration, so the form hands the validated payload to its `onSubmit`
  prop.
- **The collection error is read defensively.** React Hook Form nests an
  error of a repeated field under `root`, which its types do not describe
  for array fields, so the example narrows the value instead of casting it.

## Recommendation

Series 3.6.6 can begin. The form layer is ready for a submission that
leaves the browser: React Hook Form owns the state, Zod owns the
validation, and the schema owns the payload. The next series owns the
boundary — the contract of a submission, the route that validates and
forwards, and the mapping of a failure onto the form.
