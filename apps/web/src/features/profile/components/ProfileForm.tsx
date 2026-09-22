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
  Switch,
  Textarea,
} from "@repo/ui/components";
import type { DefaultValues } from "react-hook-form";
import { useZodForm } from "@/shared/forms";
import {
  PROFILE_ROLES,
  type ProfileFormValues,
  type ProfileRole,
  type ProfileSubmitValues,
  profileSchema,
} from "../schemas/profile.schema";

const ROLE_LABELS: Record<ProfileRole, string> = {
  engineer: "Engineer",
  designer: "Designer",
  manager: "Manager",
};

const ROLE_OPTIONS = PROFILE_ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

// Defaults use RHF's DeepValues shape: the role select starts without a
// choice (undefined) and renders its disabled placeholder option.
const EMPTY_PROFILE_VALUES: DefaultValues<ProfileFormValues> = {
  displayName: "",
  role: undefined,
  experienceYears: "",
  bio: "",
  showEmail: false,
  contactEmail: "",
};

export interface ProfileFormProps {
  /**
   * Receives the validated output values on a successful submit.
   * Rejections are surfaced once at the form level as the root error.
   * Submission is local in this series; the BFF call arrives later.
   */
  onSubmit?: (values: ProfileSubmitValues) => Promise<void>;
  /** Existing values for an edit form. */
  defaultValues?: ProfileFormValues;
}

/**
 * ProfileForm - Reference implementation for composed forms.
 *
 * The form instance comes from useZodForm, so resolver and validation
 * timing live in one shared place and this component only declares its
 * schema and default values. Validated values are handed to onSubmit
 * already transformed (experienceYears arrives as a number), while a
 * rejected submission surfaces once through FormRootError without
 * touching field state.
 */
export function ProfileForm({ onSubmit, defaultValues }: ProfileFormProps) {
  const form = useZodForm({
    schema: profileSchema,
    defaultValues: { ...EMPTY_PROFILE_VALUES, ...defaultValues },
  });

  const handleValidSubmit = async (values: ProfileSubmitValues) => {
    try {
      await onSubmit?.(values);
    } catch {
      // A rejected submission is a server concern: report it once at the
      // form level. React Hook Form clears root errors on the next submit
      // attempt, and field values are never modified.
      form.setError("root", {
        message: "Could not save your profile. Please try again.",
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
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" autoComplete="name" {...field} />
              </FormControl>
              <FormDescription>Between 2 and 50 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                {/* The placeholder option keeps the select controlled while
                    no role is chosen; Zod rejects it with a field message. */}
                <Select {...field} value={field.value ?? ""}>
                  <option value="" disabled>
                    Select a role
                  </option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormDescription>
                Shown next to your name on the profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience (years)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>Whole years, between 0 and 60.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short introduction"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional, up to 280 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="showEmail"
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
                  <FormLabel>Show email on my profile</FormLabel>
                  <FormDescription>
                    Requires a contact email below when enabled.
                  </FormDescription>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Required when your email is shown; otherwise optional.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* RHF owns the submitting state; no local loading state. */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save profile"}
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
            Profile saved.
          </output>
        )}
      </form>
    </Form>
  );
}
