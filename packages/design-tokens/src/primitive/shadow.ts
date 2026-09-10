/**
 * Shadow Tokens
 * Depth and elevation values
 */
export const shadow = {
	none: 'none',

	// Elevation shadows
	sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
	base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
	md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
	lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
	xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
	'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

	// Inner shadows
	inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

	// Colored shadows
	glow: {
		primary: '0 0 20px rgba(99, 102, 241, 0.5)',
		success: '0 0 20px rgba(34, 197, 94, 0.5)',
		error: '0 0 20px rgba(239, 68, 68, 0.5)',
		warning: '0 0 20px rgba(245, 158, 11, 0.5)',
	},
} as const;

export type Shadow = typeof shadow;