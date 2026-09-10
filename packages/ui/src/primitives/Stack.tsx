import * as React from 'react';
import { cn } from '../utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
	direction?: 'horizontal' | 'vertical';
	spacing?: string | number;
	align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
	justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * Stack - A simple stacked layout primitive
 * Automatically handles spacing between children
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
	({ className, direction = 'vertical', spacing, align, justify, style, ...props }, ref) => {
		const flexDirection = direction === 'horizontal' ? 'row' : 'column';
		const gap = typeof spacing === 'number' ? `${spacing}px` : spacing;

		return (
			<div
				ref={ref}
				className={cn('flex', className)}
				style={{
					flexDirection,
					gap,
					alignItems: align,
					justifyContent: justify,
					...style,
				}}
				{...props}
			/>
		);
	}
);

Stack.displayName = 'Stack';