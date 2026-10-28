# Series 3.6.5 — Implementation Checklist

## A. Repository Inspection

- [ ] Read AGENTS.md
- [ ] Read CLAUDE.md / project instructions
- [ ] Inspect package.json
- [ ] Inspect Series 3.6
- [ ] Inspect Series 3.6.1
- [ ] Inspect Series 3.6.2
- [ ] Inspect Series 3.6.3
- [ ] Inspect Series 3.6.4
- [ ] Inspect useZodForm
- [ ] Inspect FormField
- [ ] Inspect ProfileForm
- [ ] Inspect existing tests
- [ ] Inspect Storybook

---

# B. Field Arrays

- [ ] RHF field-array API used
- [ ] Add item works
- [ ] Remove item works
- [ ] Edit item works
- [ ] Multiple items work
- [ ] Stable field identity used
- [ ] No index-based React keys where stable ID exists
- [ ] Minimum array validation
- [ ] Maximum array validation where applicable
- [ ] Item validation
- [ ] Array submission works

---

# C. Conditional Fields

- [ ] Conditional field rendering
- [ ] useWatch/watch used
- [ ] No mirrored useState
- [ ] Correct field shown
- [ ] Incorrect field hidden
- [ ] Conditional validation
- [ ] Hidden field behavior documented
- [ ] Switching condition works

---

# D. Dependent Fields

- [ ] Parent field implemented
- [ ] Dependent field reacts
- [ ] Invalid dependent state handled
- [ ] Valid dependent state handled
- [ ] No API dependency
- [ ] No duplicated state

---

# E. Value Cleanup

- [ ] Cleanup strategy selected
- [ ] unregister/retain/reset behavior documented
- [ ] Behavior tested
- [ ] No accidental stale values
- [ ] No unintended global behavior

---

# F. Accessibility

- [ ] Labels associated
- [ ] Add button accessible
- [ ] Remove button accessible
- [ ] Dynamic fields accessible
- [ ] Validation errors accessible
- [ ] Keyboard interaction works
- [ ] Conditional fields do not leave inaccessible focus targets

---

# G. Testing

- [ ] Initial field-array rendering
- [ ] Add test
- [ ] Remove test
- [ ] Edit test
- [ ] Multiple-item test
- [ ] Item validation test
- [ ] Array validation test
- [ ] Conditional email test
- [ ] Conditional phone test
- [ ] Conditional switching test
- [ ] Hidden-field behavior test
- [ ] Dependent-field test
- [ ] Valid submission test
- [ ] Invalid submission test
- [ ] Accessibility tests

---

# H. Documentation

- [ ] Field arrays documented
- [ ] Stable identity documented
- [ ] Conditional fields documented
- [ ] useWatch/watch documented
- [ ] Validation documented
- [ ] Cleanup policy documented
- [ ] Dependent fields documented
- [ ] Canonical example documented

---

# I. Code Quality

- [ ] TypeScript strict
- [ ] No any
- [ ] No unnecessary casts
- [ ] No useState for field values
- [ ] No duplicated types
- [ ] No duplicate form abstraction
- [ ] Existing aliases used
- [ ] Existing naming conventions used
- [ ] Biome passes
- [ ] Tailwind only
- [ ] No unrelated changes

---

# J. Validation

- [ ] Typecheck
- [ ] Lint
- [ ] Format/check
- [ ] Unit tests
- [ ] Build
- [ ] Storybook if applicable

Record actual results.

---

# K. Final Report

- [ ] Status
- [ ] Files created
- [ ] Files modified
- [ ] Architecture decisions
- [ ] Field-array behavior
- [ ] Conditional behavior
- [ ] Cleanup behavior
- [ ] Tests
- [ ] Validation results
- [ ] Known limitations
- [ ] Series 3.6.6 recommendation