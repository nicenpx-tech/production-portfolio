import { profilePayloadSchema } from "@/features/profile/schemas/profile.schema";
import { createFormSubmissionRoute } from "@/lib/form-submission-route";

/**
 * POST /api/profile - BFF route for the profile form.
 *
 * The browser posts the validated payload, the route validates it again on
 * the server, and forwards it to the Go backend. The response always uses the
 * shared submission contract, so the browser never parses a backend-specific
 * error format (AGENTS.md §9, §24).
 */
export const POST = createFormSubmissionRoute({
  schema: profilePayloadSchema,
  backendPath: "/profile",
});
