# Series 3.6.4 — Form Composition & Validation Integration

## Objective

Compose the Series 3.6.1–3.6.3 pieces into the canonical way feature
forms are built, so each new form stops re-solving setup questions:

    Feature form component
      ↓
    useZodForm (shared composition)
      ↓
    Zod schema (input → output)
      ↓
    @repo/ui form primitives
      ↓
    Typed submit values / form-level root error
      ↓
    BFF (later series)

The focus is one repeatable composition layer — not new primitives.

---

## Composition Architecture

Form composition is split along the framework boundary that already
exists in the repo:

| Concern | Home | Why |
|---|---|---|
| `FormRootError` (presentation) | `packages/ui/src/components/forms/` | Renders form state; `@repo/ui` already couples to RHF for the form system |
| `useZodForm` (composition) | `apps/web/src/shared/forms/` | Couples RHF + Zod + resolvers; the UI package deliberately does not depend on Zod |

`apps/web/src/shared/forms/` is the new home for app-wide form
composition glue. It is not a dumping ground: only composition that is
true for every feature form belongs here.

---

## Canonical Form Recipe

```tsx
const form = useZodForm({
  schema: profileSchema,
  defaultValues: { ...EMPTY_PROFILE_VALUES, ...defaultValues },
});
```

`useZodForm` fixes the project-wide answers:

* resolver: `zodResolver(schema)` — one wiring, never re-implemented
* `mode: "onBlur"`, `reValidateMode: "onChange"` (AGENTS.md §90)
* form state typed by `z.input<S>`; submit handlers typed by `z.output<S>`
* `criteriaMode` stays at the RHF default (`firstError`)

Feature components declare only **schema** and **default values**.

---

## Input → Output Typing

Schemas may transform. The canonical example is a number input:

```ts
experienceYears: z.string()
  .min(1, "Experience is required.")
  .transform((value) => Number(value))
  .pipe(z.number("Experience must be a number.").int()
    .min(0, "…").max(60, "…")),
```

* `z.input` — what the field holds: a `string`
* `z.output` — what validation produces: a `number`

`useZodForm` carries both: field state uses the input type, and
`handleSubmit` hands the component fully transformed output values.
`FormField` in `@repo/ui` forwards `TTransformedValues`, so field
state keeps this typing end to end without casts.

---

## Submission Lifecycle

* **Pending**: `formState.isSubmitting` disables and relabels the
  submit button; no local loading state.
* **Server failure**: `form.setError("root", { message })` inside a
  `try/catch` around the submit callback. `FormRootError` renders it
  once per form with `role="alert"`. Field values are never touched.
  React Hook Form clears root errors on the next submit attempt —
  recovery is resubmission, not state juggling.
* **Success**: rendered only while `isSubmitSuccessful` is true AND
  no root error stands. (Catching the server failure inside the
  handler resolves the submit promise, so `isSubmitSuccessful` alone
  is not trustworthy.)
* **No reset after submit**: profile data is edit data; values stay.
  Reset belongs to UX decisions, not to the composition layer.

---

## Default Values & Edit Forms

* Empty-create defaults live in the **feature** (`EMPTY_PROFILE_VALUES`),
  not in shared composition.
* Defaults may use RHF's `DefaultValues` shape: an enum field starts
  as `undefined` and renders the disabled placeholder option; Zod
  turns "no choice" into a field message on submit.
* The component accepts optional `defaultValues` props for edit
  forms; pre-filled forms demonstrate that initial values pass
  through the same schema.

---

## Cross-Field Rules

Object-level refinements run only after every field check passes
(Zod semantics). Attach the issue to the field it belongs to with
`path:`, so the message renders through that field's `FormMessage`:

```ts
.refine((v) => !v.showEmail || (v.contactEmail?.length ?? 0) > 0,
  { message: "Add a contact email…", path: ["contactEmail"] })
```

---

## Scope

Implemented:

* `apps/web/src/shared/forms/` — `useZodForm`, public barrel
* `FormRootError` in `@repo/ui` forms (+ barrel export)
* `FormField` forwards `TTransformedValues` (non-breaking)
* `features/profile/` — schema, `ProfileForm`, page at
  `/[locale]/profile`, 13 behavioral tests

Intentionally NOT implemented:

* **Storybook stories** — Storybook is configured in `packages/ui`
  only and its stories glob covers `packages/ui/src` legacy
  self-contained components. App-level forms live outside that
  setup; wiring a new app-side Storybook is separate infrastructure,
  not a 3.6.4 deliverable.
* **FormActions / field-wrapper abstractions** — one form does not
  justify them (AGENTS.md §72, §89).
* **BFF submission, server validation** — later series. `onSubmit`
  rejection stands in for the server-failure path only.

---

## Status

Complete on branch `feature/series-3.6.4-form-composition`.
Verification: typecheck / lint / test (34 total) / build — all PASS.
