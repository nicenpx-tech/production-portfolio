import * as React from 'react';
import { cn } from '../utils';

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	position?: 'left' | 'right' | 'top' | 'bottom';
	title?: string;
}

/**
 * Drawer - A slide-in panel component
 * Slides in from the edge of the screen
 */
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
	({ open = false, onOpenChange, position = 'right', title, className, children, ...props }, ref) => {
		if (!open) return null;

		return (
			<div className="fixed inset-0 z-50">
				<div
					className="absolute inset-0 bg-black/50 backdrop-blur-sm"
					onClick={() => onOpenChange?.(false)}
				/>
				<div
					ref={ref}
					className={cn(
						'relative z-10 bg-white shadow-xl dark:bg-gray-900',
						{
							'left-0 h-full w-80': position === 'left',
							'right-0 h-full w-80': position === 'right',
							'top-0 h-80 w-full': position === 'top',
							'bottom-0 h-80 w-full': position === 'bottom',
						},
						className
					)}
					{...props}
				>
					{title && (
						<div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
							<button
								onClick={() => onOpenChange?.(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>
					)}
					<div className="p-4">{children}</div>
				</div>
			</div>
		);
	}
);

Drawer.displayName = 'Drawer';