import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildQuoteRequestInput } from "../../src/lib/quote-request";

const mocks = vi.hoisted(() => ({ values: vi.fn(), insert: vi.fn(), notify: vi.fn() }));
vi.mock("../queries/connection", () => ({ getDb: () => ({ insert: mocks.insert }) }));
vi.mock("./notification-email", () => ({ sendSubmissionNotification: mocks.notify }));
import { formsRouter } from "../blog-router";

let client = 0;
const caller = () => formsRouter.createCaller({ req: new Request("http://localhost/api/trpc", { headers: { "x-forwarded-for": `quote-test-${++client}` } }), resHeaders: new Headers() });

beforeEach(() => {
  vi.clearAllMocks();
  mocks.insert.mockReturnValue({ values: mocks.values });
  mocks.values.mockResolvedValue([{ insertId: 321 }]);
  mocks.notify.mockResolvedValue({ sent: true });
});

describe("guided quote submission (mock database and email only)", () => {
  it("stores the complete package request and sends the same fields with a persisted reference", async () => {
    const input = buildQuoteRequestInput({ agencyName: "Example agency", contactPerson: "Example", email: "example@example.test", whatsapp: "", dates: "", specialRequests: "", numberOfPax: 40 }, {
      preferredCircuit: "Imperial cities [imperial-cities-morocco]", preferredDestinations: "Marrakech [marrakech]",
    }, { requestKind: "package", market: "France", clientProfile: "Families", helpMeChoose: true, services: ["transport"], activities: ["cooking"] });
    const result = await caller().createQuote(input);
    expect(result).toEqual({ success: true, reference: "MI-Q-321" });
    const stored = mocks.values.mock.calls[0][0];
    expect(stored.travelType).toBe("Morocco package proposal");
    expect(stored.specialRequests).toContain("Cooking classes");
    expect(stored.specialRequests).toContain("Source market: France");
    expect(stored.specialRequests).toContain("Number of Pax: 40");
    expect(stored.preferredCircuit).toBe(input.preferredCircuit);
    expect(stored.preferredDestinations).toBe(input.preferredDestinations);
    expect(stored).not.toHaveProperty("numberOfPax");
    const notification = mocks.notify.mock.calls[0][0];
    expect(notification.fields).toContainEqual({ label: "Request Reference", value: "MI-Q-321" });
    expect(notification.fields).toContainEqual({ label: "Request / Brief", value: input.specialRequests });
    expect(notification.fields).toContainEqual({ label: "Number of Pax", value: 40 });
    expect(mocks.values.mock.invocationCallOrder[0]).toBeLessThan(mocks.notify.mock.invocationCallOrder[0]);
  });

  it("still succeeds when the email provider returns failure or missing configuration", async () => {
    mocks.notify.mockResolvedValue({ sent: false, reason: "Missing configuration" });
    expect(await caller().createQuote({ email: "example@example.test", specialRequests: "Legacy request", adults: 12 })).toEqual({ success: true, reference: "MI-Q-321" });
    expect(mocks.values.mock.calls[0][0].adults).toBe(12);
  });

  it("does not return a receipt or attempt email when saving fails", async () => {
    mocks.values.mockRejectedValue(new Error("Simulated database failure"));
    await expect(caller().createQuote({ email: "example@example.test" })).rejects.toThrow("Simulated database failure");
    expect(mocks.notify).not.toHaveBeenCalled();
  });

  it("rejects invalid inputs without saving or sending", async () => {
    await expect(caller().createQuote({ email: "not-an-email", numberOfPax: 1.5 })).rejects.toThrow();
    expect(mocks.values).not.toHaveBeenCalled();
    expect(mocks.notify).not.toHaveBeenCalled();
  });
});
