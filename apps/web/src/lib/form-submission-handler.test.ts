import type { UseFormReturn } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FormSubmissionResult } from "@/types/form-submission";
import { submitWithFeedback } from "./form-submission-handler";

/**
 * The handler only touches three members of the form instance, so the double
 * covers exactly those. Everything else stays untouched, which is what the
 * assertions below verify.
 */
interface MockForm {
  clearErrors: ReturnType<typeof vi.fn>;
  setError: ReturnType<typeof vi.fn>;
  getValues: ReturnType<typeof vi.fn>;
}

function createMockForm(
  values: Record<string, unknown> = { name: "", email: "" },
): MockForm {
  return {
    clearErrors: vi.fn(),
    setError: vi.fn(),
    getValues: vi.fn(() => values),
  };
}

function asForm<T extends Record<string, unknown>>(
  mock: MockForm,
): UseFormReturn<T> {
  return mock as unknown as UseFormReturn<T>;
}

describe("submitWithFeedback", () => {
  let form: MockForm;

  beforeEach(() => {
    form = createMockForm();
  });

  it("reports a successful submission and leaves the form untouched", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const result = await submitWithFeedback(
      { name: "Ada" },
      async () => ({ ok: true, data: { id: "1" } }),
      { form: asForm(form), onSuccess, onError },
    );

    expect(result).toEqual({ ok: true, data: { id: "1" } });
    expect(onSuccess).toHaveBeenCalledWith({ id: "1" });
    expect(onError).not.toHaveBeenCalled();
    expect(form.setError).not.toHaveBeenCalled();
  });

  it("maps field problems onto their field and reports them at the form level", async () => {
    const onError = vi.fn();

    const result = await submitWithFeedback(
      { name: "" },
      async () => ({
        ok: false,
        failure: {
          kind: "validation",
          message: "Please correct the highlighted fields and try again.",
          fieldErrors: [
            { field: "name", message: "Name is required." },
            { field: "email", message: "Invalid email." },
          ],
        },
      }),
      { form: asForm(form), onError },
    );

    expect(result.ok).toBe(false);
    expect(form.setError).toHaveBeenCalledWith("name", {
      type: "validation",
      message: "Name is required.",
    });
    expect(form.setError).toHaveBeenCalledWith("email", {
      type: "validation",
      message: "Invalid email.",
    });
    expect(form.setError).toHaveBeenCalledWith("root", {
      type: "validation",
      message: "Please correct the highlighted fields and try again.",
    });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("ignores field errors the form does not know", async () => {
    await submitWithFeedback(
      { name: "" },
      async () => ({
        ok: false,
        failure: {
          kind: "validation",
          message: "Please correct the highlighted fields and try again.",
          fieldErrors: [{ field: "unknownField", message: "Unknown." }],
        },
      }),
      { form: asForm(form) },
    );

    expect(form.setError).not.toHaveBeenCalledWith(
      "unknownField",
      expect.anything(),
    );
    // The failure is still reported at the form level.
    expect(form.setError).toHaveBeenCalledWith(
      "root",
      expect.objectContaining({ type: "validation" }),
    );
  });

  it.each([
    ["business", "This email is already in use."],
    ["auth", "Your session is no longer valid. Please sign in and try again."],
  ] as const)(
    "reports a %s failure as the root error",
    async (kind, message) => {
      const onError = vi.fn();

      await submitWithFeedback(
        { name: "Ada" },
        async () => ({ ok: false, failure: { kind, message } }),
        { form: asForm(form), onError },
      );

      expect(form.setError).toHaveBeenCalledTimes(1);
      expect(form.setError).toHaveBeenCalledWith("root", {
        type: kind,
        message,
      });
      expect(onError).toHaveBeenCalledWith({ kind, message });
    },
  );

  it("treats a thrown error as a network failure", async () => {
    const onError = vi.fn();

    const result = await submitWithFeedback(
      { name: "Ada" },
      async () => {
        throw new Error("connection reset");
      },
      { form: asForm(form), onError },
    );

    expect(result.ok).toBe(false);
    expect(form.setError).toHaveBeenCalledWith("root", {
      type: "network",
      message: "Network error. Please check your connection and try again.",
    });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("starts a new attempt from a clean slate", async () => {
    await submitWithFeedback(
      { name: "Ada" },
      async () => ({ ok: true, data: { id: "1" } }),
      { form: asForm(form) },
    );

    expect(form.clearErrors).toHaveBeenCalledTimes(1);
  });

  it("never resets the form, so a failed attempt keeps the entered values", async () => {
    const formWithReset = { ...form, reset: vi.fn() };

    await submitWithFeedback(
      { name: "Ada" },
      async () => ({
        ok: false,
        failure: { kind: "business", message: "Rejected." },
      }),
      { form: asForm(formWithReset) },
    );

    expect(formWithReset.reset).not.toHaveBeenCalled();
  });

  it("awaits an asynchronous success callback before resolving", async () => {
    const order: string[] = [];
    const onSuccess = vi.fn(async () => {
      order.push("callback");
    });

    await submitWithFeedback(
      { name: "Ada" },
      async () => ({ ok: true, data: { id: "1" } }),
      { form: asForm(form), onSuccess },
    );
    order.push("resolved");

    expect(order).toEqual(["callback", "resolved"]);
  });

  it("accepts a submit function that returns a plain result object", async () => {
    const submit = vi.fn(
      async (): Promise<FormSubmissionResult<{ id: string }>> => ({
        ok: true,
        data: { id: "1" },
      }),
    );

    const result = await submitWithFeedback({ name: "Ada" }, submit, {
      form: asForm(form),
    });

    expect(result.ok).toBe(true);
    expect(submit).toHaveBeenCalledWith({ name: "Ada" });
  });
});
