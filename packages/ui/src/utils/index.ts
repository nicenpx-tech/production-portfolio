/**
 * Utility to merge Tailwind CSS classes intelligently
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Type-safe variant builder for CVA
 */
export type VariantProps<T extends (...args: unknown[]) => string> = Parameters<T>[0];

/**
 * Generate a unique ID for accessibility
 */
let idCounter = 0;
export function generateId(prefix = 'id'): string {
	return `${prefix}-${++idCounter}`;
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(value);
}

/**
 * Format a date relative to now
 */
export function formatRelativeTime(date: Date, locale = 'en-US'): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

	if (diffInSeconds < 60) {
		return rtf.format(-diffInSeconds, 'second');
	}
	if (diffInSeconds < 3600) {
		return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
	}
	if (diffInSeconds < 86400) {
		return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
	}
	if (diffInSeconds < 2592000) {
		return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
	}
	if (diffInSeconds < 31536000) {
		return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
	}
	return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength = 50): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get the first n characters of a string
 */
export function getInitials(name: string, maxLength = 2): string {
	const parts = name.trim().split(' ');
	if (parts.length === 1) {
		return parts[0].slice(0, maxLength).toUpperCase();
	}
	return parts
		.slice(0, maxLength)
		.map((part) => part[0])
		.join('')
		.toUpperCase();
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;

	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(later, wait);
	};
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle = false;

	return function executedFunction(...args: Parameters<T>) {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}

/**
 * Check if a key press is a keyboard shortcut
 */
export function isKeyboardShortcut(event: KeyboardEvent, shortcuts: string[]): boolean {
	const key = event.key.toLowerCase();
	const modifiers: string[] = [];

	if (event.ctrlKey) modifiers.push('ctrl');
	if (event.metaKey) modifiers.push('meta');
	if (event.altKey) modifiers.push('alt');
	if (event.shiftKey) modifiers.push('shift');

	const pressedShortcut = [...modifiers, key].join('+');

	return shortcuts.some((shortcut) => {
		const parts = shortcut.toLowerCase().split('+');
		return pressedShortcut === parts.join('+');
	});
}

/**
 * Focus trap for modals and dialogs
 */
export function createFocusTrap(container: HTMLElement) {
	const focusableElements = container.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);
	const firstElement = focusableElements[0] as HTMLElement;
	const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		if (event.shiftKey) {
			if (document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}

	container.addEventListener('keydown', handleKeyDown);

	return () => {
		container.removeEventListener('keydown', handleKeyDown);
	};
}

/**
 * Check if an element is in the viewport
 */
export function isInViewport(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (error) {
		// Fallback for older browsers
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		const success = document.execCommand('copy');
		document.body.removeChild(textarea);
		return success;
	}
}