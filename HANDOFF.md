# Handoff

## Series 3.6.1 — Form Foundation
Status: Completed
Implemented:
- React Hook Form foundation
- Zod integration
- shared Form primitives
- accessible form field wiring
- feature-level schema pattern
- form validation tests
Rules:
- No useState for individual form fields
- Zod is validation source of truth
- Form primitives live in packages/ui
- Business schemas remain inside features
- page.tsx remains composition-only
- BFF remains the API boundary
Next:
Series 3.6.2 — Field Primitives & Controlled Components

## Series 3.6.2 — Field Primitives & Controlled Components
Status: Completed
Implemented:
- bare field primitives in @repo/ui/components:
  Textarea, Select, Checkbox, Switch, RadioGroup/RadioGroupItem
- controlled component mapping patterns (checked/onCheckedChange,
  value/onValueChange) versus standard field spreading
- form-fields example feature with one RHF instance and explicit
  defaultValues for all six field types
- [locale]/form-fields verification route (composition-only)
- colocated behavioral tests (render, validation, interactions,
  keyboard, submit values, accessibility)
Rules:
- register only for the standard input contract
- controlled components map field.value + field.onChange explicitly
- every controlled field has an explicit defaultValues entry
- no field wrapper abstractions (FormInput/FormSelect/...)
- legacy packages/ui/src/forms components are not part of the
  form system (self-contained, not FormControl-composable)
Verification:
- typecheck PASS
- lint PASS
- tests PASS (13)
- build PASS
Next:
Series 3.6.3 — Form Validation & Error UX

## Series 3.6.3 — Form Validation & Error UX
Status: Completed (branch feature/series-3.6.3-form-validation-error-ux)
Implemented:
- deliberate validation timing: mode onBlur + reValidateMode onChange
  (documented rationale)
- form-level orientation line while isSubmitted && !isValid
  (role=alert, no duplication of field errors)
- submit button reflects formState.isSubmitting (disabled + relabel)
- failed-submit focus via RHF shouldFocusError; values retained
- extended behavioral tests: timing, min/max length, revalidation,
  focus, form-level message lifecycle, submitting state, keyboard
Rules:
- Zod is the business validation source of truth
- RHF owns form state; no local error/loading flags
- one error source per field (FormMessage)
- no error summaries unless justified
- server validation/errors belong to the BFF series
Verification:
- typecheck PASS
- lint PASS
- tests PASS (17 form-fields, 21 total incl. foundation)
- build PASS
Next:
Series 3.6.4

## Series 3.6.4 — Form Composition & Validation Integration
Status: Completed (branch feature/series-3.6.4-form-composition)
Implemented:
- shared composition module apps/web/src/shared/forms/:
  useZodForm (zodResolver + onBlur/onChange defaults; form state
  typed by z.input, submit handlers by z.output)
- FormRootError in @repo/ui: renders form.errors.root once per
  form (role=alert) for server/submission failures
- FormField forwards TTransformedValues (non-breaking) so
  transformed schemas keep their typing on field state
- example feature features/profile/ + /[locale]/profile route:
  number transformation (string in form state, number in submit
  values), cross-field refine targeting contactEmail, edit-form
  defaultValues prop, submission lifecycle (pending, root error,
  guarded success, no reset)
- 13 behavioral tests for the composed form
Rules (AGENTS.md section 91 added):
- feature forms init through useZodForm only
- composition glue lives app-side; @repo/ui stays Zod-free
- server/submission failures surface via setError("root", ...) +
  FormRootError, never as field errors
- success requires isSubmitSuccessful && no root error
- do not reset after submit unless the UX calls for it
- object-level refinements run only after field checks pass;
  attach issues to their field via path
Deliberately out of scope:
- Storybook stories for app-level forms (Storybook covers
  packages/ui legacy components only)
- FormActions / field-wrapper abstractions (not justified)
- BFF submission and real server validation (later series)
Verification:
- typecheck PASS
- lint PASS
- tests PASS (13 profile, 34 total)
- build PASS (/[locale]/profile route present)
Next:
Series 3.6.5 (BFF submission / server error integration)

