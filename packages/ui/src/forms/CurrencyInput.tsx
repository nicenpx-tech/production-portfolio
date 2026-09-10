import * as React from 'react';
import { TextField, type TextFieldProps } from './TextField';

export interface CurrencyInputProps extends Omit<TextFieldProps, 'onChange'> {
	value?: number;
	onChange?: (value: number | undefined) => void;
	currency?: string;
	locale?: string;
	min?: number;
	max?: number;
}

/**
 * CurrencyInput - A specialized TextField for currency input
 * Formats values as currency and handles numeric parsing
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ value, onChange, currency = 'USD', locale = 'en-US', min, max, ...props }, ref) => {
		const [displayValue, setDisplayValue] = React.useState('');

		React.useEffect(() => {
			if (value !== undefined) {
				setDisplayValue(
					new Intl.NumberFormat(locale, {
						style: 'currency',
						currency,
					}).format(value)
				);
			}
		}, [value, currency, locale]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const rawValue = e.target.value.replace(/[^0-9.-]/g, '');
			const numValue = parseFloat(rawValue);

			if (isNaN(numValue)) {
				setDisplayValue('');
				onChange?.(undefined);
				return;
			}

			if (min !== undefined && numValue < min) return;
			if (max !== undefined && numValue > max) return;

			onChange?.(numValue);
		};

		return (
			<TextField
				ref={ref}
				value={displayValue}
				onChange={handleChange}
				leftIcon={
					<span className="text-gray-500 dark:text-gray-400">
						{new Intl.NumberFormat(locale, {
							style: 'currency',
							currency,
						})
							.format(0)
							.replace(/[0-9]/g, '')
							.trim()}
					</span>
				}
				{...props}
			/>
		);
	}
);

CurrencyInput.displayName = 'CurrencyInput';