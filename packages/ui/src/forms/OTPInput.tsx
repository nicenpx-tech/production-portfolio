import * as React from 'react';
import { cn } from '../utils';

export interface OTPInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	length?: number;
	value?: string;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
	disabled?: boolean;
	error?: boolean;
}

/**
 * OTPInput - A one-time password input component
 * Used for 2FA and verification codes
 */
export const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
	(
		{ length = 6, value = '', onChange, onComplete, disabled = false, error = false, className, ...props },
		ref
	) => {
		const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

		const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			if (!/^[0-9]$/.test(newValue)) return;

			const newOTP = value.slice(0, index) + newValue + value.slice(index + 1);
			onChange?.(newOTP);

			// Move to next input
			if (index < length - 1) {
				inputRefs.current[index + 1]?.focus();
			}

			// Trigger onComplete if all digits filled
			if (newOTP.length === length) {
				onComplete?.(newOTP);
			}
		};

		const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Backspace' && !value[index] && index > 0) {
				inputRefs.current[index - 1]?.focus();
			}
		};

		const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
			e.preventDefault();
			const pastedData = e.clipboardData.getData('text').slice(0, length);
			if (!/^[0-9]+$/.test(pastedData)) return;

			onChange?.(pastedData);
			if (pastedData.length === length) {
				onComplete?.(pastedData);
			}
		};

		return (
			<div ref={ref} className={cn('flex gap-2', className)} {...props}>
				{Array.from({ length }).map((_, index) => (
					<input
						key={index}
						ref={(el) => {
						inputRefs.current[index] = el;
					}}
						type="text"
						inputMode="numeric"
						maxLength={1}
						value={value[index] || ''}
						onChange={(e) => handleChange(index, e)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onPaste={handlePaste}
						disabled={disabled}
						className={cn(
							'h-12 w-12 rounded-md border border-gray-300 bg-white text-center text-lg font-semibold',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
							error && 'border-red-500 focus-visible:ring-red-500'
						)}
					/>
				))}
			</div>
		);
	}
);

OTPInput.displayName = 'OTPInput';