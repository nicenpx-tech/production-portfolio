import * as React from 'react';
import { cn } from '../utils';

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: string | number;
	direction?: 'horizontal' | 'vertical';
	flex?: boolean;
}

/**
 * Spacer - A spacing primitive that adds space between elements
 * Can be used as flex spacer or fixed spacing
 */
export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
	({ className, size, direction = 'vertical', flex, style, ...props }, ref) => {
		if (flex) {
			return <div ref={ref} className={cn('flex-1', className)} {...props} />;
		}

		const dimension = direction === 'horizontal' ? 'width' : 'height';
		const value = typeof size === 'number' ? `${size}px` : size || '1rem';

		return (
			<div
				ref={ref}
				className={cn('shrink-0', className)}
				style={{ [dimension]: value, ...style }}
				{...props}
			/>
		);
	}
);

Spacer.displayName = 'Spacer';