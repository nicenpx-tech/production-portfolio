import * as React from 'react';
import { cn } from '../utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: string;
	thumbClassName?: string;
	trackClassName?: string;
}

/**
 * Switch - A toggle switch component
 * Used for binary on/off states
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
	({ className, label, thumbClassName, trackClassName, id, ...props }, ref) => {
		const switchId = id || React.useId();

		return (
			<div className="flex items-center gap-2">
				<input
					ref={ref}
					id={switchId}
					type="checkbox"
					role="switch"
					className={cn(
						'sr-only peer',
						className
					)}
					{...props}
				/>
				<label
					htmlFor={switchId}
					className={cn(
						'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
						'peer-checked:bg-indigo-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
						'bg-gray-200 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2',
						'dark:bg-gray-700 dark:peer-checked:bg-indigo-500',
						trackClassName
					)}
				>
					<span
						aria-hidden="true"
						className={cn(
							'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
							'peer-checked:translate-x-5',
							'translate-x-0',
							thumbClassName
						)}
					/>
				</label>
			{label && (
				<label
					htmlFor={switchId}
					className="text-sm font-medium text-gray-900 dark:text-gray-100"
				>
					{label}
				</label>
			)}
			</div>
		);
	}
);

Switch.displayName = 'Switch';