AGENTS.md

Production Portfolio Starter Kit

This repository is a production-grade portfolio starter kit designed to demonstrate real-world software engineering practices across:

* Frontend
* Backend
* Database
* API design
* Architecture
* Authentication
* Design system
* Testing
* DevOps
* Observability
* Documentation

The repository is intentionally structured as a monorepo and should demonstrate maintainable production patterns rather than one-off demo implementations.

⸻

1. Agent Operating Rules

1.1 Read Before Editing

Before modifying code:

1. Inspect the relevant directory structure.
2. Read the target file completely.
3. Read the closest applicable AGENTS.md.
4. Inspect related types, components, utilities, tests, and call sites.
5. Identify existing patterns before introducing a new one.
6. Make the smallest change that satisfies the requirement.

Do not modify code based only on the user’s description if the repository can answer the question.

Do not assume an API, component, utility, hook, type, or configuration exists. Search first.

⸻

1.2 Scope Control

Only modify files required for the task.

Do not:

* perform unrelated refactors
* rename unrelated files
* change architecture without a reason
* introduce speculative abstractions
* add dependencies without justification
* rewrite working code merely because another pattern is preferred
* change formatting across unrelated files
* modify generated files manually

If an architectural change is required, explain the reason before implementing it.

⸻

1.3 Existing Patterns Win

When implementing a new feature:

1. Search for an existing equivalent.
2. Follow the established pattern.
3. Reuse existing primitives.
4. Extend an abstraction only when multiple real use cases justify it.

Do not create a new abstraction for a single use case unless there is a clear architectural reason.

⸻

2. Instruction Precedence

Instructions are layered.

Use this precedence:

1. Explicit user request
2. Closest applicable AGENTS.md
3. Root AGENTS.md
4. Existing project architecture and configuration
5. General engineering conventions

For monorepo subprojects, a nested AGENTS.md may override or extend this file.

Nested instruction files should contain only rules specific to that directory.

Do not duplicate the entire root instruction file.

⸻

3. Technology Stack

Frontend

* Next.js 16
* App Router
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* TanStack Query
* next-intl
* MDX
* Motion
* Storybook

Backend

* Go
* Gin
* sqlc
* pgx
* golang-migrate
* JWT
* Refresh Tokens
* Zap
* Viper
* Swagger / swaggo

Database

* PostgreSQL
* Neon

Infrastructure

* Vercel
* Render
* GitHub Actions
* Cloudinary
* Resend
* Umami
* Sentry

Monorepo

* Bun
* Bun Workspaces
* Turborepo
* TypeScript Project References

⸻

4. Repository Architecture

The repository is a monorepo.

Expected high-level structure:

.
├── apps/
│   ├── web/
│   ├── mobile/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   ├── design-tokens/
│   └── biome-config/
│
├── docs/
├── .github/
├── package.json
├── turbo.json
├── tsconfig.json
├── biome.json
└── AGENTS.md

The exact structure may evolve as the project grows.

Do not create directories merely because they are listed above if they are not yet required.

⸻

5. Monorepo Rules

5.1 Package Manager

Use Bun.

Do not introduce npm, yarn, or pnpm commands unless explicitly required.

Use the repository’s existing lockfile and package manager configuration.

⸻

5.2 Turborepo

Use Turborepo for orchestration of:

* build
* dev
* lint
* typecheck
* test
* Storybook
* other workspace tasks

Prefer running tasks through the workspace/task runner rather than manually entering individual package directories.

⸻

5.3 Workspace Dependencies

Use workspace packages through their @repo/* aliases.

Examples:

@repo/ui
@repo/types
@repo/config
@repo/design-tokens
@repo/biome-config

Do not duplicate shared code inside applications when it belongs in a shared package.

⸻

6. TypeScript Rules

Use strict TypeScript.

Do not weaken strictness to make code compile.

Avoid:

any

unless there is a documented and unavoidable reason.

Prefer:

unknown

with explicit narrowing.

Do not use unnecessary type assertions:

value as SomeType

Prefer type-safe inference.

⸻

6.1 Type Ownership

Types should live as close as possible to their domain.

Use:

feature-specific type
    ↓
feature
cross-feature reusable type
    ↓
packages/types

Do not put every type into packages/types.

packages/types is for genuinely shared contracts.

⸻

7. Next.js Architecture

Use the Next.js App Router.

Do not introduce Pages Router patterns.

Use:

app/

for routing and application entry points.

⸻

7.1 page.tsx

page.tsx should primarily compose the feature.

Do not place large business logic inside page.tsx.

Preferred:

page.tsx
   ↓
feature component
   ↓
hooks / services / UI

Avoid turning page.tsx into a giant implementation file.

⸻

7.2 Server vs Client Components

Prefer Server Components by default.

Use "use client" only when client-side behavior is actually required.

Client Components are appropriate for:

* browser APIs
* interactive UI
* React state
* event handlers
* client-side data fetching
* React Hook Form
* animations requiring client execution

Do not add "use client" to entire feature trees unnecessarily.

⸻

8. Next.js Proxy

This project uses the Next.js 16 proxy convention.

Use:

proxy.ts

Do not create:

middleware.ts

for new Next.js 16 routing/proxy behavior.

Export the proxy using the expected Next.js 16 convention.

Do not introduce deprecated middleware architecture into the project.

⸻

9. BFF Architecture

The frontend must use a Backend-for-Frontend architecture.

Client-side code must not call the Go backend directly.

Use:

Browser
   ↓
Next.js BFF
   ↓
Go API
   ↓
Database

Frontend API access should go through:

apps/web/app/api/

or the project’s established BFF abstraction.

Do not write:

Browser → Go API

directly.

⸻

10. API Contract Rules

API responses should be normalized at the appropriate boundary.

Backend/API contracts may use:

snake_case

while frontend domain models may use:

camelCase

Perform transformation at the API/BFF boundary.

Do not spread snake_case-to-camelCase conversion throughout UI components.

Preferred:

API
 ↓
BFF / adapter
 ↓
Frontend model
 ↓
UI

⸻

11. Feature-Based Frontend Architecture

Frontend code should be organized by feature rather than by technical type alone.

Preferred:

features/
├── auth/
├── profile/
├── projects/
├── contact/
└── ...

Avoid large global directories such as:

components/
hooks/
utils/
services/

containing unrelated feature logic.

Shared primitives may still live in shared packages.

⸻

12. Design System

The design system is a first-class architecture layer.

Use:

Design Tokens
      ↓
Tailwind
      ↓
UI primitives
      ↓
Compound components
      ↓
Feature UI

⸻

12.1 Tailwind

Tailwind CSS is the styling system.

Do not introduce:

* CSS-in-JS
* styled-components
* Emotion
* another UI styling framework

unless explicitly approved.

Prefer existing design tokens over arbitrary values.

Avoid:

className="text-[#123456]"

when an appropriate design token exists.

⸻

13. Design Tokens

Design tokens are the source of truth for visual values.

Tokens should cover concepts such as:

* color
* typography
* spacing
* radius
* shadows
* sizing
* breakpoints
* semantic colors

Separate:

primitive tokens

from:

semantic tokens

Example:

primitive
  blue-500
semantic
  color-brand-primary

Components should generally consume semantic tokens.

⸻

14. Theme Architecture

The design system supports:

* light mode
* dark mode
* brand/theme customization

Do not hard-code light/dark colors inside feature components.

Use semantic tokens.

Avoid:

text-white

when the intended meaning is a semantic foreground token.

Prefer the project’s semantic design token.

⸻

15. shadcn/ui

shadcn/ui is the base component system for the web application.

Base components belong under:

apps/web/src/components/

or the repository’s established shadcn component location.

Do not introduce another component library for general UI.

When a shadcn component exists, extend or compose it rather than creating an unrelated duplicate.

⸻

16. Shared UI Package

packages/ui contains reusable UI primitives and components.

It must remain framework-agnostic where practical.

Do not tightly couple generic UI components to:

* React Hook Form
* application business logic
* API clients
* feature-specific state
* Next.js routing

UI components should receive behavior through props/composition.

⸻

17. Compound Components

Prefer compound components when a component has meaningful internal structure.

Example:

InformationPanel
 ├── Header
 ├── Content
 └── Footer

Use composition rather than an enormous prop API.

Do not create compound components solely for abstraction’s sake.

⸻

18. Forms

React Hook Form is mandatory for application forms.

Do not use useState to manage individual form field values.

Avoid:

const [email, setEmail] = useState("")

for form fields.

Use React Hook Form.

⸻

19. Form Validation

Zod is the source of truth for client-side form validation.

Schemas should live with their feature.

Example:

features/
└── auth/
    ├── schemas/
    │   └── login.schema.ts
    ├── components/
    │   └── LoginForm.tsx
    └── ...

Do not put every schema into one global validation directory.

⸻

20. Form State

React Hook Form owns:

* field values
* dirty state
* touched state
* validation state
* submit state
* field errors

Do not duplicate these states with React state.

⸻

21. Controlled Components

Prefer uncontrolled inputs through React Hook Form.

Use:

register()

where possible.

Use:

Controller
useController

only when the component genuinely requires controlled behavior.

Typical examples:

* Select
* Combobox
* Date picker
* complex custom input
* third-party controlled component

Do not make every input controlled unnecessarily.

⸻

22. Form UI vs Form State

UI components must not depend directly on React Hook Form.

Keep these layers separate:

UI Component
      ↓
Form Adapter
      ↓
React Hook Form
      ↓
Zod

This allows UI components to remain reusable outside forms.

⸻

23. Form Errors

Distinguish:

Field validation error
Server error
Business/domain error
Network error
Unknown error

Do not map every backend error into a field error.

Field errors belong to fields.

Global/server/business errors should be represented at the appropriate form or page level.

⸻

24. Server Validation

Client-side Zod validation does not replace backend validation.

Treat frontend validation as:

UX validation

Backend validation remains responsible for:

security
business rules
data integrity
authorization

Never trust frontend validation.

⸻

25. Form Submission

Preferred flow:

Form
 ↓
RHF
 ↓
Zod
 ↓
BFF
 ↓
Backend
 ↓
Database

Do not bypass the BFF.

⸻

26. TanStack Query

Use TanStack Query for server state.

Do not use React state as a replacement for server-state management.

Use Query for:

* fetching
* caching
* invalidation
* refetching
* mutations
* optimistic updates where appropriate

Do not duplicate query state unnecessarily.

⸻

27. Query Keys

Query keys must be:

* deterministic
* stable
* feature-owned
* reusable

Prefer centralized query-key factories within a feature rather than ad-hoc strings spread across components.

⸻

28. Mutations

After successful mutations:

1. update local cache if appropriate
2. invalidate affected queries
3. refetch when required
4. ensure UI reflects server state

Do not blindly reload the entire page.

⸻

29. Internationalization

Use next-intl.

Do not hard-code user-facing text inside components when the text is intended to be translated.

Keep translations organized by feature/domain where practical.

Do not put business logic inside translation files.

⸻

30. Accessibility

Accessibility is part of the component contract.

Interactive elements must have appropriate:

* semantic HTML
* keyboard support
* focus behavior
* accessible names
* labels
* descriptions
* error announcements

Do not use:

<div role="button">

as a replacement for a native button when a native <button> can be used.

Prefer:

<button>

over manually recreating button behavior.

If a non-native element must be interactive, ensure its complete keyboard and accessibility behavior is implemented.

⸻

31. Testing

Tests should live close to the implementation.

Preferred:

Button.tsx
Button.test.tsx

or:

LoginForm.tsx
LoginForm.test.tsx

Do not create large unrelated test directories unless the project architecture requires it.

⸻

32. Testing Strategy

Use the appropriate test level.

Unit

For:

* utilities
* pure functions
* transformations
* validation logic

Component

For:

* UI behavior
* user interactions
* form behavior
* accessibility behavior

Integration

For:

* feature flows
* API/BFF integration
* data interactions

E2E

For critical user journeys.

Do not test implementation details when behavior can be tested instead.

⸻

33. React Testing Library

Prefer user-oriented assertions.

Test what the user can:

* see
* click
* type
* submit
* navigate
* experience

Avoid excessive testing of internal implementation details.

Prefer accessible queries:

getByRole
getByLabelText
getByText

over brittle selectors.

⸻

34. Storybook

Storybook is part of the shared UI development workflow.

Components that are reusable and part of the design system should have stories.

Stories should demonstrate important states such as:

* default
* disabled
* loading
* error
* empty
* dark mode
* relevant variants

Do not create meaningless stories solely to increase coverage.

⸻

35. Backend Architecture

Backend follows a layered/clean architecture approach.

Conceptually:

HTTP
 ↓
Handler
 ↓
Service / Use Case
 ↓
Repository
 ↓
Database

Handlers should not contain database business logic.

Repositories should not contain HTTP concerns.

Business logic should not depend directly on Gin.

⸻

36. Go Rules

Use idiomatic Go.

Prefer simple code over unnecessary abstractions.

Avoid:

* giant interfaces
* unnecessary dependency injection
* premature generic abstractions
* global mutable state

Keep packages focused.

⸻

37. Gin

Gin is the HTTP framework.

HTTP-specific concerns belong in handlers/middleware.

Do not leak Gin types deep into domain/business logic unless necessary.

⸻

38. Database

PostgreSQL is the primary database.

Use:

* pgx
* sqlc
* golang-migrate

Do not manually maintain generated sqlc code.

Generated code should be regenerated from the source SQL/configuration.

⸻

39. SQL

Prefer explicit SQL.

Keep SQL queries maintainable and understandable.

Use sqlc-generated types and methods rather than handwritten database access where sqlc is already established.

Avoid N+1 queries.

Consider transaction boundaries explicitly for multi-step mutations.

⸻

40. Database Migrations

Use golang-migrate.

Never modify an already-applied production migration casually.

Create a new migration for schema changes.

Migration filenames must follow the project’s established naming convention.

⸻

41. Authentication

Authentication uses:

* JWT
* Refresh Tokens

Do not invent a second authentication mechanism.

Authentication concerns must remain separate from business features.

Never log:

* passwords
* access tokens
* refresh tokens
* secrets
* credentials

⸻

42. Security

Never commit:

* API keys
* passwords
* tokens
* private keys
* production secrets
* .env files containing real secrets

Use environment variables or the project’s secret-management mechanism.

If a secret is accidentally exposed, stop and report it rather than continuing as if nothing happened.

⸻

43. Environment Variables

Never hard-code environment-specific values.

Use environment configuration.

Keep public frontend variables distinct from server-only secrets.

Never expose server secrets through NEXT_PUBLIC_*.

⸻

44. Logging

Backend logging uses Zap.

Logs should contain useful context without leaking sensitive data.

Do not log:

password
Authorization header
JWT
refresh token
API secret
database credentials

Use structured logging.

⸻

45. Error Handling

Do not swallow errors.

Bad:

result, _ := doSomething()

unless the ignored error is explicitly safe and documented.

Errors should retain useful context.

Do not expose internal stack traces or sensitive implementation details to end users.

⸻

46. API Documentation

Swagger / swaggo is used for API documentation.

When modifying public API contracts, update the corresponding documentation.

Do not allow implementation and API documentation to drift.

⸻

47. Frontend Error Handling

API errors should be normalized at the BFF/API boundary.

UI components should not need to understand every backend-specific error format.

Prefer:

Backend Error
      ↓
BFF Error Adapter
      ↓
Frontend Error Model
      ↓
UI

⸻

48. Generated Files

Do not manually edit generated files.

Examples may include:

* sqlc output
* generated API clients
* generated types
* build artifacts

Modify the source and regenerate.

If regeneration is unavailable, report the limitation.

⸻

49. Biome

Biome is the project’s formatter and linter.

Do not introduce ESLint or Prettier unless explicitly requested.

Follow the repository’s biome.json.

Do not fight formatter output manually.

Run Biome through the project’s configured scripts.

⸻

50. Code Style

Prefer:

* small functions
* explicit naming
* predictable control flow
* composition
* type safety
* readable code

Avoid:

* clever one-liners
* deeply nested conditionals
* unnecessary abstractions
* huge components
* huge hooks
* giant utility modules

Code should be easy for another engineer and an AI agent to understand.

⸻

51. Naming

Use descriptive names.

Avoid:

data
item
thing
temp
foo
bar

when a domain-specific name is possible.

Prefer:

project
customer
accessToken
formValues
queryResult

Follow the naming conventions already established in the surrounding code.

⸻

52. Comments

Comments should explain:

* why
* constraints
* non-obvious decisions
* external limitations

Do not write comments that merely repeat the code.

Bad:

// Set loading to true
setLoading(true)

Good:

// Keep the previous result visible while the next server request is pending.

⸻

53. Dependencies

Do not add a dependency when the existing stack can solve the problem cleanly.

Before adding a package:

1. Search existing dependencies.
2. Search existing utilities/components.
3. Confirm the functionality is genuinely needed.
4. Consider bundle/runtime impact.
5. Confirm compatibility with the architecture.

⸻

54. Performance

Do not optimize prematurely.

When performance matters:

1. identify the actual bottleneck
2. measure where practical
3. optimize the bottleneck
4. verify behavior after optimization

Avoid unnecessary:

* memoization
* callbacks
* state
* effects
* client components
* data fetching

⸻

55. React Rules

Prefer declarative React.

Avoid unnecessary useEffect.

Before adding an effect, ask whether the operation can instead be handled by:

* derived state
* event handler
* server component
* query/mutation lifecycle
* existing framework behavior

Do not use effects to synchronize values that can be derived directly.

⸻

56. Server State vs Client State

Use the correct ownership.

Server state
→ TanStack Query
Form state
→ React Hook Form
Local UI state
→ React state
Global UI state
→ dedicated state solution only when necessary

Do not put everything into global state.

⸻

57. Architecture Boundaries

Respect dependency direction.

Preferred:

UI
 ↓
Feature
 ↓
Application/service
 ↓
API/data

Avoid:

UI
 ↓
database

or:

shared UI
 ↓
feature-specific business logic

Shared packages must not depend on application-specific features.

⸻

58. Mobile Architecture

The mobile application is intentionally kept separate from the web application.

Do not assume web-specific APIs exist in mobile.

Shared business contracts/types may be reused where appropriate.

UI should be platform-appropriate.

Do not force web components into React Native.

⸻

59. Web / Mobile / Backend Agent Boundaries

The project may use separate agents for:

Web Agent
Mobile Agent
Backend Agent

These agents share the root architecture but have different implementation responsibilities.

Web Agent

Responsible for:

* Next.js
* React
* Tailwind
* shadcn
* Storybook
* RHF
* Zod
* TanStack Query
* BFF

Mobile Agent

Responsible for:

* React Native / Expo
* mobile navigation
* native UI
* mobile data access
* mobile-specific platform behavior

Backend Agent

Responsible for:

* Go
* Gin
* sqlc
* pgx
* PostgreSQL
* migrations
* authentication
* backend API
* observability

Agents must not modify another surface unnecessarily.

⸻

60. Cross-Surface Changes

Some changes legitimately affect multiple surfaces.

Examples:

API contract
authentication
shared type
database schema
design token contract

When this happens:

1. identify all affected surfaces
2. update the contract first
3. update consumers
4. run appropriate verification for each affected surface

Do not modify only one side of a contract and assume the other side will remain compatible.

⸻

61. Documentation

Documentation should explain durable architecture.

Do not use AGENTS.md as:

* a project diary
* sprint notes
* temporary TODO list
* changelog
* roadmap
* personal notes

Temporary state belongs elsewhere.

⸻

62. Git

Keep commits focused.

Do not mix:

feature implementation
+
unrelated refactor
+
formatting entire repository

in one change.

Prefer atomic changes.

Do not rewrite history or force-push unless explicitly requested.

Do not delete branches or tags without explicit approval.

⸻

63. Verification

Before considering a task complete, run the smallest relevant checks.

Typical checks:

format
lint
typecheck
unit tests
integration tests
build

Not every task requires every check.

Match verification to the scope of the change.

⸻

64. Verification Reporting

At the end of a task, report:

Changed:
- ...
Verified:
- ...
Not run:
- ...
Reason:
- ...

Do not claim a test was run if it was not run.

Do not claim a build passed if it was not executed.

⸻

65. Failure Handling

If verification fails:

1. determine whether the failure is caused by the change
2. fix it when within scope
3. rerun the relevant check
4. report remaining failures honestly

Do not hide failures by weakening tests, lint rules, or TypeScript configuration.

⸻

66. Tests Must Not Be Weakened

Do not:

* delete failing tests merely to make CI pass
* reduce assertions without justification
* disable lint rules globally
* disable TypeScript strictness
* add broad eslint-disable/equivalent workarounds
* mock away the behavior actually being tested

If a test is wrong, fix the test with a clear reason.

⸻

67. Accessibility and UX Are Testable Behavior

When modifying interactive components, consider:

* keyboard interaction
* focus
* labels
* error messages
* loading state
* disabled state
* screen-reader behavior

Do not consider a component complete merely because TypeScript compiles.

⸻

68. API Changes

Before changing an API:

1. locate the backend endpoint
2. locate consumers
3. inspect request/response types
4. inspect BFF adapters
5. inspect tests
6. update documentation if necessary

Avoid breaking API contracts unintentionally.

⸻

69. Database Changes

Before modifying database schema:

1. inspect current schema
2. inspect related queries
3. inspect sqlc configuration
4. inspect migration history
5. identify application consumers
6. plan backward compatibility when necessary

Do not make destructive schema changes casually.

⸻

70. Refactoring

Refactoring should preserve behavior unless the task explicitly changes behavior.

A refactor should:

* improve structure
* preserve contracts
* preserve tests
* reduce complexity
* avoid unrelated changes

Do not combine large architectural refactors with unrelated feature work unless required.

⸻

71. Avoid Premature Abstraction

Do not create:

BaseService
BaseRepository
BaseForm
UniversalInput
GenericManager
GenericFactory

without multiple concrete use cases.

Prefer concrete implementations first.

Extract shared abstractions when repetition and responsibility boundaries are clear.

⸻

72. Form Abstraction Rule

Do not build a giant universal form system.

Start with:

UI primitives
+
React Hook Form
+
Zod
+
small adapters

Extract reusable abstractions only after repeated usage demonstrates the common pattern.

⸻

73. Feature Folder Convention

A typical feature may look like:

features/
└── feature-name/
    ├── components/
    ├── hooks/
    ├── schemas/
    ├── services/
    ├── types/
    ├── utils/
    ├── constants/
    └── index.ts

Only create directories that are actually needed.

Do not create empty placeholder folders.

⸻

74. Public Feature API

Prefer exposing feature functionality through:

index.ts

when cross-feature imports are necessary.

Avoid deep imports such as:

@/features/auth/components/internal/SomeComponent

when the feature has an established public entry point.

⸻

75. Internal Implementation

Not every component should be exported.

Keep internal implementation private to the feature.

Only expose components, hooks, services, or types that are intended for reuse.

⸻

76. Environment-Specific Code

Do not mix server-only and client-only code.

Server-only code must not leak into client bundles.

Be especially careful with:

* secrets
* database clients
* filesystem APIs
* server environment variables
* authentication secrets

⸻

77. Security Boundary

Assume all browser input is untrusted.

Validate:

* request body
* query parameters
* route parameters
* uploaded files
* authentication state
* authorization

Do not rely solely on TypeScript types for runtime validation.

⸻

78. File Uploads

File uploads must be validated for:

* type
* size
* authorization
* storage destination
* failure handling

Do not trust the client-provided MIME type alone.

Use the established Cloudinary/storage architecture rather than creating ad-hoc storage.

⸻

79. Email

Resend is the email provider.

Email sending should remain behind an application/service boundary.

Do not call email providers directly from arbitrary UI components.

⸻

80. Observability

The project uses:

* Sentry for error monitoring
* Umami for analytics

Observability must not leak sensitive information.

Do not send passwords, tokens, or private user data to analytics/error systems.

⸻

81. Analytics

Analytics should track product behavior, not sensitive data.

Prefer anonymous or appropriately minimized events.

Do not add analytics calls everywhere without a defined event model.

⸻

82. Sentry

Sentry errors should include enough context to debug the problem while avoiding secrets and unnecessary personal data.

Do not blindly attach entire request bodies to error reports.

⸻

83. Portfolio Quality

This project is a portfolio project and therefore code quality is part of the product.

Prefer implementations that demonstrate:

* clear architecture
* maintainability
* testability
* accessibility
* type safety
* good developer experience
* observability
* security awareness
* production thinking

Do not optimize solely for “making the demo work.”

⸻

84. Production Over Demo

When two implementations work:

Prefer the implementation that demonstrates the better production engineering trade-off.

However, do not over-engineer simple features merely to make the portfolio look sophisticated.

The goal is:

Production-quality
+
Reasonable complexity
+
Clear trade-offs

⸻

85. Decision Making

When multiple valid approaches exist:

1. inspect existing project patterns
2. prefer consistency
3. choose the simplest production-appropriate solution
4. document important trade-offs
5. avoid introducing unnecessary technologies

⸻

86. User Requirements Override Preferences

The rules in this file describe the project’s architecture.

An explicit user request can intentionally override a project convention for a specific task.

If doing so would create a significant architectural consequence, clearly state it.

Do not silently create permanent exceptions.

⸻

87. Final Checklist

Before completing a task, verify:

Architecture

* Correct application/package was modified
* Existing architecture was followed
* No unnecessary abstraction was introduced
* No unrelated refactor was included

Type Safety

* TypeScript remains strict
* No unnecessary any
* Types are owned by the correct layer

Frontend

* Server/Client boundary is correct
* page.tsx remains composition-focused
* BFF boundary is respected
* Tailwind/design tokens are used
* Existing UI primitives are reused

Forms

* React Hook Form is used
* No unnecessary field useState
* Zod schema is used
* Controlled components use RHF adapters only when necessary
* Server errors are handled separately
* Backend validation is still respected

Backend

* Handler/service/repository boundaries are respected
* Database access follows sqlc/pgx architecture
* Errors are handled
* Secrets are not logged

Testing

* Relevant tests were added/updated
* Tests are colocated where appropriate
* Accessibility behavior is considered
* Relevant verification was run

Security

* No secrets were introduced
* User input is validated
* Authentication/authorization boundaries remain intact
* Sensitive information is not logged

Final Report

* Changed files/areas summarized
* Verification reported honestly
* Known limitations reported
* No unrelated changes included

⸻

88. Form Architecture

All application forms MUST use:

* React Hook Form for form state
* Zod for schema validation
* @hookform/resolvers/zod for integration
* @repo/ui form primitives for shared presentation

Do NOT use useState for individual form fields.

Feature-specific Zod schemas belong inside:

src/features/<feature>/schemas/

Business-specific schemas MUST NOT be placed inside packages/ui.

page.tsx MUST remain composition-only.

Forms MUST NOT call the Go backend directly.

Submission architecture:

Form
  ↓
Next.js BFF
  ↓
Go Backend

⸻

89. Form Field Rules

React Hook Form is mandatory for application forms.

Zod is the validation source of truth.

Use @hookform/resolvers for Zod integration.

Use FormField for fields managed by RHF.

Use register only for components that support the normal input
contract (value/onChange/onBlur/name/ref).

Use controlled mapping for Select, Checkbox, RadioGroup, Switch, and
similar components:

* Checkbox / Switch: checked={field.value} + onCheckedChange={field.onChange}
* RadioGroup: value={field.value} + onValueChange={field.onChange}
* Native Select: standard input contract; the RHF field may be spread

Do not use useState for individual form fields.

Feature/business schemas belong under the feature.

Shared form presentation primitives belong in @repo/ui.

Preserve accessibility attributes from the shared Form system.

Do not create unnecessary field wrapper abstractions
(FormInput, FormSelect, FormCheckbox, ...).

Every controlled field MUST have an explicit defaultValues entry so
no control transitions from uncontrolled to controlled.

page.tsx remains composition-only.

API access must follow the BFF boundary.

⸻

90. Validation & Error UX Rules

Zod is the business validation source of truth.

Do NOT duplicate validation rules in components, local state, or
utility functions.

React Hook Form owns form state (errors, touched, dirty, submitting).

Do NOT mirror these into local React state.

Prefer mode: "onBlur" with reValidateMode: "onChange" as the default
form UX convention: errors appear on blur or submit, and clear as
soon as a corrected value becomes valid after a failed submit.

Field errors MUST render through the shared FormMessage.

There MUST be one error source per field.

Do NOT create a second error-message component or system.

Error messages MUST be specific, actionable, and user-facing.

Never expose raw Zod error structures or internal details.

Failed submits MUST NOT clear or reset entered values.

Rely on RHF shouldFocusError to focus the first invalid field.

Do NOT build custom focus-management abstractions.

Submit buttons reflect formState.isSubmitting.

Do NOT create local loading state for submission.

Keep form-level messaging minimal.

A form-level line may orient users after a failed submit, but it
MUST NOT duplicate field errors.

Do NOT add error summaries unless the form size and UX clearly
justify them.

Server validation and server errors belong to the BFF/backend
series and MUST NOT be simulated inside feature forms.