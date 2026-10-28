import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "./components/ContactForm";

const VALID_EMAIL = "ada@example.com";
const VALID_PHONE = "+81 3 1234 5678";

/**
 * The payload carries only the slot of the selected type, because the
 * schema publishes the visible value.
 */
const EXPECTED_EMAIL_PAYLOAD = {
  methods: [{ type: "email", value: VALID_EMAIL }],
  country: "jp",
  region: "tokyo",
};

async function fillEmailMethod(
  user: ReturnType<typeof userEvent.setup>,
  value = VALID_EMAIL,
) {
  await user.type(screen.getByLabelText("Email address"), value);
}

async function fillLocation(
  user: ReturnType<typeof userEvent.setup>,
  country = "jp",
  region = "tokyo",
) {
  await user.selectOptions(screen.getByLabelText("Country"), country);
  await user.selectOptions(screen.getByLabelText("Region"), region);
}

function regionOptions(): string[] {
  const region = screen.getByLabelText("Region") as HTMLSelectElement;
  return Array.from(region.options).map((option) => option.value);
}

describe("ContactForm", () => {
  it("renders one contact method with accessible names and the controls", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Contact type")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByLabelText("Region")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add contact method" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove contact method 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save contact methods" }),
    ).toBeInTheDocument();
  });

  it("adds a contact method and keeps the existing one", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(
      screen.getByRole("button", { name: "Add contact method" }),
    );

    expect(screen.getAllByLabelText("Contact type")).toHaveLength(2);
    expect(screen.getAllByLabelText("Email address")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Remove contact method 2" }),
    ).toBeInTheDocument();
  });

  it("removes a contact method", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(
      screen.getByRole("button", { name: "Add contact method" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Remove contact method 1" }),
    );

    expect(screen.getAllByLabelText("Contact type")).toHaveLength(1);
    expect(
      screen.queryByRole("button", { name: "Remove contact method 2" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the value a user typed in a removed method out of the payload", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ContactForm onSubmit={handleSubmit} />);

    await fillEmailMethod(user, "first@example.com");
    await user.click(
      screen.getByRole("button", { name: "Add contact method" }),
    );
    await user.type(
      screen.getAllByLabelText("Email address")[1] as HTMLElement,
      "second@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: "Remove contact method 1" }),
    );
    await fillLocation(user);
    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
    expect(handleSubmit).toHaveBeenCalledWith({
      methods: [{ type: "email", value: "second@example.com" }],
      country: "jp",
      region: "tokyo",
    });
  });

  it("submits the validated payload with the transformed value", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ContactForm onSubmit={handleSubmit} />);

    await fillEmailMethod(user);
    await fillLocation(user);
    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
    expect(handleSubmit).toHaveBeenCalledWith(EXPECTED_EMAIL_PAYLOAD);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("reports an invalid email on the field it belongs to", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillEmailMethod(user, "not-an-email");
    await fillLocation(user);
    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please correct the highlighted fields and try again."),
    ).toBeInTheDocument();
  });

  it("reports an invalid phone number on the field it belongs to", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.selectOptions(screen.getByLabelText("Contact type"), "phone");
    await user.type(screen.getByLabelText("Phone number"), "123");
    await fillLocation(user);
    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    expect(
      await screen.findByText("Enter a valid phone number."),
    ).toBeInTheDocument();
  });

  it("reports the minimum length when every contact method is removed", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(
      screen.getByRole("button", { name: "Remove contact method 1" }),
    );
    await fillLocation(user);
    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    expect(
      await screen.findByText("Add at least one contact method."),
    ).toBeInTheDocument();
  });

  it("stops adding methods at the maximum", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const addButton = screen.getByRole("button", {
      name: "Add contact method",
    });
    await user.click(addButton);
    await user.click(addButton);

    expect(screen.getAllByLabelText("Contact type")).toHaveLength(3);
    expect(addButton).toBeDisabled();
  });

  it("shows the phone field and hides the email field when the type changes", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    expect(screen.getByLabelText("Email address")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Contact type"), "phone");

    expect(screen.getByLabelText("Phone number")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument();
  });

  it("does not let a hidden field block the submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ContactForm onSubmit={handleSubmit} />);

    // An invalid email is typed, then the type changes: the hidden slot
    // must not fail the submission.
    await fillEmailMethod(user, "not-an-email");
    await user.selectOptions(screen.getByLabelText("Contact type"), "phone");
    await user.type(screen.getByLabelText("Phone number"), VALID_PHONE);
    await fillLocation(user);
    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
    expect(handleSubmit).toHaveBeenCalledWith({
      methods: [{ type: "phone", value: VALID_PHONE }],
      country: "jp",
      region: "tokyo",
    });
  });

  it("offers the regions of the chosen country", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    expect(regionOptions()).toEqual(["", "tokyo", "osaka"]);

    await user.selectOptions(screen.getByLabelText("Country"), "us");

    expect(regionOptions()).toEqual(["", "california", "new-york"]);
  });

  it("clears the region when the country changes", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillLocation(user, "jp", "osaka");
    expect(screen.getByLabelText("Region")).toHaveValue("osaka");

    await user.selectOptions(screen.getByLabelText("Country"), "de");

    expect(screen.getByLabelText("Region")).toHaveValue("");
    expect(regionOptions()).toEqual(["", "bavaria", "berlin"]);
  });

  it("reports a region that does not belong to the country", async () => {
    const user = userEvent.setup();
    render(
      <ContactForm
        defaultValues={{
          methods: [{ type: "email", email: VALID_EMAIL, phone: "" }],
          country: "jp",
          region: "bavaria",
        }}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    expect(
      await screen.findByText(
        "Select a region that belongs to the chosen country.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the entered values when a submission is rejected", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockRejectedValue(new Error("boom"));
    render(<ContactForm onSubmit={handleSubmit} />);

    await fillEmailMethod(user);
    await fillLocation(user);
    await user.click(
      screen.getByRole("button", { name: "Save contact methods" }),
    );

    expect(
      await screen.findByText(
        "Could not save your contact methods. Please try again.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveValue(VALID_EMAIL);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keeps the dynamic fields labelled and reachable", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(
      screen.getByRole("button", { name: "Add contact method" }),
    );

    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(1);

    for (const label of ["Contact type", "Email address"]) {
      const control = screen.getAllByLabelText(label);
      expect(control).toHaveLength(2);
      for (const element of control) {
        expect(element).toHaveAccessibleName(label);
      }
    }

    const email = screen.getAllByLabelText("Email address")[0];
    expect(email).toHaveAttribute("id");
    expect(
      within(groups[0] as HTMLElement).getByText("Contact method 1"),
    ).toBeInTheDocument();
  });
});
