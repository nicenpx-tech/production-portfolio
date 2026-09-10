import * as React from 'react';
import { cn } from '../utils';
import type { RadioProps } from './Radio';
import { Radio } from './Radio';

interface RadioGroupContextValue {
	name?: string;
	value?: string;
	onChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
	name: undefined,
	value: undefined,
	onChange: undefined,
});

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	name?: string;
	value?: string;
	onChange?: (value: string) => void;
}

/**
 * RadioGroup - A group of radio buttons that share the same name
 * Only one radio button can be selected at a time
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
	({ className, name, value, onChange, ...props }, ref) => {
		const contextValue = React.useMemo(
			() => ({ name, value, onChange }),
			[name, value, onChange]
		);

		return (
			<RadioGroupContext.Provider value={contextValue}>
				<div ref={ref} role="radiogroup" className={cn('flex flex-col gap-2', className)} {...props} />
			</RadioGroupContext.Provider>
		);
	}
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends Omit<RadioProps, 'name' | 'value' | 'onChange'> {
	value: string;
}

/**
 * RadioGroupItem - An individual radio button within a RadioGroup
 */
export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
	({ value, ...props }, ref) => {
		const context = React.useContext(RadioGroupContext);

		return (
			<Radio
				ref={ref}
				name={context.name}
				value={value}
				checked={context.value === value}
				onChange={(e) => context.onChange?.(e.target.value)}
				{...props}
			/>
		);
	}
);

RadioGroupItem.displayName = 'RadioGroupItem';