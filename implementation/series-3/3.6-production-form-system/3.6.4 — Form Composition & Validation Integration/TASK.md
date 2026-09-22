# Series 3.6.4 — Form Composition & Validation Integration

## Objective

Implement the next layer of the Production Form System by composing the existing
Form Foundation and Field Components into reusable, production-grade form
patterns.

The implementation must integrate:

- React Hook Form
- Zod
- @hookform/resolvers
- Existing Form Foundation
- Existing Form Field Components
- Existing design tokens / UI primitives
- Existing TypeScript architecture
- Existing testing conventions

The goal is NOT to create another form abstraction layer.

The goal is to establish a clear and reusable pattern for building real
application forms inside feature modules.

---

# 1. Context

This project is the Production Portfolio Starter Kit.

Current architecture:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- next-intl
- MDX
- Motion
- Storybook
- Biome
- Bun
- Turborepo

Architecture rules:

- Feature-based frontend architecture
- BFF pattern
- API access must go through app/api/
- page.tsx should only compose feature-level components
- Forms must use React Hook Form
- Field values must NOT be managed using controlled React state
- Validation schemas use Zod
- Tests are colocated
- Tailwind only
- No CSS-in-JS
- No additional UI component library
- shadcn primitives live under src/components
- Shared reusable logic belongs in the appropriate packages/features
- Follow existing project conventions instead of introducing parallel patterns

---

# 2. Prerequisite

Before implementation, inspect the repository and understand the existing work.

You MUST inspect:

1. Series 3.6 implementation
2. Series 3.6.1
3. Series 3.6.2
4. Series 3.6.3
5. Existing Form Foundation
6. Existing Form Field Components
7. Existing validation utilities
8. Existing UI primitives
9. Existing tests
10. Existing Storybook stories
11. Existing agents.md / CLAUDE.md / project instructions

Do not assume filenames or folder structures.

Use the repository's actual implementation as the source of truth.

---

# 3. Scope

Implement Series 3.6.4 around these concerns:

## 3.6.4.1 Form Schema Integration

Establish the canonical pattern for connecting:

Zod schema
→ React Hook Form
→ Form Provider / form context
→ Field Components
→ Submit handler

The pattern must support:

- required fields
- optional fields
- nullable fields where appropriate
- string validation
- number validation
- boolean validation
- enum validation
- custom refinement where appropriate
- cross-field validation where appropriate

Do not over-engineer this.

---

## 3.6.4.2 Reusable Form Composition

Establish a production-ready composition pattern.

Expected conceptual structure:

Form
├── FormProvider / context
├── FormField
│   ├── Label
│   ├── Input / Select / Checkbox / etc.
│   ├── Description
│   └── Error
└── FormActions

The exact implementation MUST follow the existing repository architecture.

Do not blindly introduce these exact component names if equivalent
components already exist.

---

## 3.6.4.3 Type-safe Form Values

Form values must be inferred from the Zod schema whenever practical.

Preferred pattern:

schema
→ z.infer<typeof schema>
→ useForm<FormValues>()

Avoid:

- duplicated interfaces
- manually duplicated validation types
- `any`
- unnecessary type assertions

The schema should remain the source of truth.

---

## 3.6.4.4 Default Values

Establish a consistent approach for:

- initial values
- empty values
- optional fields
- nullable fields
- edit forms

Avoid putting business-specific defaults into generic form infrastructure.

Generic infrastructure should remain generic.

---

## 3.6.4.5 Submit Lifecycle

Establish a predictable lifecycle for:

- valid submission
- invalid submission
- async submission
- submitting state
- submission errors
- successful submission
- reset after submission where appropriate

Do not introduce API/BFF implementation unless already required by the
existing architecture.

This series should establish the form layer, not a business feature.

---

## 3.6.4.6 Error Handling

Ensure validation errors can flow correctly from:

Zod
→ React Hook Form
→ Field
→ UI

The implementation must support:

- field-level errors
- form-level errors where appropriate
- async/server errors without corrupting field state

Do not couple generic form infrastructure to a specific backend error format
unless an existing shared error contract already exists.

---

## 3.6.4.7 Accessibility

Verify:

- labels are correctly associated with controls
- invalid fields expose appropriate state
- error messages are associated with fields
- keyboard navigation works
- submit controls have correct semantics
- disabled/loading states remain accessible

Follow existing shadcn/Radix conventions where applicable.

---

## 3.6.4.8 Testing

Add or update tests for the new composition/integration behavior.

At minimum cover:

### Rendering

- form renders
- fields render
- default values appear

### Validation

- required field failure
- invalid value
- valid value
- multiple validation errors

### Submission

- valid form submits
- invalid form does not submit
- async submission state
- submit handler receives typed values

### Error UI

- field error appears
- error disappears after correction
- form-level error can be rendered

### Accessibility

At least verify important form controls can be located through
accessible queries.

Prefer:

- getByRole
- getByLabelText
- getByText

Avoid implementation-detail selectors unless unavoidable.

---

# 4. Storybook

If the project already uses Storybook for the form system, add/update stories
for the composition layer.

Stories should demonstrate:

1. Basic form
2. Required validation
3. Multiple fields
4. Disabled/submitting state
5. Error state

Do not create stories solely for infrastructure that has no visual behavior.

---

# 5. Example/Demo Form

Create a small realistic example form only if necessary to demonstrate
composition.

The example must remain generic.

Good examples:

- Profile form
- Contact form
- Account settings form

Avoid domain-specific business logic from the XSpring/trading project.

The example exists to prove the architecture works.

---

# 6. Architecture Constraints

DO NOT:

- introduce another form library
- manage form fields using useState
- build custom controlled-input abstractions without strong justification
- duplicate Zod schemas and TypeScript interfaces
- introduce global form state
- introduce API calls
- introduce business-specific form infrastructure
- bypass existing Form Field Components
- bypass design tokens
- add another UI library
- create parallel component hierarchies
- modify unrelated features

If existing infrastructure already supports a requirement,
reuse it instead of rebuilding it.

---

# 7. Expected Deliverables

Implementation should result in:

1. Canonical Zod + RHF integration pattern
2. Reusable form composition pattern
3. Type-safe form values
4. Consistent default value handling
5. Submit lifecycle handling
6. Validation/error propagation
7. Accessibility verification
8. Unit/integration tests
9. Storybook coverage where appropriate
10. Documentation explaining how future forms should be built

---

# 8. Documentation

Add/update documentation explaining:

- how to define a schema
- how to infer form values
- how to initialize useForm
- how to compose fields
- how validation works
- how submit handlers work
- how async submission works
- how errors are displayed
- how to add a new form

Documentation should focus on project conventions.

Do not write generic React Hook Form documentation.

---

# 9. Validation Commands

Use the repository's actual commands.

At minimum verify:

- typecheck
- lint
- format/check
- unit tests
- build if practical
- Storybook checks if configured

Do not assume package scripts.

Inspect package.json first.

---

# 10. Scope Discipline

This series is complete when the repository has a clear,
production-ready pattern for building forms using:

Zod + React Hook Form + existing Form Field Components.

Do NOT proceed into:

- server actions
- BFF API integration
- complex multi-step forms
- dynamic field arrays
- advanced async validation
- autosave
- optimistic updates

Those should be separate future series unless already required by existing
architecture.

---

# 11. Final Report

At the end, produce:

## Implementation Summary

- files created
- files modified
- architecture decisions
- important implementation details

## Validation

Report actual command results:

- typecheck
- lint
- format
- tests
- build
- Storybook

Clearly distinguish:

PASS
FAIL
NOT RUN

## Test Coverage

List:

- validation scenarios
- submission scenarios
- error scenarios
- accessibility scenarios

## Architecture Compliance

Confirm:

- RHF used
- Zod used
- no controlled field state
- no duplicate validation types
- existing field components reused
- Tailwind only
- tests colocated
- no unrelated changes

## Known Limitations

List anything intentionally deferred.

## Recommendation

State whether Series 3.6.4 is ready for Series 3.6.5.