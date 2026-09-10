import { z } from "zod";

export const formFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must be at most 1000 characters."),
  country: z.string().min(1, "Please select a country."),
  terms: z
    .boolean()
    .refine((value) => value === true, "You must accept the terms."),
  plan: z.string().min(1, "Please select a plan."),
  notifications: z.boolean(),
});

export type FormFieldsValues = z.infer<typeof formFieldsSchema>;
