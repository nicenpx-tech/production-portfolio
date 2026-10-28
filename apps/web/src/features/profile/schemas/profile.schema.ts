import { z } from "zod";

export const PROFILE_ROLES = ["engineer", "designer", "manager"] as const;

export type ProfileRole = (typeof PROFILE_ROLES)[number];

/**
 * The canonical profile payload.
 *
 * Every rule lives here, so the browser, the BFF route, and the backend
 * validate the same values. The form schema below reuses these rules and
 * differs only in the input type of the year field.
 */
const profilePayloadShape = {
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name must be at most 50 characters."),
  role: z.enum(PROFILE_ROLES, "Please select a role."),
  experienceYears: z
    .number("Experience must be a number.")
    .int("Experience must be a whole number.")
    .min(0, "Experience cannot be negative.")
    .max(60, "Experience must be at most 60 years."),
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
};

/**
 * Cross-field rule: a shown email needs an address to show.
 *
 * The predicate is shared by both schemas so the browser and the server
 * enforce the same rule.
 */
const contactEmailRequired = (values: {
  showEmail: boolean;
  contactEmail?: string | undefined;
}) => !values.showEmail || (values.contactEmail?.length ?? 0) > 0;

const contactEmailRule = {
  message: "Add a contact email to show it on your profile.",
  path: ["contactEmail"],
};

/**
 * profilePayloadSchema - Contract that crosses the network.
 *
 * The form produces this shape, the BFF validates it, and the backend
 * receives it.
 */
export const profilePayloadSchema = z
  .object(profilePayloadShape)
  .refine(contactEmailRequired, contactEmailRule);

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
    ...profilePayloadShape,
    experienceYears: z
      .string()
      .min(1, "Experience is required.")
      .transform((value) => Number(value))
      .pipe(profilePayloadShape.experienceYears),
  })
  .refine(contactEmailRequired, contactEmailRule);

/** Payload type: the values that cross the network. */
export type ProfilePayload = z.output<typeof profilePayloadSchema>;

/** Form state type: what the fields hold (experienceYears is a string). */
export type ProfileFormValues = z.input<typeof profileSchema>;

/** Submit type: what validation produces (experienceYears is a number). */
export type ProfileSubmitValues = z.output<typeof profileSchema>;
