# Task 1

Audit the existing validation behavior.

- Series 3.6.1 Form accessibility architecture (aria-invalid,
  aria-describedby, role="alert")
- Series 3.6.2 form-fields feature, schema, and tests
- installed Zod version and resolver configuration
- RHF defaults in place (mode/reValidateMode unset)

Do not duplicate working infrastructure.

---

# Task 2

Configure deliberate validation timing in FormFieldsExample.

- mode: "onBlur" (no mid-typing errors)
- reValidateMode: "onChange" (errors clear while correcting after a
  failed submit)
- document why this behavior was chosen

---

# Task 3

Add form-level error UX.

- one orientation line (role="alert") shown only while
  isSubmitted && !isValid
- it must point to field errors, not duplicate them
- removed once the form validates
- no error summary list unless justified (not justified here)

---

# Task 4

Submit behavior.

- invalid submit is prevented; entered values are retained
- failed submit focuses the first invalid field through the existing
  RHF shouldFocusError behavior; no custom focus abstraction
- submit button reflects formState.isSubmitting (disabled + label
  swap); no local loading state
- success state unchanged (local <output>, no API)

---

# Task 5

Extend the colocated tests.

- no errors while typing before first blur/submit (mode onBlur)
- minimum length errors (name < 2, message < 10)
- maximum length rejections (name > 100, message > 1000)
- revalidation clears the name error on change after a failed submit
- focus moves to the first invalid field; valid values retained
- form-level message appears when invalid and disappears when valid
- submit button disabled/relabelled during an async submission
- switch keyboard operability

---

# Task 6

Verify.

- bun run typecheck
- bun run lint
- bun run test
- bun run build

All pass.

---

# Task 7

Update documentation.

- 3.6.3 implementation docs
- AGENTS.md validation/error UX rules
- HANDOFF.md
