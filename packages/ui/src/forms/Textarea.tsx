import * as React from 'react';
import { cn } from '../utils';
import { Loader2 } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	helperText?: string;
	resizable?: boolean;
	containerClassName?: string;
}

/**
 * Textarea - A multi-line text input component
 * Supports resizing, error states, and helper text
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, label, error, helperText, resizable = true, containerClassName, id, ...props }, ref) => {
		const textareaId = id || React.useId();
		const errorId = `${textareaId}-error`;
		const helperId = `${textareaId}-helper`;

		return (
			<div className={cn('w-full', containerClassName)}>
				{label && (
					<label
						htmlFor={textareaId}
						className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
						error && 'border-red-500 focus-visible:ring-red-500',
						!resizable && 'resize-none',
						className
					)}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={error ? errorId : helperText ? helperId : undefined}
					{...props}
				/>
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

Textarea.displayName = 'Textarea';