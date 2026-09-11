# Series 3.6.2 — Field Primitives & Controlled Components

## Objective

Establish production-ready React Hook Form integration patterns for the
common form fields on top of the Series 3.6.1 foundation:

* Input
* Textarea
* Select
* Checkbox
* RadioGroup
* Switch

The series distinguishes between two integration rules:

* components with a standard `value/onChange/onBlur/name/ref` input
  contract receive the RHF field spread directly
* controlled components with custom change callbacks map
  `field.value` and `field.onChange` explicitly through `FormField`

No BFF submission. No server validation. No TanStack Query mutation.

---

## Expected Output

packages/ui/src/components/forms/

    Textarea.tsx

    Select.tsx

    Checkbox.tsx

    Switch.tsx

    RadioGroup.tsx

    index.ts (updated)

apps/web/src/features/form-fields/

    components/FormFieldsExample.tsx

    schemas/form-fields.schema.ts

    FormFieldsExample.test.tsx

    index.ts

apps/web/src/app/[locale]/form-fields/page.tsx

---

## Architecture

The Series 3.6.1 foundation is preserved unchanged. New primitives are
bare, composition-based, and built on native elements so the real input
always stays in the accessibility tree and receives the id and ARIA
attributes injected by `FormControl`:

    Feature schema (Zod)
      ↓
    Feature form component (React Hook Form)
      ↓
    Form > FormField > FormItem > FormLabel/FormControl/FormDescription/FormMessage
      ↓
    Bare field primitives (@repo/ui/components)

Controlled components do not receive `register()`; they map the RHF
field explicitly:

* Checkbox / Switch: `checked={field.value}` + `onCheckedChange={field.onChange}`
* RadioGroup: `value={field.value}` + `onValueChange={field.onChange}`
* Native Select: standard contract, `{...field}` works directly

The legacy self-contained components in `packages/ui/src/forms/` are
intentionally not used by the form system: they render their own
labels/errors and predate the Series 3.6.1 composition architecture.
Native elements are used instead of new Radix dependencies, matching
the "simplest correct approach" rule.

---

## RHF Integration Rules

* React Hook Form owns all field state; no field-level `useState`
* Zod (via `@hookform/resolvers/zod`) is the validation source of truth
* every controlled field has an explicit `defaultValues` entry so no
  control transitions from uncontrolled to controlled
* `FormField` (Controller) renders every field; `register()` is not
  forced onto components without the native input contract

---

## Accessibility Rules

* labels are associated through `FormControl` id injection + `htmlFor`
* the real input remains the accessible element for Checkbox, Switch,
  and RadioGroupItem (visually hidden input + sibling indicator)
* invalid fields expose `aria-invalid` and `aria-describedby`
* validation messages render through `FormMessage` (`role="alert"`)
* RadioGroup exposes `role="radiogroup"` and is named via `aria-label`;
  items are labelled through `Label` + `htmlFor`
* shared `name` on radio items gives native arrow-key navigation

---

## Intentionally Out of Scope

OTP, DatePicker, Combobox, Autocomplete, file upload, drag & drop,
multi-step forms, field arrays, dependent fields, conditional schemas,
async/server validation, autosave, draft persistence, rich text editor,
BFF submission, API integration, TanStack Query mutation, field wrapper
abstractions (`FormInput`, `FormSelect`, ...).

---

## Status

Completed.

See HANDOFF.md at the repository root.
