import * as React from 'react';
import { TextField, type TextFieldProps } from './TextField';
import { Calendar } from 'lucide-react';

export interface DatePickerProps extends Omit<TextFieldProps, 'value' | 'onChange' | 'type'> {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	minDate?: Date;
	maxDate?: Date;
	disabledDates?: Date[];
}

/**
 * DatePicker - A date input component
 * Allows selecting dates from a calendar picker
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
	({ value, onChange, minDate, maxDate, disabledDates, rightIcon, ...props }, ref) => {
		const displayValue = value ? value.toISOString().split('T')[0] : '';

		return (
			<TextField
				ref={ref}
				type="date"
				value={displayValue}
				onChange={(e) => {
					const date = e.target.value ? new Date(e.target.value) : undefined;
					onChange?.(date);
				}}
				rightIcon={rightIcon || <Calendar className="h-4 w-4 text-gray-400" />}
				{...props}
			/>
		);
	}
);

DatePicker.displayName = 'DatePicker';