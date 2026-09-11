'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '../../utils';

/**
 * FormRootError - Form-level error announced through role="alert"
 *
 * Renders nothing while the form has no root error. Server and
 * submission failures are surfaced once, at the form level, through
 * form.setError('root', ...); they never replace field messages.
 */
export const FormRootError = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { formState } = useFormContext();
	const message = formState.errors.root?.message;
	const body = message ? String(message) : children;

	if (!body) {
		return null;
	}

	return (
		<p
			ref={ref}
			role="alert"
			className={cn('text-sm text-red-600 dark:text-red-400', className)}
			{...props}
		>
			{body}
		</p>
	);
});

FormRootError.displayName = 'FormRootError';
