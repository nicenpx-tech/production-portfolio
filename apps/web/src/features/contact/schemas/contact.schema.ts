import { z } from "zod";

/**
 * Contact methods, conditional fields, and a dependent field.
 *
 * The schema is the source of truth: it validates a repeated collection,
 * validates only the field the user can actually see, and turns the form
 * state into a clean payload.
 */

export const CONTACT_METHOD_TYPES = ["email", "phone"] as const;

export type ContactMethodType = (typeof CONTACT_METHOD_TYPES)[number];

export const COUNTRIES = ["jp", "us", "de"] as const;

export type Country = (typeof COUNTRIES)[number];

/**
 * Regions per country.
 *
 * The mapping is local and deterministic: a dependent field must not need a
 * request to know what it may offer.
 */
export const REGIONS_BY_COUNTRY: Record<Country, readonly string[]> = {
  jp: ["tokyo", "osaka"],
  us: ["california", "new-york"],
  de: ["bavaria", "berlin"],
};

export const MIN_CONTACT_METHODS = 1;

export const MAX_CONTACT_METHODS = 3;

const EMAIL_ERROR = "Enter a valid email address.";
const PHONE_ERROR = "Enter a valid phone number.";

/**
 * One contact method.
 *
 * The form holds both slots, but only the visible one is validated, so a
 * hidden field never blocks the submission. The transform then publishes
 * the single slot that belongs to the selected type.
 */
const contactMethodSchema = z
  .object({
    type: z.enum(CONTACT_METHOD_TYPES),
    email: z.string(),
    phone: z.string(),
  })
  .superRefine((method, ctx) => {
    if (method.type === "email") {
      const email = z.email(EMAIL_ERROR).safeParse(method.email);

      if (!email.success) {
        ctx.addIssue({
          code: "custom",
          message: EMAIL_ERROR,
          path: ["email"],
        });
      }

      return;
    }

    const phone = z
      .string()
      .min(7, PHONE_ERROR)
      .max(20, PHONE_ERROR)
      .safeParse(method.phone);

    if (!phone.success) {
      ctx.addIssue({
        code: "custom",
        message: PHONE_ERROR,
        path: ["phone"],
      });
    }
  })
  .transform((method) =>
    method.type === "email"
      ? { type: "email" as const, value: method.email.trim() }
      : { type: "phone" as const, value: method.phone.trim() },
  );

/**
 * contactSchema - Single source of truth for the contact form.
 *
 * The collection rules live on the array, the per-item rules on the item,
 * and the dependency rule on the object: the region must belong to the
 * chosen country, and the issue is attached to the region it belongs to.
 */
export const contactSchema = z
  .object({
    methods: z
      .array(contactMethodSchema)
      .min(MIN_CONTACT_METHODS, "Add at least one contact method.")
      .max(
        MAX_CONTACT_METHODS,
        `You can add at most ${MAX_CONTACT_METHODS} contact methods.`,
      ),
    country: z.enum(COUNTRIES, "Select a country."),
    region: z.string().min(1, "Select a region."),
  })
  .refine(
    (values) => REGIONS_BY_COUNTRY[values.country].includes(values.region),
    {
      message: "Select a region that belongs to the chosen country.",
      path: ["region"],
    },
  );

/** Form state type: what the fields hold. */
export type ContactFormValues = z.input<typeof contactSchema>;

/** Submit type: what validation produces. */
export type ContactSubmitValues = z.output<typeof contactSchema>;
