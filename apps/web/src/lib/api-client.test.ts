import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { postFormSubmission } from "./api-client";

/**
 * The client only reads status and body, so the double answers exactly that.
 */
function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe("postFormSubmission", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the payload to the BFF route", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: true, data: { id: "1" } }),
    );

    const result = await postFormSubmission<{ id: string }>("/profile", {
      displayName: "Ada",
    });

    expect(result).toEqual({ ok: true, data: { id: "1" } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/profile");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(JSON.parse(String(init.body))).toEqual({ displayName: "Ada" });
  });

  it("reports field problems as a validation failure", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          success: false,
          error: {
            kind: "validation",
            message: "Please correct the highlighted fields and try again.",
            fieldErrors: [{ field: "displayName", message: "Too short." }],
          },
        },
        400,
      ),
    );

    const result = await postFormSubmission("/profile", {});

    expect(result).toEqual({
      ok: false,
      failure: {
        kind: "validation",
        message: "Please correct the highlighted fields and try again.",
        fieldErrors: [{ field: "displayName", message: "Too short." }],
      },
    });
  });

  it("reports a rejected payload without field problems as a business failure", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { success: false, error: { kind: "business", message: "Rejected." } },
        400,
      ),
    );

    const result = await postFormSubmission("/profile", {});

    expect(result).toEqual({
      ok: false,
      failure: { kind: "business", message: "Rejected." },
    });
  });

  it.each([
    [401, "UNAUTHORIZED"],
    [403, "FORBIDDEN"],
  ])("reports status %i as an auth failure", async (status, code) => {
    fetchMock.mockResolvedValue(jsonResponse({}, status));

    const result = await postFormSubmission("/profile", {});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.failure.kind).toBe("auth");
    expect(result.failure.code).toBe(code);
  });

  it("reports a server error as an unknown failure", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));

    const result = await postFormSubmission("/profile", {});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.failure.kind).toBe("unknown");
  });

  it("reports a transport problem as a network failure", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const result = await postFormSubmission("/profile", {});

    expect(result).toEqual({
      ok: false,
      failure: {
        kind: "network",
        message: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
      },
    });
  });

  it("reports a response without the documented envelope as an unknown failure", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ unexpected: true }));

    const result = await postFormSubmission("/profile", {});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.failure.code).toBe("INVALID_RESPONSE");
  });

  it("survives a response that is not JSON", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new SyntaxError("Unexpected token <");
      },
    } as unknown as Response);

    const result = await postFormSubmission("/profile", {});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.failure.kind).toBe("unknown");
  });
});
