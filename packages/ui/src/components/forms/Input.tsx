import * as React from 'react';
import { cn } from '../../utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input - Bare text input primitive
 * Designed to be composed with FormLabel/FormControl, which inject the
 * id and ARIA attributes; invalid styling reacts to aria-invalid
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				ref={ref}
				type={type}
				className={cn(
					'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
					className
				)}
				{...props}
			/>
		);
	}
);

Input.displayName = 'Input';
