import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { Check } from 'lucide-react';

const checkboxVariants = cva(
	'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:ring-offset-gray-950 dark:focus-visible:ring-indigo-400',
	{
		variants: {
			variant: {
				default: 'data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-indigo-500',
				success: 'data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-green-500',
				error: 'data-[state=checked]:bg-red-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-red-500',
			},
			size: {
				sm: 'h-3 w-3',
				md: 'h-4 w-4',
				lg: 'h-5 w-5',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	}
);

export interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
		VariantProps<typeof checkboxVariants> {
	label?: string;
	error?: string;
	helperText?: string;
	indeterminate?: boolean;
}

/**
 * Checkbox - A checkbox input with optional label
 * Supports indeterminate state and different variants
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, variant, size, label, error, helperText, indeterminate, id, ...props }, ref) => {
		const internalRef = React.useRef<HTMLInputElement>(null);
		const checkboxId = id || React.useId();

		React.useImperativeHandle(ref, () => internalRef.current!);

		// Handle indeterminate state
		React.useEffect(() => {
			if (internalRef.current) {
				internalRef.current.indeterminate = indeterminate || false;
			}
		}, [indeterminate]);

		return (
			<div className="flex flex-col">
				<div className="flex items-start gap-2">
					<input
						ref={internalRef}
						id={checkboxId}
						type="checkbox"
						className={cn(checkboxVariants({ variant, size }), className)}
						aria-invalid={error ? 'true' : undefined}
						{...props}
					/>
					{label && (
						<label
							htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';