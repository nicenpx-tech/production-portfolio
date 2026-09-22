# Series 3.6.3 — Form Validation & Error UX

## Objective

Establish the production validation and error UX layer on top of the
Series 3.6.1/3.6.2 form system:

    User interaction
      ↓
    RHF field state
      ↓
    Zod validation
      ↓
    Field error
      ↓
    Accessible error presentation
      ↓
    Form-level orientation
      ↓
    Clear recovery path

The focus is predictable, accessible, recoverable validation — not
merely working validation.

---

## Validation Architecture

* Zod (via `@hookform/resolvers/zod`) remains the single business
  validation source of truth; no rules are duplicated into components
* React Hook Form owns all validation/form state (errors, touched,
  submitting, submitted)
* Validation timing is a deliberate configuration, not an accident:

        useForm({
          resolver: zodResolver(formFieldsSchema),
          mode: "onBlur",
          reValidateMode: "onChange",
          defaultValues: { ... },
        })

    - `mode: "onBlur"`: a value the user is still typing must not be
      flagged as invalid before they finish; errors appear when the
      user leaves the field or on submit
    - `reValidateMode: "onChange"`: after the first submit attempt, an
      error disappears the moment the corrected value becomes valid —
      no blur or second submit required

---

## Error UX

* field-level errors render through the existing `FormMessage`
  (role="alert"); there is one error source per field and no second
  error system
* messages are specific and actionable ("Name must be at least 2
  characters.", "Please select a country."), never raw Zod structures
* a single form-level orientation line ("Please correct the
  highlighted fields and try again.") appears only while
  `isSubmitted && !isValid`; it points to the field errors instead of
  duplicating them, and disappears once the form validates
* no error summary list: the form has six fields, so field-level
  errors already provide clear orientation
* failed submits never clear or reset entered values
* RHF's default `shouldFocusError` moves focus to the first invalid
  field after a failed submit (refs are attached through the 3.6.1
  FormControl/field wiring); no custom focus abstraction
* the submit button uses `formState.isSubmitting` (disabled + relabel
  "Submitting…") — RHF owns the state, no local loading flag

---

## Scope

Demonstrated on the existing `form-fields` feature and its schema.
Local submission only.

Intentionally out of scope: API/BFF submission, server validation,
server errors, TanStack Query mutations, autosave, draft persistence,
multi-step forms, field arrays, dependent fields, async validation,
error summaries beyond the orientation line.

---

## Status

Completed on branch feature/series-3.6.3-form-validation-error-ux.

See HANDOFF.md at the repository root.
