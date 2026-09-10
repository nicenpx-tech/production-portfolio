/**
 * Motion Tokens
 * Animation durations, easings, and transitions
 */
export const motion = {
	// Durations (ms)
	durations: {
		instant: '50ms',
		fast: '100ms',
		normal: '200ms',
		slow: '300ms',
		slower: '500ms',
		slowest: '1000ms',
	},

	// Easing functions
	easings: {
		linear: 'linear',
		ease: 'ease',
		easeIn: 'ease-in',
		easeOut: 'ease-out',
		easeInOut: 'ease-in-out',

		// Custom easings
		bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
		smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
		entrance: 'cubic-bezier(0, 0, 0.2, 1)',
		exit: 'cubic-bezier(0.4, 0, 1, 1)',
	},

	// Transitions
	transitions: {
		fast: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
		normal: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
		slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',

		// Specific property transitions
		colors: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
		sizes: 'width, height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
		transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
		opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
	},
} as const;

export type Motion = typeof motion;