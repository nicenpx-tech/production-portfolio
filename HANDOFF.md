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
