/**
 * Z-Index Tokens
 * Stacking order values
 */
export const zIndex = {
	// Base values
	auto: 'auto',
	base: '0',

	// Application layers
	dropdown: '1000',
	sticky: '1100',
	fixed: '1200',
	modalBackdrop: '1300',
	modal: '1400',
	popover: '1500',
	tooltip: '1600',

	// UI overlays
	navigation: '2000',
	sidebar: '2100',
	drawer: '2200',
	dialog: '2300',
	alert: '2400',
	toast: '2500',
	notification: '2600',

	// Utilities
	hide: '-1',
} as const;

export type ZIndex = typeof zIndex;