import * as React from 'react';
import { cn } from '../../utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Label - Accessible label primitive for form controls
 * Pair with an input through htmlFor to announce the field name
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	({ className, ...props }, ref) => (
		<label
			ref={ref}
			className={cn(
				'block text-sm font-medium text-gray-700 dark:text-gray-300',
				className
			)}
			{...props}
		/>
	)
);

Label.displayName = 'Label';
