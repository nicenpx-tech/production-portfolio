# Task 1

Inspect existing conventions.

- Series 3.6.1 foundation in packages/ui/src/components/forms/
- legacy self-contained components in packages/ui/src/forms/
- existing test setup and vitest configuration
- existing [locale] routing and page conventions

Do not duplicate working 3.6.1 implementation.

---

# Task 2

Add bare field primitives to packages/ui/src/components/forms/.

- Textarea: bare multi-line input, standard input contract
- Select: native select, standard input contract, chevron affordance
- Checkbox: native input (sr-only) + sibling indicator,
  checked/onCheckedChange API
- Switch: role="switch" native input + track/thumb siblings,
  checked/onCheckedChange API
- RadioGroup + RadioGroupItem: context-driven role="radiogroup",
  value/onValueChange API, shared name for arrow-key grouping

All primitives keep the real input in the accessibility tree so
FormControl injects id/aria attributes. Update the components/forms
barrel. Business schemas MUST NOT live in packages/ui.

---

# Task 3

Create the feature schema.

apps/web/src/features/form-fields/schemas/form-fields.schema.ts

- name: required, trimmed, 2-100 characters
- message: required, trimmed, 10-1000 characters
- country: required, min 1 character
- terms: boolean refine === true
- plan: required, min 1 character
- notifications: boolean
- infer FormFieldsValues from the schema

---

# Task 4

Create FormFieldsExample.tsx.

- useForm + zodResolver + explicit defaultValues for all six fields
- Input, Textarea, and native Select receive the spread RHF field
- Checkbox, RadioGroup, and Switch map field.value + field.onChange
  explicitly with onBlur/name/ref where the API supports them
- one RHF instance, no field-level useState
- optional onSubmit prop receives the validated values; local
  submission only, no Go API call

---

# Task 5

Create the verification route.

apps/web/src/app/[locale]/form-fields/page.tsx

page.tsx MUST be composition-only.

---

# Task 6

Create colocated tests.

- rendering of all six fields with accessible names
- required validation on empty submit (name, message, country,
  terms, plan)
- select interaction and validation clearing
- checkbox toggle state and validation clearing
- radio selection and single-selection behavior
- switch default state and toggle
- keyboard operation of the checkbox
- successful submit delivers validated values to onSubmit
- aria-invalid/aria-describedby association and group labeling

---

# Task 7

Verify.

- bun run typecheck
- bun run lint
- bun run test
- bun run build

All pass.

---

# Task 8

Update documentation.

- implementation docs for 3.6.2
- AGENTS.md Form Field Rules
- HANDOFF.md
