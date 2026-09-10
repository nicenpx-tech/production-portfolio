import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormFoundationExample } from "./components/FormFoundationExample";

const VALID_VALUES = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "This message is long enough.",
};

describe("FormFoundationExample", () => {
  it("renders the name, email, and message fields with a submit button", () => {
    render(<FormFoundationExample />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("shows all validation messages when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<FormFoundationExample />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText("Name must be at least 2 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Message must be at least 10 characters."),
    ).toBeInTheDocument();
  });

  it("submits valid values without showing validation messages", async () => {
    const user = userEvent.setup();
    render(<FormFoundationExample />);

    await user.type(screen.getByLabelText("Name"), VALID_VALUES.name);
    await user.type(screen.getByLabelText("Email"), VALID_VALUES.email);
    await user.type(screen.getByLabelText("Message"), VALID_VALUES.message);
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Name must be at least 2 characters."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Enter a valid email address."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Message must be at least 10 characters."),
    ).not.toBeInTheDocument();
  });

  it("associates labels with controls and exposes the invalid state accessibly", async () => {
    const user = userEvent.setup();
    render(<FormFoundationExample />);

    // getByLabelText only succeeds when label and control are associated.
    const name = screen.getByLabelText("Name");
    expect(name).toHaveAccessibleName("Name");

    await user.click(screen.getByRole("button", { name: "Submit" }));

    const invalidName = await screen.findByLabelText("Name");
    expect(invalidName).toBeInvalid();

    const describedBy = invalidName.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
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
