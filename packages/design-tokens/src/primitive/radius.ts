/**
 * Border Radius Tokens
 * Consistent corner rounding values
 */
export const radius = {
	none: '0',
	sm: '2px',
	base: '4px',
	md: '6px',
	lg: '8px',
	xl: '12px',
	'2xl': '16px',
	'3xl': '24px',
	full: '9999px',
} as const;

export type Radius = typeof radius;