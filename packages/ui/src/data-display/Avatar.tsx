import * as React from 'react';
import { cn } from '../utils';
import { getInitials } from '../utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	src?: string;
	alt?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	fallback?: string;
}

/**
 * Avatar - A user profile image component
 * Falls back to initials if no image provided
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
	({ src, alt, size = 'md', fallback, className, ...props }, ref) => {
		const [imageError, setImageError] = React.useState(false);

		const sizeClasses = {
			sm: 'h-8 w-8 text-xs',
			md: 'h-10 w-10 text-sm',
			lg: 'h-12 w-12 text-base',
			xl: 'h-16 w-16 text-lg',
		};

		if (src && !imageError) {
			return (
				<div ref={ref} className={cn('rounded-full overflow-hidden', sizeClasses[size], className)} {...props}>
					<img
						src={src}
						alt={alt}
						onError={() => setImageError(true)}
						className="h-full w-full object-cover"
					/>
				</div>
			);
		}

		return (
			<div
				ref={ref}
				className={cn(
					'flex items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
					sizeClasses[size],
					className
				)}
				{...props}
			>
				{fallback || getInitials(alt || 'User')}
			</div>
		);
	}
);

Avatar.displayName = 'Avatar';