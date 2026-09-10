import * as React from 'react';
import { cn } from '../utils';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
	justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
	wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
	gap?: string | number;
}

/**
 * Flex - A flexible layout primitive
 * Provides a simple interface for Flexbox layouts
 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
	({ className, direction = 'row', align, justify, wrap, gap, style, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex', className)}
				style={{
					flexDirection: direction,
					alignItems: align,
					justifyContent: justify,
					flexWrap: wrap,
					gap: typeof gap === 'number' ? `${gap}px` : gap,
					...style,
				}}
				{...props}
			/>
		);
	}
);

Flex.displayName = 'Flex';