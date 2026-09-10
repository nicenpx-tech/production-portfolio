import * as React from 'react';
import { TextField, type TextFieldProps } from './TextField';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'rightIcon' | 'onRightIconClick'> {
	hideToggle?: boolean;
}

/**
 * PasswordField - A specialized TextField for password input
 * Includes a visibility toggle button
 */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
	({ hideToggle = false, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);

		return (
			<TextField
				ref={ref}
				type={showPassword ? 'text' : 'password'}
				rightIcon={
					!hideToggle ? (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="text-gray-400 hover:text-gray-600 focus:outline-none"
							tabIndex={-1}
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					) : undefined
				}
				onRightIconClick={!hideToggle ? () => setShowPassword(!showPassword) : undefined}
				{...props}
			/>
		);
	}
);

PasswordField.displayName = 'PasswordField';