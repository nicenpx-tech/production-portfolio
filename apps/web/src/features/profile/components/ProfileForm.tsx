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
import { submitWithFeedback } from "@/lib/form-submission-handler";
import { useZodForm } from "@/shared/forms";
import {
  PROFILE_ROLES,
  type ProfileFormValues,
  type ProfileRole,
  type ProfileSubmitValues,
  profileSchema,
} from "../schemas/profile.schema";
import { submitProfile } from "../services/profile-service";

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
   * Called with the accepted payload after the BFF confirmed the submission.
   * A rejection is surfaced once at the form level as the root error.
   */
  onSuccess?: (values: ProfileSubmitValues) => void | Promise<void>;
  /** Existing values for an edit form. */
  defaultValues?: ProfileFormValues;
}

/**
 * ProfileForm - Reference implementation for composed forms.
 *
 * The form instance comes from useZodForm, so resolver and validation
 * timing live in one shared place and this component only declares its
 * schema and default values. Validated values are handed to the BFF already
 * transformed (experienceYears arrives as a number). Failures come back as
 * normalized submission results: field problems land on their field, every
 * other failure surfaces once through FormRootError without touching the
 * values the user typed.
 */
export function ProfileForm({ onSuccess, defaultValues }: ProfileFormProps) {
  const form = useZodForm({
    schema: profileSchema,
    defaultValues: { ...EMPTY_PROFILE_VALUES, ...defaultValues },
  });

  const handleValidSubmit = async (values: ProfileSubmitValues) => {
    const result = await submitWithFeedback(values, submitProfile, { form });

    if (!result.ok) {
      return;
    }

    try {
      // The payload was accepted. The caller gets the values it submitted,
      // so it can refresh its cache with what the user entered.
      await onSuccess?.(values);
    } catch {
      // The payload was accepted but the follow-up work failed: report it
      // once at the form level and keep the values so the user can retry.
      form.setError("root", {
        type: "server",
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
        {/* Client-side validation reports once. A server failure already
            arrives as the root error, so the line never appears twice. */}
        {form.formState.isSubmitted &&
          !form.formState.isValid &&
          !form.formState.errors.root && (
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
