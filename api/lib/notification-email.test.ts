import { afterEach, describe, expect, it, vi } from "vitest";
import { sendSubmissionNotification } from "./notification-email";

const envKeys = [
  "RESEND_API_KEY",
  "ADMIN_NOTIFICATION_EMAIL",
  "CONTACT_NOTIFICATION_EMAIL",
  "NOTIFICATION_FROM_EMAIL",
] as const;
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  for (const key of envKeys) {
    const value = originalEnv[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("sendSubmissionNotification", () => {
  it("fails safely when email environment variables are missing", async () => {
    for (const key of envKeys) delete process.env[key];
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const warnMock = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const result = await sendSubmissionNotification({
      type: "Contact Request",
      fields: [{ label: "Email", value: "client@example.com" }],
    });

    expect(result.sent).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(warnMock).toHaveBeenCalledWith(expect.stringContaining("notification skipped"));
  });

  it("calls Resend with the configured recipient and submission fields", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.ADMIN_NOTIFICATION_EMAIL = "admin@example.com";
    process.env.CONTACT_NOTIFICATION_EMAIL = "fallback@example.com";
    process.env.NOTIFICATION_FROM_EMAIL = "Morocco Incoming <notifications@example.com>";
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const infoMock = vi.spyOn(console, "info").mockImplementation(() => undefined);

    const result = await sendSubmissionNotification({
      type: "B2B Partner Request",
      replyTo: "partner@example.com",
      fields: [
        { label: "Agency Name", value: "Test Agency" },
        { label: "Website", value: "https://example.com" },
      ],
    });

    expect(result.sent).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0][1];
    const body = JSON.parse(String(request?.body));
    expect(body.to).toEqual(["admin@example.com"]);
    expect(body.text).toContain("Agency Name: Test Agency");
    expect(body.text).toContain("Website: https://example.com");
    expect(infoMock).toHaveBeenCalledWith(expect.stringContaining("notification sent"));
    expect(infoMock).toHaveBeenCalledWith(expect.stringContaining("admin@example.com"));
  });

  it("logs provider failures with the fallback recipient", async () => {
    process.env.RESEND_API_KEY = "re_test";
    delete process.env.ADMIN_NOTIFICATION_EMAIL;
    process.env.CONTACT_NOTIFICATION_EMAIL = "fallback@example.com";
    process.env.NOTIFICATION_FROM_EMAIL = "Morocco Incoming <notifications@example.com>";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("invalid sender", { status: 422 })));
    const warnMock = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const result = await sendSubmissionNotification({
      type: "Quote Request",
      fields: [{ label: "Email", value: "client@example.com" }],
    });

    expect(result.sent).toBe(false);
    expect(warnMock).toHaveBeenCalledWith(expect.stringContaining("notification failed"));
    expect(warnMock).toHaveBeenCalledWith(expect.stringContaining("fallback@example.com"));
  });
});
