# @repo/design-tokens

Shared Design Token Library.

This package provides the single source of truth for all visual styles across the monorepo.

## Features

- **Primitive Tokens**: Core design values (colors, spacing, typography, etc.)
- **Semantic Tokens**: Contextual design values
- **Component Tokens**: Component-specific design values
- **Themes**: Theme configurations

## Usage

```typescript
import { colors, spacing } from '@repo/design-tokens';
```

## Architecture

- Zero runtime dependencies
- Immutable tokens
- Platform agnostic
- No React imports
- No Tailwind dependencies