import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { X } from 'lucide-react';
import { useOnClickOutside, useEscapeKey } from '../hooks';

const dialogVariants = cva('', {
	variants: {
		size: {
			sm: 'max-w-sm',
			md: 'max-w-md',
			lg: 'max-w-lg',
			xl: 'max-w-xl',
			'2xl': 'max-w-2xl',
			full: 'max-w-full',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dialogVariants> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	showCloseButton?: boolean;
}

/**
 * Dialog - A modal dialog component
 * Requires user interaction to dismiss
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
	({ open = false, onOpenChange, title, description, showCloseButton = true, size, className, children, ...props }, ref) => {
		const dialogRef = React.useRef<HTMLDivElement>(null);

		useOnClickOutside(dialogRef, () => onOpenChange?.(false));
		useEscapeKey(() => onOpenChange?.(false), open);

		if (!open) return null;

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black/50 backdrop-blur-sm"
					onClick={() => onOpenChange?.(false)}
				/>

				{/* Dialog */}
				<div
					ref={dialogRef}
					className={cn(
						'relative z-10 w-full rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900',
						dialogVariants({ size }),
						className
					)}
					role="dialog"
					aria-modal="true"
					aria-labelledby={title ? 'dialog-title' : undefined}
					aria-describedby={description ? 'dialog-description' : undefined}
					{...props}
				>
					{(title || showCloseButton) && (
						<div className="mb-4 flex items-start justify-between">
							{title && (
								<h2 id="dialog-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									{title}
								</h2>
							)}
							{showCloseButton && (
								<button
									onClick={() => onOpenChange?.(false)}
									className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-gray-800"
								>
									<X className="h-5 w-5" />
								</button>
							)}
						</div>
					)}
					{description && (
						<p id="dialog-description" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
							{description}
						</p>
					)}
					{children}
				</div>
			</div>
		);
	}
);

Dialog.displayName = 'Dialog';