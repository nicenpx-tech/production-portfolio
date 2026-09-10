# Task 1

Inspect existing conventions.

- packages/ui structure, barrels, cn()
- existing test setup
- existing Next.js [locale] routing

---

# Task 2

Add dependencies to apps/web.

- react-hook-form
- zod
- @hookform/resolvers
- @repo/ui (workspace)
- vitest tooling (vitest, jsdom, @vitejs/plugin-react, @testing-library/*)

Do not add duplicates that already exist at the correct workspace level.

---

# Task 3

Create shared Form primitives in packages/ui.

- Form
- FormField
- FormItem
- FormLabel
- FormControl
- FormDescription
- FormMessage
- useFormField
- Input
- Label

Stable field IDs, htmlFor wiring, aria-invalid, aria-describedby,
role="alert" on validation messages.

Business schemas MUST NOT live in packages/ui.

---

# Task 4

Create the feature schema.

apps/web/src/features/form-foundation/schemas/form-foundation.schema.ts

- name: required, 2-100 characters
- email: required, valid email
- message: required, 10-1000 characters
- infer FormFoundationValues from the schema

---

# Task 5

Create FormFoundationExample.tsx.

- useForm + zodResolver + defaultValues
- Form, FormField, FormItem, FormLabel, FormControl,
  FormDescription, FormMessage
- Input, Textarea, Button from @repo/ui
- no field-level useState
- handleSubmit + noValidate
- local verification only, no Go API call

---

# Task 6

Create the verification route.

apps/web/src/app/[locale]/form-foundation/page.tsx

page.tsx MUST be composition-only.

---

# Task 7

Create colocated tests.

- rendering
- invalid submission shows all validation messages
- valid submission succeeds without errors
- accessibility: label association, aria-invalid,
  aria-describedby, role="alert"

---

# Task 8

Verify.

- bun run typecheck
- bun run lint
- bun run test

All pass.
