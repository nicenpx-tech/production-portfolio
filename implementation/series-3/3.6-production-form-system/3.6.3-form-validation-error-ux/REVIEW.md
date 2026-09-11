# Review

## Architecture

Is Zod still the single business validation source of truth?

YES (no rules duplicated into components or utilities)

---

Is validation timing deliberate and documented?

YES (mode: "onBlur", reValidateMode: "onChange" — rationale in the
component and README: do not interrupt typing; clear errors the moment
a correction becomes valid)

---

Does the form own a second error system?

NO (field errors stay in FormMessage; the form-level line is
orientation only and does not repeat field messages)

---

Is there unnecessary abstraction (ValidationEngine, FormErrorSystem)?

NO (configuration plus two small pieces of view logic only)

---

Is RHF state used instead of local state everywhere?

YES (errors, isSubmitted, isValid, isSubmitting all come from
formState; no local loading/error flags)

---

## Error UX

Does an invalid submit clear or reset values?

NO (tested: corrected values are retained across submits)

---

Does the failed submit guide the user?

YES (RHF shouldFocusError focuses the first invalid field; verified
for the name input and, after correcting it, the message textarea)

---

Is the submitting state handled?

YES (button disabled and relabelled "Submitting…" from
formState.isSubmitting; restored after the promise settles)

---

Is the form-level message removed on recovery?

YES (only rendered while isSubmitted && !isValid; verified to
disappear after a valid submit)

---

## Accessibility

Is the error association intact?

YES (aria-invalid + aria-describedby via the 3.6.1 FormControl wiring;
existing tests extended, not replaced)

---

Are duplicate announcements avoided?

Field errors use one role="alert" message per field; the form-level
line is a distinct orientation message, not a duplicate. Accepted
trade-off: an invalid submit announces the form line plus each field
message (standard field-level error pattern).

---

Are the controls keyboard operable?

YES (checkbox and switch via space are tested; radio items and the
native select remain native keyboard controls)

---

## Verification

bun run typecheck

PASS

---

bun run lint

PASS (one formatting diff fixed, then clean)

---

bun run test

PASS (17 form-fields tests: 9 from 3.6.2 + 8 new; 13 total workspace
tests including 3.6.1)

---

bun run build

PASS ([locale]/form-fields route generated)

---

## Known Limitations

- An invalid submit announces the form-level line and every field
  message (multiple role="alert" elements). This matches the standard
  field-level pattern; if it proves noisy, the form line can drop
  role="alert" in a future UX pass.

- Focus falls to the first invalid field with an attached ref. The
  plan RadioGroup intentionally does not forward field.ref (the group
  div is not a meaningful focus target); name/message/country/terms/
  notifications all carry refs, so realistic flows are covered.

- The maximum-length test types ~1100 characters and is the slowest
  test (~1.7s). Still deterministic; left as a real user-behavior test.

- Server validation, server errors, and BFF submission are explicitly
  out of scope and arrive in a later series.

---

Overall Score

★★★★★
