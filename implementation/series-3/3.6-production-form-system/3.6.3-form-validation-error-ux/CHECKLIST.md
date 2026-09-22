# Definition of Done

## Audit

- [x] Series 3.6.1/3.6.2 implementation audited and preserved

- [x] installed Zod version (v4) and resolver configuration inspected

- [x] existing accessibility architecture reused, not duplicated

---

## Validation

- [x] Zod remains the single business validation source of truth

- [x] no validation rules duplicated in components

- [x] mode: "onBlur" with documented rationale

- [x] reValidateMode: "onChange" with documented rationale

- [x] explicit defaultValues unchanged (no uncontrolled transitions)

---

## Error UX

- [x] field errors render through FormMessage (one source per field)

- [x] messages specific and actionable, no raw Zod structures

- [x] form-level orientation line only while isSubmitted && !isValid

- [x] orientation line removed once the form validates

- [x] no error summary (not justified for a six-field form)

- [x] failed submit keeps entered values (no reset)

- [x] first invalid field focused via RHF shouldFocusError

- [x] submit button disabled + relabelled while isSubmitting

- [x] no local loading/error state (RHF owns all of it)

- [x] no validation framework abstractions

---

## Tests

- [x] no errors while typing before first blur or submit

- [x] minimum length errors (name, message)

- [x] maximum length rejections (name, message)

- [x] required-field errors on empty submit (existing coverage)

- [x] select/checkbox/plan validation and clearing (existing coverage)

- [x] revalidation clears errors on change after failed submit

- [x] failed submit focuses first invalid field

- [x] valid values retained across failed submits

- [x] form-level message appears/disappears correctly

- [x] submitting state disables and relabels the button

- [x] switch keyboard operability

- [x] accessibility relationships (existing coverage)

---

## Validation

- [x] typecheck

- [x] lint (Biome)

- [x] tests

- [x] build

---

## Documentation

- [x] 3.6.3 implementation docs

- [x] AGENTS.md updated (Validation & Error UX Rules)

- [x] HANDOFF.md updated

---

## Boundaries

- [x] no API/BFF/server validation

- [x] no TanStack Query mutation

- [x] no future form features

- [x] feature branch used (feature/series-3.6.3-form-validation-error-ux)
