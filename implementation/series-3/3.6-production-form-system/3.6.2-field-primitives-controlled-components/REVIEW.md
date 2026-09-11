# Review

## Architecture

Is the Series 3.6.1 foundation preserved?

YES (form.tsx, Input.tsx, Label.tsx unchanged; only new files and the
components/forms barrel were touched)

---

Are Form primitives free of business schemas?

YES (schemas live in apps/web/src/features/form-fields/schemas/)

---

Is Zod the single validation source of truth?

YES

---

Are the two integration rules applied correctly?

YES

- Input, Textarea, native Select: standard input contract, RHF field
  spread ({...field})
- Checkbox, Switch: checked={field.value} + onCheckedChange={field.onChange}
- RadioGroup: value={field.value} + onValueChange={field.onChange}

register() is not forced onto controlled components.

---

Are explicit defaultValues used for every controlled field?

YES (name, message, country, terms, plan, notifications)

---

Is page.tsx composition-only?

YES

---

Does any form call the Go backend directly?

NO (local submission only; BFF arrives in a later series)

---

Is there field-level useState?

NO

---

Were wrapper abstractions (FormInput/FormSelect/...) created?

NO (FormField + bare primitives only)

---

Were new dependencies added?

NO (existing react-hook-form, zod, @hookform/resolvers reused; native
elements used instead of new Radix dependencies)

---

## Component Decisions

Why bare primitives in components/forms instead of reusing the legacy
packages/ui/src/forms/ components?

The legacy components are self-contained: they render their own
label/error markup, wrap the control in divs, and predate the Series
3.6.1 composition architecture. They cannot reliably receive the
FormControl id/ARIA injection. The new primitives are bare and
composition-based, consistent with the 3.6.1 Input/Label conventions.

Why native elements instead of Radix?

The repository has no Radix dependency. Native inputs keep the real
control in the accessibility tree, support keyboard interaction, and
are directly testable in jsdom — the simplest correct approach.

---

## Accessibility

Are labels associated with controls through htmlFor?

YES (FormControl injects the id onto the real input; tests verify
getByLabelText/toHaveAccessibleName for all six fields)

---

Do invalid fields expose aria-invalid="true"?

YES (verified for Input and Select; Checkbox/Switch/RadioGroupItem
inputs receive the same injection)

---

Are descriptions and messages linked through aria-describedby?

YES (verified: describedby references description + message ids)

---

Is the RadioGroup named and keyboard operable?

YES (role="radiogroup" + aria-label="Plan"; items share the RHF field
name so the browser provides arrow-key navigation; checkbox toggles
via space — verified by test)

---

## Verification

bun run typecheck

PASS

---

bun run lint

PASS (Biome check, apps/web)

---

bun run test

PASS (13 tests: 4 form-foundation + 9 form-fields)

---

bun run build

PASS ([locale]/form-fields route generated)

---

## Known Limitations

- Biome lint only covers apps/web (the only workspace with a lint
  script); packages/ui files follow the existing tab-indentation style
  but are not linted by automation.

- The visual error styling of Checkbox/Switch/RadioGroupItem relies on
  peer-aria-invalid variants rendered by Tailwind; jsdom tests verify
  the ARIA state but not the compiled CSS. Styling should be confirmed
  visually (Storybook/route) in a UI hardening pass.

- Disabled state is supported through prop pass-through and
  disabled:/peer-disabled: styles but is not exercised by a runtime
  test (the example has no disabled control).

- The @repo/ui root barrel still contains the pre-existing type errors
  documented in Series 3.6.1; consumers import through the
  @repo/ui/components subpath export.

---

Overall Score

★★★★★
