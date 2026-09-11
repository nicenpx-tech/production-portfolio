# Definition of Done

## Repository

- [x] repository instructions inspected

- [x] Series 3.6.1 implementation audited and preserved

- [x] legacy forms/ components evaluated (not reused; self-contained,
      not FormControl-composable)

- [x] existing test setup inspected

---

## Shared primitives

- [x] Textarea

- [x] Select (native)

- [x] Checkbox

- [x] RadioGroup + RadioGroupItem

- [x] Switch

- [x] barrel exports updated (@repo/ui/components subpath)

---

## RHF integration

- [x] Input works with field spread

- [x] Textarea works with field spread

- [x] native Select works with field spread (standard contract)

- [x] Checkbox maps checked/onCheckedChange explicitly

- [x] RadioGroup maps value/onValueChange explicitly

- [x] Switch maps checked/onCheckedChange explicitly

- [x] explicit defaultValues for every controlled field

- [x] no uncontrolled-to-controlled warnings

- [x] no field-level useState

- [x] no register() forced onto controlled components

- [x] no FormInput/FormSelect/FormCheckbox wrapper abstractions

---

## Feature

- [x] feature schema (form-fields.schema.ts)

- [x] typed form values

- [x] useForm + zodResolver

- [x] FormFieldsExample demonstrates all six fields

- [x] index.ts public exports

---

## Boundaries

- [x] page.tsx composition-only

- [x] no direct Go API calls, no BFF endpoint, no TanStack mutation

- [x] Tailwind-only styling

- [x] no new dependencies

---

## Tests

- [x] render test (all six fields)

- [x] required validation test

- [x] select interaction test

- [x] checkbox interaction test

- [x] radio group interaction test

- [x] switch default + toggle test

- [x] keyboard test (checkbox via space)

- [x] successful submission test (values reach onSubmit)

- [x] accessibility test (labels, aria-invalid, aria-describedby,
      radiogroup naming)

---

## Validation

- [x] typecheck

- [x] lint (Biome)

- [x] tests

- [x] build

---

## Documentation

- [x] AGENTS.md updated (Form Field Rules)

- [x] HANDOFF.md updated

- [x] implementation docs updated
