# Agent Prompt — Series 3.6.4

You are implementing:

# Series 3.6.4 — Form Composition & Validation Integration

Act as a Senior Staff Frontend Engineer working on a production-grade
Next.js monorepo.

Your job is to inspect the existing implementation first, then implement
Series 3.6.4 without breaking established architecture.

---

## IMPORTANT

Do NOT start coding immediately.

First inspect:

- repository structure
- agents.md
- CLAUDE.md
- package.json files
- Series 3.6 documentation
- Series 3.6.1 implementation
- Series 3.6.2 implementation
- Series 3.6.3 implementation
- existing form components
- existing field components
- existing Zod utilities
- existing RHF utilities
- existing tests
- existing Storybook configuration

Determine what already exists.

Do not recreate existing functionality.

---

# Primary Objective

Create the canonical project pattern for composing production forms using:

React Hook Form
+
Zod
+
existing Form Foundation
+
existing Form Field Components

The result must be reusable by future feature modules.

---

# Required Workflow

Follow this order:

## Phase 1 — Repository Reconnaissance

Inspect the repository.

Identify:

- existing form architecture
- existing component names
- existing file locations
- existing exports
- existing validation patterns
- existing test patterns
- existing Storybook patterns

Then determine the smallest implementation required.

Do not change files yet.

---

## Phase 2 — Architecture Decision

Before implementation, internally establish:

1. Where schemas belong
2. Where form composition components belong
3. How FormProvider/context is handled
4. How field errors flow
5. How form-level errors flow
6. How default values are typed
7. How submit lifecycle is represented
8. How async submit state is handled

Follow existing project conventions.

If equivalent infrastructure exists, extend it rather than creating another
abstraction.

---

## Phase 3 — Implementation

Implement the smallest production-ready solution.

Requirements:

### React Hook Form

RHF is mandatory.

Do not use:

useState
for individual form field values.

Do not create controlled field state unless technically unavoidable and
explicitly justified.

---

### Zod

Zod must be the validation source of truth.

Prefer:

z.infer<typeof schema>

Do not duplicate the same type manually.

---

### Form Composition

The composition should make future feature forms easy to implement.

Future developers should be able to follow a predictable pattern:

1. Define schema
2. Infer values
3. Initialize useForm
4. Provide form context
5. Render existing field components
6. Submit typed values

---

### Error Handling

Validation errors must be visible at field level.

The architecture must also allow form-level/server errors without coupling
the form system to a specific API.

---

### Accessibility

Verify:

- labels
- descriptions
- error messages
- invalid state
- keyboard navigation
- submit semantics
- disabled/loading state

Use accessible queries in tests.

---

# Testing Requirements

Tests must be colocated according to repository convention.

Cover:

1. default values
2. required validation
3. invalid values
4. valid values
5. multiple errors
6. successful submission
7. invalid submission
8. async submission/loading state
9. field error rendering
10. error recovery
11. accessibility

Use Testing Library best practices.

Prefer role/label queries.

Do not test implementation details unnecessarily.

---

# Storybook

If applicable, add stories demonstrating the composition behavior.

Do not add stories for non-visual abstractions.

---

# Documentation

Document the canonical pattern future developers should use.

The documentation must answer:

- Where does the schema go?
- How is the form type derived?
- How is useForm initialized?
- How are fields composed?
- How are validation errors shown?
- How are async submissions handled?
- How are form-level errors handled?
- How should a new feature form be created?

---

# Scope Protection

Do not implement:

- BFF
- API routes
- server actions
- dynamic field arrays
- multi-step forms
- autosave
- optimistic updates
- advanced async validation

unless the repository already requires them for the existing architecture.

---

# Code Quality

Follow existing:

- naming conventions
- import ordering
- aliases
- folder structure
- Biome rules
- TypeScript strictness
- test conventions
- Storybook conventions

Avoid:

- any
- unnecessary casts
- duplicated abstractions
- dead code
- speculative utilities
- premature generalization

---

# Validation

Before finishing:

1. Run relevant tests
2. Run typecheck
3. Run lint
4. Run format/check
5. Run build if practical
6. Run Storybook checks if configured

Use actual repository commands.

Do not fabricate results.

---

# Final Response

Return a concise but complete final report containing:

## 1. Status

PASS / PARTIAL / BLOCKED

## 2. Files Changed

Created:
- ...

Modified:
- ...

## 3. Implementation

Explain what was implemented.

## 4. Architecture Decisions

Explain important decisions.

## 5. Validation

For every command:

PASS / FAIL / NOT RUN

Include relevant output/errors.

## 6. Tests

List scenarios covered.

## 7. Compliance

Confirm:

- RHF
- Zod
- type-safe values
- no controlled field state
- existing field components reused
- accessibility
- colocated tests
- Tailwind only
- no unrelated changes

## 8. Known Limitations

List deferred work.

## 9. Next Step

Recommend whether Series 3.6.5 can begin.