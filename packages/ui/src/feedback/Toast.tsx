import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { Check, X, Info, AlertCircle, Loader2, X as CloseIcon } from 'lucide-react';

const toastVariants = cva(
	'flex items-center gap-3 rounded-lg p-4 shadow-lg',
	{
		variants: {
			variant: {
				default: 'bg-white dark:bg-gray-800',
				success: 'bg-green-600 text-white',
				error: 'bg-red-600 text-white',
				warning: 'bg-yellow-500 text-white',
				info: 'bg-blue-600 text-white',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
	title?: string;
	description?: string;
	action?: React.ReactNode;
	duration?: number;
	onDismiss?: () => void;
	isLoading?: boolean;
}

const icons = {
	default: Info,
	success: Check,
	error: X,
	warning: AlertCircle,
	info: Info,
} as const;

/**
 * Toast - A notification component
 * Appears temporarily to notify users of events
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
	(
		{
			variant = 'default',
			title,
			description,
			action,
			duration,
			onDismiss,
			isLoading = false,
			className,
			...props
		},
		ref
	) => {
		React.useEffect(() => {
			if (duration && onDismiss) {
				const timer = setTimeout(onDismiss, duration);
				return () => clearTimeout(timer);
			}
		}, [duration, onDismiss]);

		const Icon = isLoading ? Loader2 : icons[variant ?? 'default'];

		return (
			<div
				ref={ref}
				className={cn(toastVariants({ variant }), className)}
				{...props}
			>
				{isLoading ? (
					<Icon className="h-5 w-5 animate-spin" />
				) : (
					<Icon className="h-5 w-5 flex-shrink-0" />
				)}
				<div className="flex-1">
					{title && <p className="font-medium">{title}</p>}
					{description && <p className="text-sm opacity-90">{description}</p>}
				</div>
				{action && <div className="flex-shrink-0">{action}</div>}
				{onDismiss && (
					<button
						onClick={onDismiss}
						className="flex-shrink-0 opacity-70 hover:opacity-100"
						aria-label="Dismiss"
					>
						<CloseIcon className="h-4 w-4" />
					</button>
				)}
			</div>
		);
	}
);

Toast.displayName = 'Toast';