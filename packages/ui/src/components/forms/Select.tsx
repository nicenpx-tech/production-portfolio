import * as React from 'react';
import { cn } from '../../utils';
import { ChevronDown } from 'lucide-react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Select - Bare native select primitive
 * Follows the standard value/onChange/onBlur/name/ref input contract, so a
 * React Hook Form field can be spread directly onto it. FormControl injects
 * the id and ARIA attributes, and invalid styling reacts to aria-invalid.
 * Compose with <option> elements owned by the feature.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div className="relative">
				<select
					ref={ref}
					className={cn(
						'flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pr-9 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
						className
					)}
					{...props}
				>
					{children}
				</select>
				<ChevronDown
					aria-hidden="true"
					className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
				/>
			</div>
		);
	}
);

Select.displayName = 'Select';
