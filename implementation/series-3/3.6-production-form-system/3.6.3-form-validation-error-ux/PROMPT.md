You are the Web Agent for the Production Portfolio Starter Kit.

Implement Series 3.6.3 — Form Validation & Error UX.

Requirements

- Next.js 16 App Router

- React 19

- TypeScript

- Bun Workspaces

- Turborepo

- Tailwind v4

- Biome

Implementation Rules

- Build on Series 3.6.1/3.6.2; do not redesign the foundation

- Zod + zodResolver is the single validation source of truth

- Do not duplicate validation logic in components

- Choose mode/reValidateMode deliberately and document why

- Field errors render through FormMessage; one error source per field

- Keep form-level messaging minimal; do not duplicate field errors

- No error summary unless it clearly adds value

- RHF owns form state (errors, submitting); no local duplicates

- Failed submit must not clear values; focus the first invalid field

  through the existing RHF behavior

- Submit button reflects formState.isSubmitting

- Local submission only; no API/BFF/server validation

- No validation framework abstractions

- Tests colocated and behavioral; extend the existing form-fields

  tests (timing, min/max, revalidation, focus, submitting state)

Deliverables

- Validation configuration with documented rationale

- Form-level error UX

- Submit behavior and submitting state

- Extended colocated tests

- Created files

- Modified files

- Summary

Validation

Run

bun run typecheck

bun run lint

bun run test

bun run build

All commands must pass.
