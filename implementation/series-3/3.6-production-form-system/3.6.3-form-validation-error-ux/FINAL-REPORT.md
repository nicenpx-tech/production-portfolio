# Series 3.6.3 — Final Report

Series: 3.6.3 — Form Validation & Error UX
Branch: `feature/series-3.6.3-form-validation-error-ux`
Status: **COMPLETE**
Date: 2026-09-11

---

## 1. Commits

```
b3cda1f docs: correct total test count in 3.6.3 verification records
374162a docs: document series 3.6.3 validation and error UX
2a8975b style(web): apply Biome formatting to validation tests
ddbc199 test(web): cover validation timing, error UX, and submit behavior
13a5d43 feat(web): add deliberate validation and submit UX to form-fields
```

Diff scope: 9 files, +762 / -2. Working tree clean. `develop` untouched.

---

## 2. Changed Files

### Source code

| Path | Purpose |
|---|---|
| `apps/web/src/features/form-fields/components/FormFieldsExample.tsx` | Deliberate validation timing (`mode: "onBlur"`, `reValidateMode: "onChange"`), submitting-state submit button (`formState.isSubmitting`), form-level orientation line (`role="alert"`, only while `isSubmitted && !isValid`) |

### Tests

| Path | Purpose |
|---|---|
| `apps/web/src/features/form-fields/FormFieldsExample.test.tsx` | +8 behavioral tests: timing, min/max length, revalidation, focus, form-level message lifecycle, submitting state, switch keyboard |

### Documentation

| Path | Purpose |
|---|---|
| `implementation/series-3/3.6-production-form-system/3.6.3-form-validation-error-ux/README.md` | Validation architecture, timing rationale, error UX, out-of-scope |
| `implementation/.../3.6.3-.../TASK.md` | Task breakdown |
| `implementation/.../3.6.3-.../CHECKLIST.md` | Definition of done (all items evidence-backed) |
| `implementation/.../3.6.3-.../PROMPT.md` | Reusable agent prompt |
| `implementation/.../3.6.3-.../REVIEW.md` | Review Q&A + verification results + limitations |
| `AGENTS.md` | New durable section 90: Validation & Error UX Rules |
| `HANDOFF.md` | 3.6.3 completion record |

### Configuration / Dependencies

None changed.

---

## 3. Dependencies

Added: None. Changed: None. Removed: None.

(diff touches no `package.json` or lockfile)

---

## 4. Validation Architecture

- **Zod (v4) is the single business validation source of truth** — the
  existing `form-fields.schema.ts` is reused unchanged; no rules are
  duplicated into components, utilities, or HTML attributes
  (inputs intentionally have no `maxLength`).
- **Resolver**: `zodResolver(formFieldsSchema)` (pre-existing).
- **RHF configuration (new, deliberate)**:

  ```ts
  useForm<FormFieldsValues>({
    resolver: zodResolver(formFieldsSchema),
    mode: "onBlur",            // do not interrupt typing
    reValidateMode: "onChange", // clear errors as soon as corrected
    defaultValues: { ... },     // every controlled field explicit
  });
  ```

- **criteriaMode**: not configured (RHF default `firstError`).
- **Submit**: invalid submit is prevented, values are retained,
  validated values are passed to `onSubmit`.
- **Revalidation**: after the first submit, errors clear on change
  with no blur or second submit required.

Rationale: `onBlur` avoids shouting at the user mid-typing;
`onChange` revalidation gives instant recovery feedback after the
first submit attempt.

---

## 5. Error UX

- **Field errors**: rendered through the existing shared `FormMessage`
  (`role="alert"`). One error source per field; no second error
  system was created.
- **Messages**: specific and actionable, e.g. "Name must be at least
  2 characters.", "Please select a country." No raw Zod structures.
- **Invalid state**: `aria-invalid` + `aria-describedby` via the
  3.6.1 `FormControl` wiring (pre-existing, re-verified).
- **Recovery**: errors clear on change after failed submit; the
  form-level line disappears once the form validates.
- **Submit validation**: invalid submit blocked; focus moves to the
  first invalid field via RHF `shouldFocusError` (no custom focus
  abstraction).
- **Submitting state**: button disabled + relabelled "Submitting…"
  from `formState.isSubmitting`; no local loading state.
- **Success**: local `<output role="status">` via
  `isSubmitSuccessful` (unchanged from 3.6.2).
- **Form-level UX**: one orientation line ("Please correct the
  highlighted fields and try again.") while `isSubmitted && !isValid`.

**Intentionally NOT implemented** (documented decisions):
- error summary list (six-field form; field errors suffice)
- server errors / server validation / BFF submission
- custom focus-management or validation-framework abstractions

---

## 6. Field Validation

| Field | Schema rule | Error appears | Recovery |
|---|---|---|---|
| name | trim, min 2, max 100 | on blur / submit | clears on change post-submit (tested) |
| message | trim, min 10, max 1000 | on blur / submit | same mechanism (min tested) |
| country | min 1 | on submit | clears on selection (tested) |
| terms | boolean refine `=== true` | on submit | clears on check (tested) |
| plan | min 1 | on submit | clears on selection (tested) |
| notifications | boolean | never fails (optional) | n/a |

---

## 7. Accessibility

**Implemented and tested:**
- accessible labels / accessible names for all six fields
  (`getByLabelText`, `toHaveAccessibleName`)
- control IDs injected by `FormControl`
- `aria-invalid` on name + select (asserted via `toBeInvalid()`)
- `aria-describedby` references description + message IDs; every
  referenced ID asserted to exist
- `role="radiogroup"` named via `aria-label="Plan"`
- keyboard: checkbox via space, switch via space (tested); failed
  submit focuses first invalid field (`toHaveFocus`)
- radio single-selection behavior

**Implemented but not directly tested:**
- `aria-invalid` on checkbox/switch inputs (same injection path,
  not asserted per-control)
- compiled-CSS error styling (`aria-invalid:` / `peer-aria-invalid:`
  variants) — jsdom verifies ARIA state, not generated CSS
- native select/radio arrow-key navigation (browser-native behavior,
  not reproducible in jsdom)

---

## 8. Tests

17 tests in `form-fields` (9 from 3.6.2 + 8 new), 4 in
`form-foundation` — **21 total, all passing**.

| Required area | Status | Covered by |
|---|---|---|
| Empty submission | PASS | 3.6.2 test (5 required messages) |
| Required validation | PASS | 3.6.2 tests |
| Minimum length | PASS | new ("A" / "short" via blur) |
| Maximum length | PASS | new (101 / 1001 chars via blur) |
| Checkbox validation | PASS | 3.6.2 test |
| Select validation | PASS | 3.6.2 test |
| Plan validation | PASS | 3.6.2 test |
| Revalidation | PASS | new (clears while typing post-submit) |
| Successful submission | PASS | 3.6.2 test (exact values to spy) |
| Accessibility | PASS | 3.6.2 + new focus/keyboard tests |
| Submitting state | PASS | new (deferred-promise async submit) |
| Validation timing (onBlur) | PASS | new (silent while typing) |
| Focus behavior | PASS | new (first invalid + value retention) |
| Form-level message | PASS | new (appears / disappears) |
| Switch keyboard | PASS | new |

Not implemented (with reason):
- radio arrow-key navigation test — jsdom does not emulate the
  browser-native radio-group behavior
- separate schema unit tests — component tests already cover the
  rules; no schema-only test convention exists in the repo

---

## 9. Verification

All commands executed on final HEAD `b3cda1f`:

| Check | Result | Command |
|---|---|---|
| Typecheck | **PASS** | `bun run typecheck` |
| Biome | **PASS** | `bun run lint` (one mid-series format diff fixed, then clean) |
| Tests | **PASS** | `bun run test` → 21 passed (21) |
| Build | **PASS** | `bun run build` → compiled, `/[locale]/form-fields` generated |

---

## 10. Known Issues

1. *(pre-existing, unrelated)* Biome lint only covers `apps/web` — the
   only workspace with a lint script; `packages/ui` is not linted.
2. *(pre-existing, unrelated)* `@repo/ui` root barrel type errors
   (documented since 3.6.1; consumers use the `@repo/ui/components`
   subpath).
3. *(test note)* max-length test takes ~1.7s (types ~1100 chars) —
   deterministic, intentional real-user simulation.
4. *(UX trade-off, documented)* an invalid submit announces the
   form-level line plus each field message (multiple `role="alert"`);
   standard field-level pattern, revisit if noisy.
5. *(coverage gap, documented)* disabled state and compiled-CSS error
   styling are not runtime-verified.

---

## 11. Scope Check

Confirmed within scope. The diff contains **no**: API integration,
BFF, backend validation, TanStack Query mutation, autosave, draft
persistence, multi-step forms, `useFieldArray`, dependent fields,
async validation, file upload, DatePicker, Combobox, OTP, rich text
editor, or form persistence. No new dependencies. No wrapper
abstractions. Commits made on the feature branch as requested.

---

## 12. Completion Checklist

```
[PASS] Repository inspected before implementation
[PASS] Series 3.6.1 preserved
[PASS] Series 3.6.2 preserved
[PASS] Zod validation implemented
[PASS] RHF validation integration implemented
[PASS] Field-level error UX implemented
[PASS] Revalidation implemented
[PASS] Accessibility behavior verified
[PASS] Tests added/updated
[PASS] Documentation updated
[PASS] Verification executed
[PASS] No unintended scope expansion
```

---

## 13. Next Series

**Series 3.6.4** — not implemented; no files touched for it.
The branch is ready for review / merge into `develop`.
