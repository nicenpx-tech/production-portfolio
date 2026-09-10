'use client';

import * as React from 'react';
import {
	Controller,
	FormProvider,
	useFormContext,
	useFormState,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form';
import { cn } from '../../utils';
import { Label } from './Label';

interface FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	name: TName;
}

interface FormItemContextValue {
	id: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/**
 * useFormField - Read the React Hook Form state and the accessibility IDs
 * of the enclosing form item.
 *
 * Must be used within <Form> > <FormField> > <FormItem>.
 */
export const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);

	if (!fieldContext) {
		throw new Error('useFormField must be used within a <FormField> component.');
	}

	if (!itemContext) {
		throw new Error('useFormField must be used within a <FormItem> component.');
	}

	const { getFieldState } = useFormContext();
	const formState = useFormState({ name: fieldContext.name });
	const fieldState = getFieldState(fieldContext.name, formState);
	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

/**
 * Form - Connects all form primitives to a single React Hook Form instance
 */
export const Form = FormProvider;

/**
 * FormField - Controller bound to a form field name
 */
export const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

/**
 * FormItem - Groups a label, control, description, and message for one field
 * and generates the stable IDs used for label/control association
 */
export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const id = React.useId();

		return (
			<FormItemContext.Provider value={{ id }}>
				<div ref={ref} className={cn('space-y-2', className)} {...props} />
			</FormItemContext.Provider>
		);
	}
);

FormItem.displayName = 'FormItem';

/**
 * FormLabel - Label associated with the field control through htmlFor
 */
export const FormLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof Label>>(
	({ className, ...props }, ref) => {
		const { error, formItemId } = useFormField();

		return (
			<Label
				ref={ref}
				htmlFor={formItemId}
				className={cn(error && 'text-red-600 dark:text-red-400', className)}
				{...props}
			/>
		);
	}
);

FormLabel.displayName = 'FormLabel';

/**
 * FormControl - Injects the generated id and ARIA attributes into its child
 * so the control is labelled and described without manual wiring
 */
interface FormControlProps {
	children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}

export const FormControl = ({ children }: FormControlProps) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

	return React.cloneElement(children, {
		id: formItemId,
		'aria-describedby': error
			? `${formDescriptionId} ${formMessageId}`
			: formDescriptionId,
		'aria-invalid': !!error,
	});
};

/**
 * FormDescription - Hint text linked to the control through aria-describedby
 */
export const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField();

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
			{...props}
		/>
	);
});

FormDescription.displayName = 'FormDescription';

/**
 * FormMessage - Validation message announced through role="alert"
 * Renders nothing while the field has no error and no custom children
 */
export const FormMessage = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message ?? '') : children;

	if (!body) {
		return null;
	}

	return (
		<p
			ref={ref}
			id={formMessageId}
			role="alert"
			className={cn('text-sm text-red-600 dark:text-red-400', className)}
			{...props}
		>
			{body}
		</p>
	);
});

FormMessage.displayName = 'FormMessage';
