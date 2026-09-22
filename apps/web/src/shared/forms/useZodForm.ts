import { zodResolver } from "@hookform/resolvers/zod";
import {
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import type { z } from "zod";

/**
 * RHF form instance for a Zod schema.
 *
 * Form state is typed by the schema input (what the fields hold), while
 * submit handlers receive the schema output (what validation produces),
 * so transformed values arrive fully typed.
 */
export type ZodForm<
  Output extends FieldValues,
  Input extends FieldValues = Output,
> = UseFormReturn<Input, unknown, Output>;

interface UseZodFormArgs<
  Output extends FieldValues,
  Input extends FieldValues = Output,
> {
  /** Zod schema that owns validation and the input→output transformation. */
  schema: z.ZodType<Output, Input>;
  defaultValues: DefaultValues<Input>;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onChange" | "onBlur";
  criteriaMode?: "firstError" | "all";
}

/**
 * useZodForm - Canonical React Hook Form setup for feature forms.
 *
 * Wires a Zod schema through zodResolver and applies the project's
 * validation UX convention (AGENTS.md §90): errors appear on blur or
 * submit, and clear as soon as a corrected value becomes valid after a
 * failed submit. Components stay free of resolver and timing setup;
 * feature forms only provide schema and default values.
 */
export function useZodForm<
  Output extends FieldValues,
  Input extends FieldValues = Output,
>(args: UseZodFormArgs<Output, Input>): ZodForm<Output, Input> {
  const {
    schema,
    defaultValues,
    mode = "onBlur",
    reValidateMode = "onChange",
    criteriaMode = "firstError",
  } = args;

  return useForm<Input, unknown, Output>({
    resolver: zodResolver(schema),
    mode,
    reValidateMode,
    criteriaMode,
    defaultValues,
  });
}
