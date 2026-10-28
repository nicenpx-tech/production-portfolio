import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileForm } from "./components/ProfileForm";

const VALID_VALUES = {
  displayName: "Ada Lovelace",
  role: "engineer",
  experienceYears: "5",
  bio: "Pioneer of computing.",
  showEmail: true,
  contactEmail: "ada@example.com",
} as const;

// experienceYears arrives as a number: the schema owns the transformation
// from the string a number input produces.
const EXPECTED_PAYLOAD = {
  displayName: "Ada Lovelace",
  role: "engineer",
  experienceYears: 5,
  bio: "Pioneer of computing.",
  showEmail: true,
  contactEmail: "ada@example.com",
};

// Programmatically built so the fixture stays readable while exceeding
// the schema limit by exactly one character.
const LONG_BIO = "x".repeat(281);

const ROOT_ERROR = "Could not save your profile. Please try again.";

/**
 * The BFF answers with the shared submission contract; the client only reads
 * the status and the body.
 */
function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

function successResponse(): Response {
  return jsonResponse({ success: true, data: { id: "profile-1" } });
}

function failureResponse(
  error: Record<string, unknown>,
  status = 400,
): Response {
  return jsonResponse({ success: false, error }, status);
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText("Display name"),
    VALID_VALUES.displayName,
  );
  await user.selectOptions(screen.getByLabelText("Role"), VALID_VALUES.role);
  await user.type(
    screen.getByLabelText("Experience (years)"),
    VALID_VALUES.experienceYears,
  );
  await user.type(screen.getByLabelText("Bio"), VALID_VALUES.bio);
  await user.click(
    screen.getByRole("switch", { name: "Show email on my profile" }),
  );
  await user.type(
    screen.getByLabelText("Contact email"),
    VALID_VALUES.contactEmail,
  );
}

describe("ProfileForm", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () => successResponse());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders every field with an accessible name and the submit button", () => {
    render(<ProfileForm />);

    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
    expect(screen.getByLabelText("Role")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience (years)")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Show email on my profile" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Contact email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save profile" }),
    ).toBeInTheDocument();
  });

  it("renders provided default values for an edit form", () => {
    render(<ProfileForm defaultValues={{ ...VALID_VALUES }} />);

    expect(screen.getByLabelText("Display name")).toHaveValue(
      VALID_VALUES.displayName,
    );
    expect(screen.getByLabelText("Role")).toHaveValue(VALID_VALUES.role);
    expect(screen.getByLabelText("Experience (years)")).toHaveValue(5);
    expect(screen.getByLabelText("Bio")).toHaveValue(VALID_VALUES.bio);
    expect(
      screen.getByRole("switch", { name: "Show email on my profile" }),
    ).toBeChecked();
    expect(screen.getByLabelText("Contact email")).toHaveValue(
      VALID_VALUES.contactEmail,
    );
  });

  it("shows multiple required messages and the form-level line on empty submit", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(
      await screen.findByText("Display name must be at least 2 characters."),
    ).toBeInTheDocument();
    expect(screen.getByText("Please select a role.")).toBeInTheDocument();
    expect(screen.getByText("Experience is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Please correct the highlighted fields and try again."),
    ).toBeInTheDocument();
  });

  it("does not reach the BFF while values are invalid", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<ProfileForm onSuccess={onSuccess} />);

    await user.click(screen.getByRole("button", { name: "Save profile" }));
    await screen.findByText("Experience is required.");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("shows field messages for values the schema rejects", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.type(screen.getByLabelText("Display name"), "A");
    await user.type(screen.getByLabelText("Experience (years)"), "70");
    await user.type(screen.getByLabelText("Bio"), LONG_BIO);
    await user.type(screen.getByLabelText("Contact email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(
      await screen.findByText("Display name must be at least 2 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Experience must be at most 60 years."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bio must be at most 280 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("does not interrupt typing with errors before the first blur or submit", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    // mode: "onBlur" - an invalid value must not shout while typing.
    await user.type(screen.getByLabelText("Display name"), "A");
    expect(
      screen.queryByText("Display name must be at least 2 characters."),
    ).not.toBeInTheDocument();

    // Leaving the field runs the validation for the first time.
    await user.tab();
    expect(
      await screen.findByText("Display name must be at least 2 characters."),
    ).toBeInTheDocument();
  });

  it("clears a field message as soon as the corrected value is valid", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(
      await screen.findByText("Display name must be at least 2 characters."),
    ).toBeInTheDocument();

    // reValidateMode: "onChange" - no blur or second submit required.
    await user.type(screen.getByLabelText("Display name"), "Ada Lovelace");
    await waitFor(() => {
      expect(
        screen.queryByText("Display name must be at least 2 characters."),
      ).not.toBeInTheDocument();
    });
  });

  it("posts the transformed payload to the BFF and confirms success", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<ProfileForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/profile");
    expect(JSON.parse(String(init.body))).toEqual(EXPECTED_PAYLOAD);
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("disables the submit button while submission is in progress", async () => {
    const user = userEvent.setup();
    let resolveFetch: ((response: Response) => void) | undefined;
    fetchMock.mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    render(<ProfileForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    const submittingButton = screen.getByRole("button", {
      name: "Saving…",
    });
    expect(submittingButton).toBeDisabled();

    resolveFetch?.(successResponse());
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Save profile" }),
      ).toBeEnabled();
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("surfaces a rejected submission once at the form level and keeps field values", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      failureResponse({ kind: "business", message: "Profile already exists." }),
    );
    render(<ProfileForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(
      await screen.findByText("Profile already exists."),
    ).toBeInTheDocument();
    // Field values survive a failed submission untouched.
    expect(screen.getByLabelText("Display name")).toHaveValue(
      VALID_VALUES.displayName,
    );
    // No success confirmation while the root error stands.
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("reports a field problem from the server on its field and at the form level", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      failureResponse({
        kind: "validation",
        message: "Please correct the highlighted fields and try again.",
        fieldErrors: [
          { field: "contactEmail", message: "This email is already in use." },
        ],
      }),
    );
    render(<ProfileForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(
      await screen.findByText("This email is already in use."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please correct the highlighted fields and try again."),
    ).toBeInTheDocument();
    // The entered values are still there, so the user can correct one field.
    expect(screen.getByLabelText("Contact email")).toHaveValue(
      VALID_VALUES.contactEmail,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("reports a transport failure once at the form level", async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<ProfileForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(
      await screen.findByText(
        "Network error. Please check your connection and try again.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("clears the root error on the next submit attempt after recovery", async () => {
    const user = userEvent.setup();
    fetchMock
      .mockResolvedValueOnce(
        failureResponse({
          kind: "business",
          message: "Profile already exists.",
        }),
      )
      .mockResolvedValueOnce(successResponse());
    render(<ProfileForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(
      await screen.findByText("Profile already exists."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Profile already exists."),
    ).not.toBeInTheDocument();
  });

  it("surfaces a failing success handler once at the form level", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn().mockRejectedValue(new Error("boom"));
    render(<ProfileForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(await screen.findByText(ROOT_ERROR)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("reports the cross-field rule on contactEmail and clears it when satisfied", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    // Object-level refinements only run once every field check passes,
    // so every other field is filled before submitting.
    await user.type(
      screen.getByLabelText("Display name"),
      VALID_VALUES.displayName,
    );
    await user.selectOptions(screen.getByLabelText("Role"), VALID_VALUES.role);
    await user.type(
      screen.getByLabelText("Experience (years)"),
      VALID_VALUES.experienceYears,
    );
    await user.click(
      screen.getByRole("switch", { name: "Show email on my profile" }),
    );
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(
      await screen.findByText(
        "Add a contact email to show it on your profile.",
      ),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText("Contact email"),
      VALID_VALUES.contactEmail,
    );
    await waitFor(() => {
      expect(
        screen.queryByText("Add a contact email to show it on your profile."),
      ).not.toBeInTheDocument();
    });
  });

  it("exposes labels, the invalid state, and error descriptions to assistive technology", async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);

    // getByLabelText only succeeds when label and control are associated.
    const displayName = screen.getByLabelText("Display name");
    expect(displayName).toHaveAccessibleName("Display name");
    const role = screen.getByLabelText("Role");
    expect(role).toHaveAccessibleName("Role");
    expect(
      screen.getByRole("switch", { name: "Show email on my profile" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save profile" }));

    const invalidDisplayName = await screen.findByLabelText("Display name");
    expect(invalidDisplayName).toBeInvalid();
    const invalidRole = screen.getByLabelText("Role");
    expect(invalidRole).toBeInvalid();
    expect(invalidRole.getAttribute("aria-describedby")).toBeTruthy();

    const describedBy = invalidDisplayName.getAttribute("aria-describedby");
    const describedIds = describedBy?.split(" ") ?? [];
    expect(describedIds).toContain(
      screen.getByText("Between 2 and 50 characters.").id,
    );
    expect(describedIds).toContain(
      screen.getByText("Display name must be at least 2 characters.").id,
    );
    for (const id of describedIds) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });
});
