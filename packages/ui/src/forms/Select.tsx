import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { ChevronDown } from 'lucide-react';

const selectVariants = cva(
	'flex w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
	{
		variants: {
			size: {
				sm: 'h-8 px-2 text-xs',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-4 text-base',
			},
			state: {
				default: '',
				error: 'border-red-500 focus-visible:ring-red-500',
			},
		},
		defaultVariants: {
			size: 'md',
			state: 'default',
		},
	}
);

export interface SelectProps
	extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
		VariantProps<typeof selectVariants> {
	label?: string;
	error?: string;
	helperText?: string;
	options: { value: string; label: string; disabled?: boolean }[];
	placeholder?: string;
	containerClassName?: string;
}

/**
 * Select - A dropdown select component
 * Supports error states, helper text, and custom options
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	(
		{
			className,
			size,
			state,
			label,
			error,
			helperText,
			options,
			placeholder,
			containerClassName,
			id,
			...props
		},
		ref
	) => {
		const selectId = id || React.useId();
		const errorId = `${selectId}-error`;
		const helperId = `${selectId}-helper`;
		const finalState = error ? 'error' : state;

		return (
			<div className={cn('w-full', containerClassName)}>
				{label && (
					<label
						htmlFor={selectId}
						className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						{label}
					</label>
				)}
				<div className="relative">
					<select
						ref={ref}
						id={selectId}
						className={cn(selectVariants({ size, state: finalState }), 'pr-10', className)}
						aria-invalid={error ? 'true' : undefined}
						aria-describedby={error ? errorId : helperText ? helperId : undefined}
						{...props}
					>
						{placeholder && (
							<option value="" disabled>
								{placeholder}
							</option>
						)}
						{options.map((option) => (
							<option key={option.value} value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						))}
					</select>
					<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
				</div>
				{error && (
					<p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p id={helperId} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

Select.displayName = 'Select';