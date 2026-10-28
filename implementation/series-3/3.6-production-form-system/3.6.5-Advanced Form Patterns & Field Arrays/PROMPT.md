# Agent Prompt — Series 3.6.5

You are implementing:

# Series 3.6.5 — Advanced Form Patterns & Field Arrays

Act as a Senior Staff Frontend Engineer.

The repository already completed Series 3.6.4.

Your responsibility is to extend the existing form system without creating
parallel abstractions.

---

# STEP 1 — INSPECT BEFORE CODING

Do NOT start implementation immediately.

Inspect:

- AGENTS.md
- CLAUDE.md
- package.json
- Series 3.6
- Series 3.6.1
- Series 3.6.2
- Series 3.6.3
- Series 3.6.4
- useZodForm
- FormField
- existing form components
- ProfileForm
- existing tests
- Storybook
- existing exports

Understand what already exists.

---

# STEP 2 — ESTABLISH THE EXISTING CONTRACT

The existing form architecture is authoritative.

Preserve:

- React Hook Form
- Zod
- useZodForm
- existing FormField
- existing UI components
- existing type conventions
- existing test conventions

Do not replace working infrastructure.

---

# STEP 3 — FIELD ARRAYS

Implement a production-ready pattern using React Hook Form field arrays.

Use RHF's field-array API.

Required behavior:

- append
- remove
- edit
- validation
- submission

Use RHF-provided stable field identity.

Never do:

key={index}

when RHF provides a stable field id.

---

# STEP 4 — CONDITIONAL FIELDS

Implement a deterministic conditional-field pattern.

Use:

useWatch
or
watch

Do not use useState to mirror another form field.

Example:

contactMethod = email
→ email field

contactMethod = phone
→ phone field

The validation schema must agree with the conditional UI.

A hidden field must not accidentally block submission unless that behavior
is explicitly documented.

---

# STEP 5 — VALUE CLEANUP

Determine how the repository should treat values from fields that become
hidden.

Possible approaches:

- unregister
- retain
- reset

Choose one based on the existing architecture.

Document the decision.

Do not blindly apply a global shouldUnregister policy.

---

# STEP 6 — DEPENDENT FIELDS

Add a deterministic dependent-field example.

Example:

country
→ region

No API calls.

The goal is demonstrating form dependency, not data fetching.

---

# STEP 7 — VALIDATION

Use Zod.

The schema must remain the source of truth.

Validate:

- array size
- item fields
- conditional requirements
- appropriate cross-item constraints

Avoid unnecessary complex validation.

---

# STEP 8 — ACCESSIBILITY

Ensure:

- labels work
- errors work
- add buttons are accessible
- remove buttons are accessible
- dynamic fields can be keyboard-operated
- conditional fields do not leave inaccessible focus targets

Tests should use accessible queries.

---

# STEP 9 — TESTING

Write behavioral tests.

At minimum:

## Field Array

- initial render
- add
- remove
- edit
- multiple items
- invalid item
- valid submission

## Conditional

- email state
- phone state
- switching
- hidden-field behavior
- validation

## Dependent

- parent changes
- child reacts
- invalid state
- valid state

## Accessibility

- accessible add/remove controls
- accessible dynamic fields
- accessible validation errors

---

# STEP 10 — DOCUMENTATION

Document:

- field arrays
- stable identity
- conditional fields
- useWatch
- validation
- cleanup policy
- dependent fields

The documentation should be a project-specific guide, not generic RHF docs.

---

# STRICT RULES

DO NOT:

- use useState for form field values
- create a custom field-array state manager
- use array indexes as keys when stable IDs exist
- create another form abstraction layer
- add another UI library
- add API/BFF
- add server actions
- add async validation
- add autosave
- add multi-step forms
- change unrelated code

---

# VALIDATION

Inspect package.json first.

Run actual repository commands for:

- typecheck
- lint
- format/check
- tests
- build

Do not claim PASS unless the command actually passes.

---

# FINAL REPORT

Return:

1. Status
2. Files created
3. Files modified
4. Implementation summary
5. Architecture decisions
6. Field-array behavior
7. Conditional-field behavior
8. Cleanup policy
9. Tests
10. Validation commands/results
11. Known limitations
12. Recommendation for Series 3.6.6