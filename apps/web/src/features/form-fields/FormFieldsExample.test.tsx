import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormFieldsExample } from "./components/FormFieldsExample";

const VALID_VALUES = {
  name: "Ada Lovelace",
  message: "This message is long enough.",
  country: "jp",
  terms: true,
  plan: "pro",
  notifications: true,
};

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), VALID_VALUES.name);
  await user.type(screen.getByLabelText("Message"), VALID_VALUES.message);
  await user.selectOptions(screen.getByLabelText("Country"), VALID_VALUES.country);
  await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));
  await user.click(screen.getByRole("radio", { name: "Pro" }));
  await user.click(screen.getByRole("switch", { name: "Notifications" }));
}

describe("FormFieldsExample", () => {
  it("renders every field with an accessible name and the submit button", () => {
    render(<FormFieldsExample />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Free" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Enterprise" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("shows validation messages for the required fields on empty submit", async () => {
    const user = userEvent.setup();
    render(<FormFieldsExample />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Name must be at least 2 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Message must be at least 10 characters."),
    ).toBeInTheDocument();
    expect(screen.getByText("Please select a country.")).toBeInTheDocument();
    expect(screen.getByText("You must accept the terms.")).toBeInTheDocument();
    expect(screen.getByText("Please select a plan.")).toBeInTheDocument();
  });

  it("selects a country option and clears the validation error", async () => {
    const user = userEvent.setup();
    render(<FormFieldsExample />);

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(
      await screen.findByText("Please select a country."),
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Country"), VALID_VALUES.country);

    expect(screen.getByLabelText("Country")).toHaveValue(VALID_VALUES.country);
    await waitFor(() => {
      expect(
        screen.queryByText("Please select a country."),
      ).not.toBeInTheDocument();
    });
  });

  it("toggles the checkbox from unchecked and clears the validation error", async () => {
    const user = userEvent.setup();
    render(<FormFieldsExample />);

    const terms = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(terms).not.toBeChecked();

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(
      await screen.findByText("You must accept the terms."),
    ).toBeInTheDocument();

    await user.click(terms);
    expect(terms).toBeChecked();
    await waitFor(() => {
      expect(
        screen.queryByText("You must accept the terms."),
      ).not.toBeInTheDocument();
    });
  });

  it("selects a radio option and clears the validation error", async () => {
    const user = userEvent.setup();
    render(<FormFieldsExample />);

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(
      await screen.findByText("Please select a plan."),
    ).toBeInTheDocument();

    const pro = screen.getByRole("radio", { name: "Pro" });
    expect(pro).not.toBeChecked();

    await user.click(pro);
    expect(pro).toBeChecked();
    expect(screen.getByRole("radio", { name: "Free" })).not.toBeChecked();
    await waitFor(() => {
      expect(screen.queryByText("Please select a plan.")).not.toBeInTheDocument();
    });
  });

  it("defaults the switch to off and toggles it on", async () => {
    const user = userEvent.setup();
    render(<FormFieldsExample />);

    const notifications = screen.getByRole("switch", {
      name: "Notifications",
    });
    expect(notifications).not.toBeChecked();

    await user.click(notifications);
    expect(notifications).toBeChecked();
  });

  it("toggles the checkbox with the keyboard", async () => {
    const user = userEvent.setup();
    render(<FormFieldsExample />);

    const terms = screen.getByRole("checkbox", { name: "Accept terms" });
    terms.focus();
    await user.keyboard(" ");

    expect(terms).toBeChecked();
  });

  it("delivers the expected values to onSubmit on a valid submit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<FormFieldsExample onSubmit={handleSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
    expect(handleSubmit).toHaveBeenCalledWith(VALID_VALUES);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("exposes labels, the invalid state, and error descriptions to assistive technology", async () => {
    const user = userEvent.setup();
    render(<FormFieldsExample />);

    // getByLabelText only succeeds when label and control are associated.
    const name = screen.getByLabelText("Name");
    expect(name).toHaveAccessibleName("Name");
    const country = screen.getByLabelText("Country");
    expect(country).toHaveAccessibleName("Country");
    expect(
      screen.getByRole("radiogroup", { name: "Plan" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    const invalidName = await screen.findByLabelText("Name");
    expect(invalidName).toBeInvalid();
    const invalidCountry = screen.getByLabelText("Country");
    expect(invalidCountry).toBeInvalid();
    expect(invalidCountry.getAttribute("aria-describedby")).toBeTruthy();

    const describedBy = invalidName.getAttribute("aria-describedby");
    const describedIds = describedBy?.split(" ") ?? [];
    expect(describedIds).toContain(
      screen.getByText("Between 2 and 100 characters.").id,
    );
    expect(describedIds).toContain(
      screen.getByText("Name must be at least 2 characters.").id,
    );
    for (const id of describedIds) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });
});
