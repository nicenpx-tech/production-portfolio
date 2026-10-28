import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import type {
  FormSubmissionFailure,
  FormSubmissionResult,
} from "@/types/form-submission";

/**
 * Form submission handler.
 *
 * The handler owns exactly one job: turn a normalized submission result into
 * the right React Hook Form error location. Field problems become field
 * errors, every other failure becomes the form-level root error. It never
 * resets the form, so a failed submission keeps everything the user typed
 * (AGENTS.md §90, §91).
 */

export interface FormSubmissionHandlerOptions<
  TValues extends FieldValues,
  TData,
  TResponse,
> {
  /** Form instance that owns the field state the handler writes into. */
  form: UseFormReturn<TValues, unknown, TData>;
  /** Called once with the server payload after a successful submission. */
  onSuccess?: (data: TResponse) => void | Promise<void>;
  /** Called once with the normalized failure after a failed submission. */
  onError?: (failure: FormSubmissionFailure) => void;
}

/** Message shown when the submission never reached the server. */
const NETWORK_ERROR_MESSAGE =
  "Network error. Please check your connection and try again.";

/**
 * Writes a server field error onto the matching form field.
 *
 * The server addresses fields with plain strings, while React Hook Form
 * expects a typed path. Fields the form does not know are ignored, so a
 * stale or foreign path cannot corrupt the form state.
 */
function setFieldError<TValues extends FieldValues, TData>(
  form: UseFormReturn<TValues, unknown, TData>,
  field: string,
  message: string,
) {
  if (!(field in form.getValues())) {
    return;
  }

  form.setError(field as FieldPath<TValues>, {
    type: "validation",
    message,
  });
}

/**
 * Applies a failure to the form.
 *
 * A validation failure is reported on every affected field so the message
 * renders through the shared FormMessage, and additionally as a root error so
 * the failure is announced once at the form level.
 */
function applyFailure<TValues extends FieldValues, TData>(
  form: UseFormReturn<TValues, unknown, TData>,
  failure: FormSubmissionFailure,
) {
  if (failure.kind === "validation") {
    for (const fieldError of failure.fieldErrors ?? []) {
      setFieldError(form, fieldError.field, fieldError.message);
    }

    form.setError("root", { type: "validation", message: failure.message });
    return;
  }

  form.setError("root", { type: failure.kind, message: failure.message });
}

/**
 * submitWithFeedback - Bridges a submission function into React Hook Form.
 *
 * The submit function only has to resolve a normalized result; transport
 * problems, rejected payloads, and unexpected failures all arrive the same
 * way. A thrown error is treated as a network failure, because that is the
 * only thing a submit function can raise while talking to the BFF.
 */
export async function submitWithFeedback<
  TValues extends FieldValues,
  TData,
  TResponse = TData,
>(
  values: TData,
  submit: (values: TData) => Promise<FormSubmissionResult<TResponse>>,
  options: FormSubmissionHandlerOptions<TValues, TData, TResponse>,
): Promise<FormSubmissionResult<TResponse>> {
  const { form, onSuccess, onError } = options;

  // A new attempt starts from a clean slate, so messages from the previous
  // attempt cannot survive a successful resubmission (AGENTS.md §91).
  form.clearErrors();

  let result: FormSubmissionResult<TResponse>;

  try {
    result = await submit(values);
  } catch {
    result = {
      ok: false,
      failure: {
        kind: "network",
        message: NETWORK_ERROR_MESSAGE,
        code: "NETWORK_ERROR",
      },
    };
  }

  if (result.ok) {
    await onSuccess?.(result.data);
    return result;
  }

  applyFailure(form, result.failure);
  onError?.(result.failure);

  return result;
}
