import * as React from 'react';
import { cn } from '../utils';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
	icon?: React.ReactNode;
	title?: string;
	description?: string;
	action?: React.ReactNode;
}

/**
 * EmptyState - A placeholder for empty content
 * Displays when no data is available
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
	({ icon, title = 'No data found', description, action, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex flex-col items-center justify-center p-8 text-center', className)}
				{...props}
			>
				<div className="mb-4 text-gray-400">
					{icon || <Inbox className="mx-auto h-16 w-16" />}
				</div>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
				{description && (
					<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
				)}
				{action && <div className="mt-4">{action}</div>}
			</div>
		);
	}
);

EmptyState.displayName = 'EmptyState';