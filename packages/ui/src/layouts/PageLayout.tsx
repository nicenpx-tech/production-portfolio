import * as React from 'react';
import { cn } from '../utils';

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
	header?: React.ReactNode;
	aside?: React.ReactNode;
	asidePosition?: 'left' | 'right';
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * PageLayout - A standard page layout with optional header and sidebar
 */
export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
	({ header, aside, asidePosition = 'left', maxWidth = 'xl', className, children, ...props }, ref) => {
		const maxWidthClass = {
			sm: 'max-w-sm',
			md: 'max-w-md',
			lg: 'max-w-lg',
			xl: 'max-w-xl',
			'2xl': 'max-w-2xl',
			full: 'max-w-full',
		}[maxWidth];

		return (
			<div ref={ref} className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', className)} {...props}>
				{header && <header className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">{header}</header>}
				<div className={cn('mx-auto px-4 py-8 sm:px-6 lg:px-8', maxWidthClass)}>
					<div className="flex gap-8">
						{aside && asidePosition === 'left' && <aside className="w-64 shrink-0">{aside}</aside>}
						<main className="flex-1">{children}</main>
						{aside && asidePosition === 'right' && <aside className="w-64 shrink-0">{aside}</aside>}
					</div>
				</div>
			</div>
		);
	}
);

PageLayout.displayName = 'PageLayout';