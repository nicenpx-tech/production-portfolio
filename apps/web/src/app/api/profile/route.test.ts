import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const BACKEND_URL = "https://backend.test";

const VALID_PAYLOAD = {
  displayName: "Ada Lovelace",
  role: "engineer",
  experienceYears: 5,
  bio: "Pioneer of computing.",
  showEmail: true,
  contactEmail: "ada@example.com",
};

function profileRequest(body: unknown, headers: HeadersInit = {}): NextRequest {
  return new NextRequest("http://localhost/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe("POST /api/profile", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("BACKEND_API_URL", BACKEND_URL);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("rejects a payload the schema refuses and names the offending field", async () => {
    const response = await POST(
      profileRequest({ ...VALID_PAYLOAD, experienceYears: 900 }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.kind).toBe("validation");
    expect(body.error.fieldErrors).toContainEqual({
      field: "experienceYears",
      message: "Experience must be at most 60 years.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    const response = await POST(profileRequest("not json"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("INVALID_JSON");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards a valid payload to the backend and returns its result", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "profile-1" }));

    const response = await POST(profileRequest(VALID_PAYLOAD));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, data: { id: "profile-1" } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BACKEND_URL}/profile`);
    expect(JSON.parse(String(init.body))).toEqual(VALID_PAYLOAD);
  });

  it("forwards the session cookie so the backend can authenticate the call", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "profile-1" }));

    await POST(profileRequest(VALID_PAYLOAD, { cookie: "session=abc123" }));

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({ cookie: "session=abc123" });
  });

  it("translates a backend validation failure into field errors", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          success: false,
          error: {
            kind: "validation",
            message: "Please correct the highlighted fields and try again.",
            fieldErrors: [
              { field: "contactEmail", message: "Already in use." },
            ],
          },
        },
        400,
      ),
    );

    const response = await POST(profileRequest(VALID_PAYLOAD));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.fieldErrors).toEqual([
      { field: "contactEmail", message: "Already in use." },
    ]);
  });

  it("translates a backend auth failure into an unauthorized response", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          success: false,
          error: { kind: "auth", message: "Session expired." },
        },
        401,
      ),
    );

    const response = await POST(profileRequest(VALID_PAYLOAD));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.kind).toBe("auth");
  });

  it("reports an unreachable backend as a network failure", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const response = await POST(profileRequest(VALID_PAYLOAD));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error.kind).toBe("network");
  });

  it("reports a missing backend configuration without calling out", async () => {
    vi.stubEnv("BACKEND_API_URL", "");

    const response = await POST(profileRequest(VALID_PAYLOAD));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe("BACKEND_NOT_CONFIGURED");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
