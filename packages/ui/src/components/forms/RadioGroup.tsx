import * as React from 'react';
import { cn } from '../../utils';

interface RadioGroupContextValue {
	name?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Controlled selected value; pair with onValueChange */
	value?: string;
	/** Called with the newly selected value when a radio item changes */
	onValueChange?: (value: string) => void;
	/** Shared by every item so the browser groups them for arrow-key navigation */
	name?: string;
	/** Disables every item in the group */
	disabled?: boolean;
}

/**
 * RadioGroup - Bare group primitive for radio items
 * Renders a role="radiogroup" container and shares the controlled state
 * through context. FormControl injects the describedby/invalid ARIA
 * attributes onto the group so validation is announced for the whole set.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
	({ className, value, onValueChange, name, disabled, onBlur, ...props }, ref) => {
		const contextValue = React.useMemo(
			() => ({ name, value, onValueChange, onBlur, disabled }),
			[name, value, onValueChange, onBlur, disabled]
		);

		return (
			<RadioGroupContext.Provider value={contextValue}>
				<div
					ref={ref}
					role="radiogroup"
					className={cn('flex flex-col gap-2', className)}
					{...props}
				/>
			</RadioGroupContext.Provider>
		);
	}
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'onChange' | 'checked' | 'type'
	> {
	value: string;
}

/**
 * RadioGroupItem - A single radio option rendered on a native input
 * The input is visually hidden but stays in the accessibility tree and is
 * labelled by the consumer through id + htmlFor. The visible circle and dot
 * are direct siblings styled through peer variants, so checked, keyboard
 * focus, disabled, and aria-invalid states are reflected.
 */
export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
	({ className, value, ...props }, ref) => {
		const group = React.useContext(RadioGroupContext);
		const disabled = props.disabled ?? group.disabled;

		return (
			<span
				className={cn('relative inline-flex h-4 w-4 shrink-0 align-middle', className)}
			>
				<input
					ref={ref}
					type="radio"
					className="peer sr-only"
					name={group.name}
					value={value}
					checked={group.value === value}
					onChange={() => group.onValueChange?.(value)}
					onBlur={group.onBlur}
					disabled={disabled}
					{...props}
				/>
				<span
					aria-hidden="true"
					className={cn(
						'absolute inset-0 rounded-full border border-gray-300 bg-white transition-colors',
						'peer-checked:border-indigo-600',
						'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2',
						'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
						'peer-aria-invalid:border-red-500',
						'dark:border-gray-700 dark:bg-gray-900 dark:peer-checked:border-indigo-500'
					)}
				/>
				<span
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute inset-0 m-auto h-2 w-2 rounded-full bg-indigo-600 opacity-0 transition-opacity',
						'peer-checked:opacity-100',
						'peer-disabled:opacity-50',
						'dark:bg-indigo-500'
					)}
				/>
			</span>
		);
	}
);

RadioGroupItem.displayName = 'RadioGroupItem';
