/**
 * @repo/design-tokens
 *
 * Shared design token library providing the single source of truth
 * for all visual styles across the monorepo.
 *
 * ## Primitive Tokens
 * Core, atomic design values without semantic meaning
 *
 * ## Semantic Tokens
 * Contextual design values with semantic meaning
 *
 * ## Component Tokens
 * Component-specific design values
 *
 * ## Themes
 * Theme definitions and configurations
 */

// Primitive tokens
export { colors, spacing, radius, shadow, typography, motion, opacity, zIndex } from './primitive';

// Type exports
export type {
	Colors,
	Spacing,
	Radius,
	Shadow,
	Typography,
	Motion,
	Opacity,
	ZIndex,
} from './primitive';

// Semantic tokens (placeholder)
export {} from './semantic';

// Component tokens (placeholder)
export {} from './component';

// Themes (placeholder)
export {} from './themes';