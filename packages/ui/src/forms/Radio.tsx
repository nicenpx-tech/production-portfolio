import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const radioVariants = cva(
	'peer h-4 w-4 shrink-0 rounded-full border border-gray-300 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:ring-offset-gray-950 dark:focus-visible:ring-indigo-400',
	{
		variants: {
			size: {
				sm: 'h-3 w-3',
				md: 'h-4 w-4',
				lg: 'h-5 w-5',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
);

export interface RadioProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
		VariantProps<typeof radioVariants> {
	label?: string;
	error?: string;
	helperText?: string;
}

/**
 * Radio - A radio button input with optional label
 * Part of a radio group where only one can be selected
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
	({ className, size, label, error, helperText, id, ...props }, ref) => {
		const radioId = id || React.useId();

		return (
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<input
						ref={ref}
						id={radioId}
						type="radio"
						className={cn(
							radioVariants({ size }),
							'appearance-none checked:border-indigo-600 checked:bg-indigo-600 checked:after:absolute checked:after:inset-0 checked:after:m-auto checked:after:h-2 checked:after:w-2 checked:after:rounded-full checked:after:bg-white dark:checked:border-indigo-500 dark:checked:bg-indigo-500',
							className
						)}
						aria-invalid={error ? 'true' : undefined}
						{...props}
					/>
					{label && (
						<label
							htmlFor={radioId}
							className={cn(
								'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
								error ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
							)}
						>
							{label}
						</label>
					)}
				</div>
				{error && (
					<p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
				)}
			</div>
		);
	}
);

Radio.displayName = 'Radio';