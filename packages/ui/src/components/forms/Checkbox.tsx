import * as React from 'react';
import { cn } from '../../utils';

export interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	/** Controlled checked state; pair with onCheckedChange */
	checked?: boolean;
	/** Called with the new checked state when the box is toggled */
	onCheckedChange?: (checked: boolean) => void;
}

/**
 * Checkbox - Bare checkbox primitive built on a native input
 * The real <input type="checkbox"> stays in the accessibility tree and
 * receives the id and ARIA attributes injected by FormControl. The visible
 * box and checkmark are direct siblings styled through peer variants, so
 * checked, keyboard focus, disabled, and aria-invalid states are reflected
 * without duplicating accessibility logic.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, onCheckedChange, ...props }, ref) => {
		return (
			<span
				className={cn('relative inline-flex h-4 w-4 shrink-0 align-middle', className)}
			>
				<input
					ref={ref}
					type="checkbox"
					className="peer sr-only"
					checked={checked}
					onChange={(event) => onCheckedChange?.(event.target.checked)}
					{...props}
				/>
				<span
					aria-hidden="true"
					className={cn(
						'absolute inset-0 rounded-sm border border-gray-300 bg-white transition-colors',
						'peer-checked:border-indigo-600 peer-checked:bg-indigo-600',
						'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2',
						'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
						'peer-aria-invalid:border-red-500',
						'dark:border-gray-700 dark:bg-gray-900 dark:peer-checked:border-indigo-500 dark:peer-checked:bg-indigo-500'
					)}
				/>
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className={cn(
						'pointer-events-none absolute inset-0 m-auto h-3 w-3 text-white opacity-0 transition-opacity',
						'peer-checked:opacity-100',
						'peer-disabled:opacity-50'
					)}
				>
					<path d="M3 8.5 6.5 12 13 4.5" />
				</svg>
			</span>
		);
	}
);

Checkbox.displayName = 'Checkbox';
