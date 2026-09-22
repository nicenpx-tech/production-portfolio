"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  Switch,
  Textarea,
} from "@repo/ui/components";
import { useForm } from "react-hook-form";
import {
  type FormFieldsValues,
  formFieldsSchema,
} from "../schemas/form-fields.schema";

const COUNTRIES = [
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
  { value: "us", label: "United States" },
] as const;

const PLANS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
] as const;

export interface FormFieldsExampleProps {
  /**
   * Receives the validated values on a successful submit. Submission is
   * local in this series; the BFF call arrives in a later series.
   */
  onSubmit?: (values: FormFieldsValues) => void;
}

/**
 * FormFieldsExample - Reference implementation for the field primitives.
 *
 * Demonstrates the two React Hook Form integration rules:
 * - Input, Textarea, and the native Select follow the standard input
 *   contract, so the RHF field is spread directly.
 * - Checkbox, RadioGroup, and Switch are controlled components with
 *   custom change callbacks, so field.value/field.onChange are mapped
 *   explicitly.
 *
 * Validation lives in formFieldsSchema (Zod); this component only
 * configures when validation runs. mode: "onBlur" avoids interrupting
 * the user mid-typing, while reValidateMode: "onChange" clears an
 * error as soon as the corrected value becomes valid after a failed
 * submit.
 *
 * All fields share one React Hook Form instance; no field-level useState.
 */
export function FormFieldsExample({ onSubmit }: FormFieldsExampleProps) {
  const form = useForm<FormFieldsValues>({
    resolver: zodResolver(formFieldsSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      message: "",
      country: "",
      terms: false,
      plan: "",
      notifications: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit?.(values))}
        noValidate
        className="space-y-6"
      >
        {/* Standard input contract: spread the RHF field onto the control. */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" autoComplete="name" {...field} />
              </FormControl>
              <FormDescription>Between 2 and 100 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help?" rows={5} {...field} />
              </FormControl>
              <FormDescription>Between 10 and 1000 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Native select follows the standard contract as well. */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="" disabled>
                    Select a country
                  </option>
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormDescription>Used to localize notifications.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Controlled components map field.value/field.onChange explicitly. */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel>Accept terms</FormLabel>
                  <FormDescription>
                    You must accept the terms to continue.
                  </FormDescription>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  aria-label="Plan"
                  className="flex flex-col gap-3 sm:flex-row sm:gap-6"
                >
                  {PLANS.map((plan) => (
                    <div key={plan.value} className="flex items-center gap-2">
                      <RadioGroupItem
                        id={`plan-${plan.value}`}
                        value={plan.value}
                      />
                      <Label htmlFor={`plan-${plan.value}`}>{plan.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel>Notifications</FormLabel>
                  <FormDescription>
                    Receive updates when someone responds.
                  </FormDescription>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
        {/* RHF owns the submitting state; no local loading state. */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting…" : "Submit"}
        </Button>
        {/* Form-level orientation line: points to the field errors instead
            of duplicating them. Field messages remain the single source
            per field. */}
        {form.formState.isSubmitted && !form.formState.isValid && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            Please correct the highlighted fields and try again.
          </p>
        )}
        {form.formState.isSubmitSuccessful && (
          <output className="block text-sm text-green-600 dark:text-green-400">
            Valid values confirmed locally. BFF submission will be added in a
            later series.
          </output>
        )}
      </form>
    </Form>
  );
}
