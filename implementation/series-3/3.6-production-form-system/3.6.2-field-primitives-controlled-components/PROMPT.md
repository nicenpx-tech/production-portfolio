You are the Web Agent for the Production Portfolio Starter Kit.

Implement Series 3.6.2 — Field Primitives & Controlled Components.

Requirements

- Next.js 16 App Router

- React 19

- TypeScript

- Bun Workspaces

- Turborepo

- Tailwind v4

- Biome

Implementation Rules

- Production Ready

- Build on the Series 3.6.1 foundation; do not redesign it

- React Hook Form + Zod + @hookform/resolvers

- Simple input-like components receive the spread RHF field

- Controlled components (Checkbox, RadioGroup, Switch) map
  field.value + field.onChange explicitly through FormField

- Do not force register() onto controlled components

- Shared bare primitives in packages/ui (components/forms)

- Feature schemas in src/features/<feature>/schemas/

- No useState for individual form fields

- Explicit defaultValues for every controlled field

- page.tsx composition-only

- No direct Go API calls, no BFF endpoint

- No field wrapper abstractions (FormInput, FormSelect, ...)

- Tests colocated, behavioral, prefer getByRole/getByLabelText

Deliverables

- Textarea, Select, Checkbox, Switch, RadioGroup primitives

- form-fields example feature demonstrating all six fields

- [locale]/form-fields verification route

- Colocated tests (render, validation, interactions, submit,
  accessibility)

- Created files

- Modified files

- Summary

Validation

Run

bun run typecheck

bun run lint

bun run test

bun run build

All commands must pass.
