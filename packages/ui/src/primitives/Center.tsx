import * as React from 'react';
import { cn } from '../utils';

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
	inline?: boolean;
}

/**
 * Center - A centering primitive
 * Centers content both horizontally and vertically
 */
export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
	({ className, inline, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex items-center justify-center', inline && 'inline-flex', className)}
				{...props}
			/>
		);
	}
);

Center.displayName = 'Center';