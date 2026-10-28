# Series 3.6.5 — Advanced Form Patterns & Field Arrays

## Objective

Extend the Production Form System established in Series 3.6.1–3.6.4
to support advanced but reusable form patterns.

This series focuses on:

- dynamic field arrays
- repeated form sections
- conditional fields
- dependent fields
- reusable field-array composition
- stable field identity
- validation of dynamic fields
- accessibility for dynamic fields
- testing dynamic form behavior

The implementation must build on the existing:

- React Hook Form
- Zod
- useZodForm
- Form Foundation
- Form Field Components
- Form composition conventions
- TypeScript patterns
- testing conventions

Do NOT create another form abstraction layer.

---

# 1. Prerequisite

Before implementation inspect:

1. Series 3.6
2. Series 3.6.1
3. Series 3.6.2
4. Series 3.6.3
5. Series 3.6.4
6. useZodForm
7. FormField
8. existing field components
9. existing validation utilities
10. existing ProfileForm example
11. existing tests
12. existing AGENTS.md / project instructions
13. existing Storybook setup

The current implementation is the source of truth.

Do not assume filenames or APIs.

---

# 2. Scope

## 3.6.5.1 Dynamic Field Arrays

Establish the canonical pattern for repeated form data using
React Hook Form's field-array capabilities.

The pattern must support:

- add item
- remove item
- edit item
- multiple items
- minimum item validation
- maximum item validation where appropriate
- per-item validation
- stable item identity

Prefer React Hook Form's native field-array primitives.

Do not create a custom array-state system.

---

## 3.6.5.2 Reusable Field Array Composition

If the existing architecture benefits from a reusable component,
introduce the smallest abstraction required.

Potential conceptual pattern:

Form
└── Field Array
    ├── Item
    │   ├── Field
    │   └── Remove
    └── Add

The exact API must follow repository conventions.

Do not create abstractions merely to wrap one line of React Hook Form code.

---

## 3.6.5.3 Stable Field Identity

Dynamic fields must use the identity supplied by React Hook Form's
field-array implementation.

Do NOT use array indexes as React keys when a stable field identifier
is available.

This must be verified in code review and tests where practical.

---

## 3.6.5.4 Dynamic Validation

Zod schemas must validate dynamic collections.

Cover appropriate rules such as:

- array minimum length
- array maximum length
- required item fields
- item-level validation
- duplicate detection where appropriate
- cross-item validation where appropriate

Do not introduce business-specific validation into shared infrastructure.

---

## 3.6.5.5 Conditional Fields

Establish a predictable pattern for fields that appear based on other
field values.

Example:

contactMethod = "email"
→ email field shown

contactMethod = "phone"
→ phone field shown

Requirements:

- conditional rendering
- validation matches visible state
- hidden fields do not incorrectly block submission
- values are handled predictably
- useWatch/watch should be preferred over manually duplicating field state

Do not use useState to mirror form field values.

---

## 3.6.5.6 Dependent Fields

Demonstrate a dependent-field pattern where one field determines the
available/valid state of another.

Example:

country
→ available region options

The example must remain local and deterministic.

Do not add API calls in this series.

---

## 3.6.5.7 Reset/Cleanup Behavior

When conditional fields disappear, establish the intended behavior for
their values.

Determine whether the canonical pattern should:

- unregister hidden values
- retain hidden values
- explicitly reset hidden values

Choose based on the existing architecture and document the decision.

Do not apply a global behavior without evaluating existing forms.

---

# 3.6.5.8 Accessibility

Dynamic form sections must remain accessible.

Verify:

- labels remain associated
- add/remove controls have meaningful accessible names
- dynamically added fields are keyboard accessible
- removed fields disappear from the accessibility tree
- validation errors remain associated
- conditional fields do not create inaccessible focus behavior

---

# 3.6.5.9 Testing

Add behavioral tests covering:

### Field Arrays

- initial items
- add item
- remove item
- edit item
- multiple items
- minimum length validation
- item validation
- valid submission
- invalid submission

### Conditional Fields

- correct field appears
- incorrect field is hidden
- hidden field does not incorrectly fail validation
- switching condition works
- values behave according to documented cleanup policy

### Dependent Fields

- dependent field reacts to parent value
- invalid dependent state is handled
- valid state submits correctly

### Accessibility

- add/remove controls accessible
- dynamic fields accessible
- errors accessible

Prefer Testing Library user-oriented tests.

---

# 3. Example Feature

Create or extend a generic demonstration feature.

Preferred example:

Profile / Contact methods

Example:

Contact methods:
- Email
- Phone

Users can:

- add contact method
- remove contact method
- select contact type
- enter corresponding value

The example must demonstrate:

- field array
- conditional fields
- validation
- submission

Keep business logic minimal.

Do not introduce XSpring/trading-specific behavior.

---

# 4. Architecture Constraints

DO NOT:

- create custom array state with useState
- create another form library
- duplicate validation types
- use array indexes as React keys when stable IDs exist
- introduce API calls
- introduce BFF integration
- introduce server actions
- introduce global form state
- create a generic abstraction without a real reuse case
- modify unrelated features
- introduce another UI library

---

# 5. Type Safety

The form schema remains the source of truth.

Use:

z.infer
or
z.input / z.output

according to the existing useZodForm pattern.

Dynamic item types must be derived from the schema.

Avoid:

- any
- manual duplicate interfaces
- unsafe casts

---

# 6. Documentation

Update the form-system documentation with:

## Field Arrays

- when to use
- canonical implementation pattern
- add/remove behavior
- stable identity
- validation

## Conditional Fields

- useWatch/watch pattern
- conditional rendering
- validation
- cleanup/unregister policy

## Dependent Fields

- dependency pattern
- deterministic example
- avoiding duplicated state

Include a small canonical example.

---

# 7. Validation Commands

Inspect package.json and use repository-defined commands.

At minimum run:

- typecheck
- lint
- format/check
- tests
- build where practical

Storybook only if applicable to the changed components.

Do not fabricate results.

---

# 8. Scope Boundary

Do NOT implement:

- server/API-backed dependent fields
- async validation
- autosave
- multi-step forms
- wizard state
- BFF integration
- optimistic updates
- complex form persistence

Those belong to future series.

---

# 9. Final Report

Return:

## Status

PASS / PARTIAL / BLOCKED

## Files Created

...

## Files Modified

...

## Implementation Summary

...

## Architecture Decisions

...

## Field Array Behavior

...

## Conditional Field Behavior

...

## Cleanup / Unregister Decision

...

## Tests

...

## Validation

- typecheck
- lint
- format
- tests
- build
- Storybook if applicable

## Compliance

Confirm:

- RHF
- Zod
- useZodForm
- no mirrored field state
- stable field identity
- accessible dynamic fields
- colocated tests
- Tailwind only
- no unrelated changes

## Known Limitations

...

## Recommendation

State whether Series 3.6.6 can begin.