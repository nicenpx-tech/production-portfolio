import * as React from 'react';
import { cn } from '../utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
	cols?: number | string;
	rows?: number | string;
	gap?: string | number;
}

/**
 * Grid - A CSS Grid layout primitive
 * Provides a simple interface for CSS Grid layouts
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
	({ className, cols, rows, gap, style, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('grid', className)}
				style={{
					gridTemplateColumns: typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : cols,
					gridTemplateRows: typeof rows === 'number' ? `repeat(${rows}, minmax(0, 1fr))` : rows,
					gap: typeof gap === 'number' ? `${gap}px` : gap,
					...style,
				}}
				{...props}
			/>
		);
	}
);

Grid.displayName = 'Grid';