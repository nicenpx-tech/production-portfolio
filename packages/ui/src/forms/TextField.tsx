import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const inputVariants = cva(
	'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
	{
		variants: {
			size: {
				sm: 'h-8 px-2 text-xs',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-4 text-base',
			},
			state: {
				default: 'focus-visible:ring-indigo-500',
				error: 'border-red-500 focus-visible:ring-red-500',
				success: 'border-green-500 focus-visible:ring-green-500',
			},
		},
		defaultVariants: {
			size: 'md',
			state: 'default',
		},
	}
);

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
	label?: string;
	error?: string;
	helperText?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	onRightIconClick?: () => void;
	containerClassName?: string;
}

/**
 * TextField - A text input component with label, error, and helper text
 * Fully accessible with ARIA attributes
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
	(
		{
			className,
			size,
			state,
			label,
			error,
			helperText,
			leftIcon,
			rightIcon,
			onRightIconClick,
			containerClassName,
			id,
			...props
		},
		ref
	) => {
		const inputId = id || React.useId();
		const errorId = `${inputId}-error`;
		const helperId = `${inputId}-helper`;
		const finalState = error ? 'error' : state;

		return (
			<div className={cn('w-full', containerClassName)}>
				{label && (
					<label
						htmlFor={inputId}
						className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						{label}
					</label>
				)}
				<div className="relative">
					{leftIcon && (
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							{leftIcon}
						</div>
					)}
					<input
						ref={ref}
						id={inputId}
						className={cn(
							inputVariants({ size, state: finalState }),
							leftIcon && 'pl-10',
							rightIcon && 'pr-10',
							className
						)}
						aria-invalid={error ? 'true' : undefined}
						aria-describedby={error ? errorId : helperText ? helperId : undefined}
						{...props}
					/>
					{rightIcon && (
						<button
							type="button"
							onClick={onRightIconClick}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
							tabIndex={onRightIconClick ? 0 : -1}
						>
							{rightIcon}
						</button>
					)}
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

TextField.displayName = 'TextField';