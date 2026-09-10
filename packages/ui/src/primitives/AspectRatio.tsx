import * as React from 'react';
import { cn } from '../utils';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
	ratio?: number | string;
}

/**
 * AspectRatio - A ratio-maintaining container primitive
 * Maintains the aspect ratio of its content
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
	({ className, ratio = 1, style, children, ...props }, ref) => {
		const [width, setWidth] = React.useState(0);
		const containerRef = React.useRef<HTMLDivElement>(null);

		React.useImperativeHandle(ref, () => containerRef.current!);

		const calculatedHeight = typeof ratio === 'number' ? width / ratio : width;

		return (
			<div
				ref={containerRef}
				className={cn('relative w-full', className)}
				style={{ height: calculatedHeight || 'auto', ...style }}
				{...props}
			>
				{children}
			</div>
		);
	}
);

AspectRatio.displayName = 'AspectRatio';