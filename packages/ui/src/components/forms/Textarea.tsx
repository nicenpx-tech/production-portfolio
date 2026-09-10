import * as React from 'react';
import { cn } from '../../utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Textarea - Bare multi-line text input primitive
 * Designed to be composed with FormLabel/FormControl, which inject the
 * id and ARIA attributes; invalid styling reacts to aria-invalid
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				className={cn(
					'flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
					className
				)}
				{...props}
			/>
		);
	}
);

Textarea.displayName = 'Textarea';
