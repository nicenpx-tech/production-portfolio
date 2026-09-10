import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const cardVariants = cva(
	'rounded-lg border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900',
	{
		variants: {
			variant: {
				default: 'border-gray-200',
				elevated: 'border-gray-200 shadow-md',
				outlined: 'border-2',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
	hoverable?: boolean;
}

/**
 * Card - A container component with optional compound components
 * Can have Header, Title, Content, and Footer sub-components
 */
export const Card = Object.assign(
	React.forwardRef<HTMLDivElement, CardProps>(
		({ variant, hoverable = false, className, children, ...props }, ref) => {
			return (
				<div
					ref={ref}
					className={cn(cardVariants({ variant }), hoverable && 'hover:shadow-md transition-shadow', className)}
					{...props}
				>
					{children}
				</div>
			);
		}
	),
	{
		Header: function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
			return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
		},
		Title: function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
			return <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />;
		},
		Description: function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
			return <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props} />;
		},
		Content: function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
			return <div className={cn('p-6 pt-0', className)} {...props} />;
		},
		Footer: function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
			return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
		},
	}
);

Card.displayName = 'Card';
