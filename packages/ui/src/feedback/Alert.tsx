import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { Info, CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const alertVariants = cva(
	'flex items-start gap-3 rounded-lg border p-4',
	{
		variants: {
			variant: {
				info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
				success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
				warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
				error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
			},
		},
		defaultVariants: {
			variant: 'info',
		},
	}
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
	title?: string;
	dismissible?: boolean;
	onDismiss?: () => void;
}

const icons = {
	info: Info,
	success: CheckCircle,
	warning: AlertCircle,
	error: XCircle,
} as const;

/**
 * Alert - A feedback message component
 * Used to display important information to users
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	({ variant = 'info', title, dismissible = false, onDismiss, className, children, ...props }, ref) => {
		const Icon = icons[variant ?? 'info'];

		return (
			<div ref={ref} className={cn(alertVariants({ variant }), className)} role="alert" {...props}>
				<Icon className="h-5 w-5 flex-shrink-0" />
				<div className="flex-1">
					{title && <p className="font-semibold">{title}</p>}
					{children && <p className="text-sm">{children}</p>}
				</div>
				{dismissible && (
					<button
						onClick={onDismiss}
						className="text-current opacity-70 hover:opacity-100"
						aria-label="Dismiss"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
		);
	}
);

Alert.displayName = 'Alert';