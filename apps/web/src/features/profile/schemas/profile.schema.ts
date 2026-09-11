import { z } from "zod";

export const PROFILE_ROLES = ["engineer", "designer", "manager"] as const;

export type ProfileRole = (typeof PROFILE_ROLES)[number];

/**
 * profileSchema - Single source of truth for profile validation.
 *
 * experienceYears demonstrates the input→output split the composition
 * layer is built around: the field holds the string a number input
 * produces, and validation transforms it into a number. Everything the
 * schema rejects (empty, non-numeric, fractional, out of range) is
 * reported per field; the cross-field rule targets contactEmail so the
 * message renders with the field it belongs to.
 */
export const profileSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Display name must be at least 2 characters.")
      .max(50, "Display name must be at most 50 characters."),
    role: z.enum(PROFILE_ROLES, "Please select a role."),
    experienceYears: z
      .string()
      .min(1, "Experience is required.")
      .transform((value) => Number(value))
      .pipe(
        z
          .number("Experience must be a number.")
          .int("Experience must be a whole number.")
          .min(0, "Experience cannot be negative.")
          .max(60, "Experience must be at most 60 years."),
      ),
    bio: z
      .string()
      .trim()
      .max(280, "Bio must be at most 280 characters.")
      .optional(),
    showEmail: z.boolean(),
    contactEmail: z
      .email("Enter a valid email address.")
      .or(z.literal(""))
      .optional(),
  })
  .refine(
    (values) => !values.showEmail || (values.contactEmail?.length ?? 0) > 0,
    {
      message: "Add a contact email to show it on your profile.",
      path: ["contactEmail"],
    },
  );

/** Form state type: what the fields hold (experienceYears is a string). */
export type ProfileFormValues = z.input<typeof profileSchema>;

/** Submit type: what validation produces (experienceYears is a number). */
export type ProfileSubmitValues = z.output<typeof profileSchema>;
