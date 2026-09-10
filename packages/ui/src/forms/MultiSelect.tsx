import * as React from 'react';
import { cn } from '../utils';

export interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	label?: string;
	options: { value: string; label: string }[];
	value?: string[];
	onChange?: (values: string[]) => void;
	placeholder?: string;
	disabled?: boolean;
}

/**
 * MultiSelect - A multi-select dropdown component
 * Allows selecting multiple options from a list
 */
export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
	({ label, options, value = [], onChange, placeholder = 'Select options...', disabled, className }, ref) => {
		return (
			<div ref={ref} className={cn('w-full', className)}>
				{label && (
					<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
						{label}
					</label>
				)}
				<div className="relative">
					<button
						type="button"
						disabled={disabled}
						className={cn(
							'flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
						)}
					>
						<span className="text-gray-500 dark:text-gray-400">
							{value.length === 0 ? placeholder : `${value.length} selected`}
						</span>
						<span className="text-gray-400">▼</span>
					</button>
				</div>
				{/* TODO: Implement dropdown with checkboxes */}
			</div>
		);
	}
);

MultiSelect.displayName = 'MultiSelect';