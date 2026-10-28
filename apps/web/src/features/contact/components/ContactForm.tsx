"use client";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
  Input,
  Select,
} from "@repo/ui/components";
import { useFieldArray, useWatch } from "react-hook-form";
import { useZodForm } from "@/shared/forms";
import {
  CONTACT_METHOD_TYPES,
  COUNTRIES,
  type ContactFormValues,
  type ContactMethodType,
  type ContactSubmitValues,
  type Country,
  contactSchema,
  MAX_CONTACT_METHODS,
  REGIONS_BY_COUNTRY,
} from "../schemas/contact.schema";

const COUNTRY_LABELS: Record<Country, string> = {
  jp: "Japan",
  us: "United States",
  de: "Germany",
};

const REGION_LABELS: Record<string, string> = {
  tokyo: "Tokyo",
  osaka: "Osaka",
  california: "California",
  "new-york": "New York",
  bavaria: "Bavaria",
  berlin: "Berlin",
};

const METHOD_TYPE_LABELS: Record<ContactMethodType, string> = {
  email: "Email",
  phone: "Phone",
};

const EMPTY_METHOD: ContactFormValues["methods"][number] = {
  type: "email",
  email: "",
  phone: "",
};

/**
 * Reads the message of an error of the whole collection.
 *
 * React Hook Form nests an error of a repeated field under `root`, which
 * its types do not describe for array fields. The narrowing keeps the read
 * honest instead of casting.
 */
function readCollectionErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  if ("root" in error) {
    const root = error.root;
    if (
      root &&
      typeof root === "object" &&
      "message" in root &&
      typeof root.message === "string"
    ) {
      return root.message;
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return undefined;
}

export interface ContactFormProps {
  /**
   * Receives the validated payload on a successful submit.
   * Rejections are surfaced once at the form level as the root error.
   */
  onSubmit?: (values: ContactSubmitValues) => Promise<void>;
  /** Existing values for an edit form. */
  defaultValues?: ContactFormValues;
}

/**
 * ContactForm - Reference implementation for advanced form patterns.
 *
 * The form demonstrates the three patterns of this series:
 *
 * - a field array of contact methods, with the stable identity React Hook
 *   Form supplies for every item
 * - a conditional field, where only the slot of the selected type is
 *   rendered and validated
 * - a dependent field, where the country decides which regions may be
 *   chosen
 *
 * The schema owns every rule, so the hidden slot never blocks a
 * submission and the payload carries only the visible value.
 */
export function ContactForm({ onSubmit, defaultValues }: ContactFormProps) {
  const form = useZodForm({
    schema: contactSchema,
    defaultValues: {
      methods: [EMPTY_METHOD],
      country: "jp",
      region: "",
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "methods",
  });

  // The current values decide what is visible. Watching the form is the
  // pattern; mirroring a field in local state is not.
  const methods = useWatch({ control: form.control, name: "methods" });
  const watchedCountry = useWatch({ control: form.control, name: "country" });

  // The form state keeps the country as a string, so the known options
  // decide what it is. An unknown value falls back to the first country
  // instead of reaching an undefined list of regions.
  const country: Country =
    COUNTRIES.find((option) => option === watchedCountry) ?? "jp";

  const regions = REGIONS_BY_COUNTRY[country];
  const collectionError = readCollectionErrorMessage(
    form.formState.errors.methods,
  );

  const handleValidSubmit = async (values: ContactSubmitValues) => {
    try {
      await onSubmit?.(values);
    } catch {
      // A rejected submission is a server concern: report it once at the
      // form level. React Hook Form clears root errors on the next submit
      // attempt, and field values are never modified.
      form.setError("root", {
        message: "Could not save your contact methods. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleValidSubmit)}
        noValidate
        className="space-y-6"
      >
        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Contact methods
          </legend>

          {fields.map((field, index) => {
            // The watched value is the current type; the field array entry
            // only carries the identity of the item.
            const type = methods?.[index]?.type ?? "email";

            return (
              <div
                key={field.id}
                className="space-y-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Contact method {index + 1}
                </p>

                <FormField
                  control={form.control}
                  name={`methods.${index}.type`}
                  render={({ field: typeField }) => (
                    <FormItem>
                      <FormLabel>Contact type</FormLabel>
                      <FormControl>
                        <Select {...typeField} value={typeField.value}>
                          {CONTACT_METHOD_TYPES.map((option) => (
                            <option key={option} value={option}>
                              {METHOD_TYPE_LABELS[option]}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional field: only the slot of the selected type is
                    rendered, so the hidden one cannot block the submit. */}
                {type === "email" ? (
                  <FormField
                    control={form.control}
                    name={`methods.${index}.email`}
                    render={({ field: emailField }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...emailField}
                          />
                        </FormControl>
                        <FormDescription>
                          Only the visible field is validated.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name={`methods.${index}.phone`}
                    render={({ field: phoneField }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+81 3 1234 5678"
                            autoComplete="tel"
                            {...phoneField}
                          />
                        </FormControl>
                        <FormDescription>
                          Only the visible field is validated.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Remove contact method ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            );
          })}

          {collectionError && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {collectionError}
            </p>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={fields.length >= MAX_CONTACT_METHODS}
            onClick={() => append(EMPTY_METHOD)}
          >
            Add contact method
          </Button>
        </fieldset>

        <FormField
          control={form.control}
          name="country"
          render={({ field: countryField }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select
                  {...countryField}
                  onChange={(event) => {
                    countryField.onChange(event);
                    // The regions depend on the country, so the previous
                    // choice is cleared. This is an event, not derived
                    // state, so it belongs in the handler.
                    form.setValue("region", "");
                  }}
                >
                  {COUNTRIES.map((option) => (
                    <option key={option} value={option}>
                      {COUNTRY_LABELS[option]}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormDescription>
                Decides which regions can be chosen.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field: regionField }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Select {...regionField} value={regionField.value}>
                  <option value="">Select a region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {REGION_LABELS[region] ?? region}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RHF owns the submitting state; no local loading state. */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save contact methods"}
        </Button>
        {form.formState.isSubmitted && !form.formState.isValid && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            Please correct the highlighted fields and try again.
          </p>
        )}
        {/* Server and submission failures render once, at the form level. */}
        <FormRootError />
        {/* Success means the submit resolved and no root error stands. */}
        {form.formState.isSubmitSuccessful && !form.formState.errors.root && (
          <output className="block text-sm text-green-600 dark:text-green-400">
            Contact methods saved.
          </output>
        )}
      </form>
    </Form>
  );
}
