import { postFormSubmission } from "@/lib/api-client";
import type { FormSubmissionResult } from "@/types/form-submission";
import type { ProfileSubmitValues } from "../schemas/profile.schema";

/**
 * submitProfile - Sends the validated profile payload to the BFF.
 *
 * The browser never talks to the Go backend directly: the BFF route
 * validates the payload again and forwards it (AGENTS.md §9).
 */
export function submitProfile(
  values: ProfileSubmitValues,
): Promise<FormSubmissionResult<ProfileSubmitValues>> {
  return postFormSubmission<ProfileSubmitValues>("/profile", values);
}
