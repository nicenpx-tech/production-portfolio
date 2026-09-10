import * as React from 'react';
import { cn } from '../../utils';

export interface SwitchProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	/** Controlled checked state; pair with onCheckedChange */
	checked?: boolean;
	/** Called with the new checked state when the switch is toggled */
	onCheckedChange?: (checked: boolean) => void;
}

/**
 * Switch - Bare toggle switch primitive built on a native checkbox input
 * The input carries role="switch" and stays in the accessibility tree,
 * receiving the id and ARIA attributes injected by FormControl. The visible
 * track and thumb are direct siblings styled through peer variants, so
 * checked, keyboard focus, disabled, and aria-invalid states are reflected
 * without duplicating accessibility logic.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
	({ className, checked, onCheckedChange, ...props }, ref) => {
		return (
			<span
				className={cn('relative inline-flex h-6 w-11 shrink-0 align-middle', className)}
			>
				<input
					ref={ref}
					type="checkbox"
					role="switch"
					className="peer sr-only"
					checked={checked}
					onChange={(event) => onCheckedChange?.(event.target.checked)}
					{...props}
				/>
				<span
					aria-hidden="true"
					className={cn(
						'absolute inset-0 rounded-full border-2 border-transparent bg-gray-200 transition-colors',
						'peer-checked:bg-indigo-600',
						'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2',
						'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
						'peer-aria-invalid:border-red-500',
						'dark:bg-gray-700 dark:peer-checked:bg-indigo-500'
					)}
				/>
				<span
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute left-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform',
						'peer-checked:translate-x-5',
						'peer-disabled:opacity-50'
					)}
				/>
			</span>
		);
	}
);

Switch.displayName = 'Switch';
