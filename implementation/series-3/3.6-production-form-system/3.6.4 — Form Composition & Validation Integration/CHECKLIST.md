# Series 3.6.4 — Implementation Checklist

## A. Repository Inspection

- [ ] Read agents.md
- [ ] Read CLAUDE.md / project instructions
- [ ] Inspect monorepo structure
- [ ] Inspect package.json
- [ ] Inspect Series 3.6
- [ ] Inspect Series 3.6.1
- [ ] Inspect Series 3.6.2
- [ ] Inspect Series 3.6.3
- [ ] Inspect existing Form Foundation
- [ ] Inspect existing Field Components
- [ ] Inspect existing validation utilities
- [ ] Inspect existing tests
- [ ] Inspect Storybook setup

---

# B. Form Architecture

- [ ] Canonical RHF integration established
- [ ] Zod schema is validation source of truth
- [ ] Form values inferred with z.infer
- [ ] No duplicated interfaces
- [ ] Form context/provider pattern established
- [ ] Existing field components reused
- [ ] Form composition is reusable
- [ ] No parallel form abstraction created

---

# C. Default Values

- [ ] Default values supported
- [ ] Optional fields handled
- [ ] Nullable fields handled where required
- [ ] Edit-form values can be initialized
- [ ] Generic infrastructure does not contain business defaults

---

# D. Validation

- [ ] Required validation
- [ ] String validation
- [ ] Number validation
- [ ] Boolean validation
- [ ] Enum validation where applicable
- [ ] Multiple validation errors
- [ ] Cross-field validation where appropriate
- [ ] Validation errors reach field UI

---

# E. Submission

- [ ] Valid form submits
- [ ] Invalid form does not submit
- [ ] Submit handler receives typed values
- [ ] Async submission supported
- [ ] Loading/submitting state supported
- [ ] Successful submission handled
- [ ] Form-level error supported
- [ ] Server/async error does not corrupt field state

---

# F. Accessibility

- [ ] Labels associated with fields
- [ ] Descriptions associated where applicable
- [ ] Errors associated with fields
- [ ] Invalid state exposed
- [ ] Keyboard navigation works
- [ ] Submit button semantics correct
- [ ] Disabled/loading state accessible

---

# G. Testing

- [ ] Form rendering test
- [ ] Default value test
- [ ] Required validation test
- [ ] Invalid value test
- [ ] Valid value test
- [ ] Multiple error test
- [ ] Successful submission test
- [ ] Invalid submission test
- [ ] Async submission test
- [ ] Error rendering test
- [ ] Error recovery test
- [ ] Accessibility query test

---

# H. Storybook

- [ ] Basic form story
- [ ] Validation story
- [ ] Multiple fields story
- [ ] Loading/submitting story
- [ ] Error state story
- [ ] No unnecessary infrastructure-only stories

---

# I. Documentation

- [ ] Schema pattern documented
- [ ] z.infer pattern documented
- [ ] useForm initialization documented
- [ ] Form composition documented
- [ ] Validation behavior documented
- [ ] Submission lifecycle documented
- [ ] Error handling documented
- [ ] New-form creation workflow documented

---

# J. Code Quality

- [ ] TypeScript strict
- [ ] No any
- [ ] No unnecessary type assertions
- [ ] No field useState
- [ ] No duplicated validation logic
- [ ] No duplicate component hierarchy
- [ ] Existing aliases used
- [ ] Existing naming conventions followed
- [ ] Biome passes
- [ ] Tailwind only
- [ ] No unrelated changes

---

# K. Validation Commands

- [ ] Unit tests
- [ ] Typecheck
- [ ] Lint
- [ ] Format/check
- [ ] Build
- [ ] Storybook validation if configured

Record actual results.

---

# L. Final Report

- [ ] Status
- [ ] Files created
- [ ] Files modified
- [ ] Architecture decisions
- [ ] Test coverage
- [ ] Validation results
- [ ] Architecture compliance
- [ ] Known limitations
- [ ] Recommendation for Series 3.6.5