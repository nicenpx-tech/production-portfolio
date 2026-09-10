import * as React from 'react';
import { cn } from '../utils';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
	as?: React.ElementType;
}

/**
 * Box - The fundamental layout primitive
 * A simple div wrapper that accepts all standard HTML attributes
 * and provides a consistent styling interface.
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
	({ className, as: Component = 'div', ...props }, ref) => {
		return <Component ref={ref} className={cn(className)} {...props} />;
	}
);

Box.displayName = 'Box';