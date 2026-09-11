# Series 3.6.4 — Final Report

Series: 3.6.4 — Form Composition & Validation Integration
Branch: `feature/series-3.6.4-form-composition`
Status: **COMPLETE**
Date: 2026-09-11

---

## 1. Commits

```
docs: document series 3.6.4 form composition (this commit)
3aed44c feat(web): add profile feature demonstrating composed form composition
1954b46 feat(web): add shared form composition layer with useZodForm and FormRootError
```

Note: the colocated `ProfileForm.test.tsx` landed with the feature
commit (tests colocated with the feature they cover). Working tree
clean; `develop` untouched.

---

## 2. Changed Files

### Source code

| Path | Purpose |
|---|---|
| `apps/web/src/shared/forms/useZodForm.ts` | Canonical form factory: zodResolver + §90 timing defaults, form state typed by schema input, submit handlers typed by schema output |
| `apps/web/src/shared/forms/index.ts` | Public barrel for the shared composition module |
| `packages/ui/src/components/forms/FormRootError.tsx` | Form-level `role="alert"` presentation of `errors.root`; renders nothing while absent |
| `packages/ui/src/components/forms/form.tsx` | `FormField` forwards `TTransformedValues` (non-breaking generic addition) |
| `packages/ui/src/components/forms/index.ts` | Export `FormRootError` |
| `apps/web/src/features/profile/schemas/profile.schema.ts` | Validation + input→output transform (string → number), cross-field refine targeting `contactEmail` |
| `apps/web/src/features/profile/components/ProfileForm.tsx` | Composed form: `useZodForm`, controlled-field mapping, root-error lifecycle, edit-form defaults |
| `apps/web/src/features/profile/index.ts` | Feature public API |
| `apps/web/src/app/[locale]/profile/page.tsx` | Composition-only route |

### Tests

| Path | Purpose |
|---|---|
| `apps/web/src/features/profile/ProfileForm.test.tsx` | 13 behavioral tests: accessible rendering, edit defaults, multi-error submit, blocked invalid submit, per-field rejections, onBlur timing, change recovery, transformed submit values, pending state, server-failure root error with retained values, recovery on resubmit, cross-field rule lifecycle, assistive-tech wiring |

### Documentation

| Path | Purpose |
|---|---|
| `implementation/series-3/3.6-production-form-system/3.6.4 — Form Composition & Validation Integration/README.md` | Composition architecture, canonical recipe, submission lifecycle, scope |
| `implementation/.../3.6.4-.../TASK.md`, `CHECKLIST.md`, `PROMPT.md` | Series planning docs (committed with the series) |
| `AGENTS.md` | New durable section 91: Form Composition Rules |
| `HANDOFF.md` | 3.6.4 completion record |

### Configuration / Dependencies

None changed. (Diff touches no `package.json` or lockfile.)

---

## 3. Dependencies

Added: None. Changed: None. Removed: None.

---

## 4. Composition Architecture

- **`useZodForm`** is the single place a feature form becomes a form:
  `resolver: zodResolver(schema)`, `mode: "onBlur"`,
  `reValidateMode: "onChange"`, RHF-default `criteriaMode`.
  Typing: `UseFormReturn<z.input<S>, unknown, z.output<S>>`.
- **Split by dependency direction**: presentation of form state stays
  in `@repo/ui` (`FormRootError`); validation glue (Zod + resolvers)
  stays app-side in `apps/web/src/shared/forms/` so the UI package
  does not gain a Zod dependency.
- **`FormField`** now forwards `TTransformedValues` so transformed
  schemas keep their typing on field state; defaults preserve the old
  two-generic behavior for existing call sites.
- **Defaults**: `DefaultValues`-shaped (enum starts `undefined` →
  placeholder option); empty-create defaults live in the feature;
  edit forms pass pre-filled `defaultValues` props.

---

## 5. Submission & Error Lifecycle

- Invalid submit: blocked, values retained, focus to first invalid
  field (RHF `shouldFocusError`, pre-existing).
- Valid submit: fully transformed values reach `onSubmit`
  (`experienceYears: 5`, a number — verified in tests).
- Pending: button disabled + "Saving…" from `isSubmitting`.
- Server failure: `setError("root", …)`; `FormRootError` shows one
  `role="alert"` line; field values untouched; no success output.
- Recovery: root errors clear on the next submit attempt; success
  requires `isSubmitSuccessful && !errors.root` (catching the failure
  resolves the submit promise, so `isSubmitSuccessful` alone lies).
- Cross-field: object refinement runs only after field checks pass;
  issue is attached to `contactEmail` via `path` so it renders in the
  field's own `FormMessage`.

**Intentionally NOT implemented** (documented decisions):
- Storybook stories for app-level forms (Storybook covers
  `packages/ui` legacy components only; app-side setup is separate
  infrastructure)
- `FormActions`/field-wrapper abstractions (AGENTS.md §72, §89)
- BFF submission and real server validation (later series)

---

## 6. Verification

| Check | Command | Result |
|---|---|---|
| Typecheck | `bun run typecheck` | PASS |
| Lint/format | `bun run lint` (Biome) | PASS |
| Tests | `bun run test` | PASS — 34/34 (4 foundation + 17 fields + 13 profile) |
| Build | `bun run build` | PASS — `/[locale]/profile` in route manifest |

Not run: Storybook (not applicable — see scope above); E2E (no E2E
harness exists yet).

---

## 7. Known Limitations / Follow-ups

- Real server errors arrive with the BFF series; the current root
  error is driven by `onSubmit` rejection.
- `apps/web/src/shared/forms/` is a new convention; other app-wide
  composition glue should follow it rather than ad-hoc directories.
- The number-input invalid_type branch ("Experience must be a
  number.") is unreachable through sanitized number inputs but stays
  as the schema guard for programmatic/API values.
