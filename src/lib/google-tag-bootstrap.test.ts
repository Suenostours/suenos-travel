import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const bootstrap = html.match(/<!-- Google tag \(gtag.js\) -->\s*<script>([\s\S]*?)<\/script>/)?.[1];

const expectedScript = {
  async: true,
  fetchPriority: "low",
  src: "https://www.googletagmanager.com/gtag/js?id=G-BHGBSCVJ1Y",
};

function eventTarget() {
  const listeners = new Map<string, Set<() => void>>();
  return {
    addEventListener: vi.fn((name: string, callback: () => void) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(callback);
    }),
    removeEventListener: vi.fn((name: string, callback: () => void) => {
      listeners.get(name)?.delete(callback);
    }),
    emit(name: string) { [...(listeners.get(name) ?? [])].forEach((callback) => callback()); },
    listenerCount() { return [...listeners.values()].reduce((sum, callbacks) => sum + callbacks.size, 0); },
  };
}

function runBootstrap(options: {
  hostname?: string;
  pathname?: string;
  hidden?: boolean;
  observer?: "supported" | "missing" | "unsupported" | "throws";
  readyState?: string;
} = {}) {
  const append = vi.fn(); // No scripts or external requests are executed in these tests.
  const windowEvents = eventTarget();
  const documentEvents = eventTarget();
  const timers = new Map<number, () => void>();
  let nextTimer = 0;
  let paintCallback: ((list: { getEntries: () => { name: string }[] }) => void) | undefined;
  const disconnect = vi.fn();
  const observe = vi.fn(() => {
    if (options.observer === "throws") throw new Error("Paint observer unavailable");
  });
  class MockObserver {
    static supportedEntryTypes = options.observer === "unsupported" ? ["resource"] : ["paint"];
    constructor(callback: typeof paintCallback) { paintCallback = callback; }
    observe = observe;
    disconnect = disconnect;
  }
  const sandbox = {
    ...windowEvents,
    dataLayer: [] as unknown[][],
    gtag: undefined as ((...args: unknown[]) => void) | undefined,
    location: { hostname: options.hostname ?? "www.morocco-incoming.com", pathname: options.pathname ?? "/dmc-morocco" },
    document: {
      ...documentEvents,
      visibilityState: options.hidden ? "hidden" : "visible",
      readyState: options.readyState ?? "loading",
      createElement: vi.fn(() => ({})), head: { append },
    },
    PerformanceObserver: options.observer === "missing" ? undefined : MockObserver,
    setTimeout: vi.fn((callback: () => void) => {
      timers.set(++nextTimer, callback);
      return nextTimer;
    }),
    clearTimeout: vi.fn((id: number) => timers.delete(id)),
  };
  // The global object and window must be the same, as in a real classic script.
  runInNewContext(bootstrap!, Object.assign(sandbox, { window: sandbox }));
  return {
    sandbox, append, observe, disconnect, timers, windowEvents, documentEvents,
    events: () => sandbox.dataLayer.map((event) => Array.from(event)),
    paint: (name = "first-contentful-paint") => paintCallback?.({ getEntries: () => [{ name }] }),
    expireDeadline: () => [...timers.values()].forEach((callback) => callback()),
  };
}

describe("Google tag content-first pilot", () => {
  it.each(["www.morocco-incoming.com", "morocco-incoming.com"])(
    "queues the existing IDs immediately but waits for content paint on %s", (hostname) => {
      expect(bootstrap).toBeTruthy();
      const run = runBootstrap({ hostname });
      expect(run.events().slice(1)).toEqual([
        ["config", "G-BHGBSCVJ1Y"],
        ["config", "AW-18188447838"],
      ]);
      expect(run.append).not.toHaveBeenCalled();
      expect(run.observe).toHaveBeenCalledExactlyOnceWith({ type: "paint", buffered: true });
      run.paint("first-paint");
      expect(run.append).not.toHaveBeenCalled();
      run.paint();
      expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
      expect(run.disconnect).toHaveBeenCalledOnce();
      expect(run.timers.size).toBe(0);
      expect(run.windowEvents.listenerCount()).toBe(0);
      expect(run.documentEvents.listenerCount()).toBe(0);
    },
  );

  it.each(["/", "/quote", "/b2b", "/circuits", "/fr/quote", "/admin/login"])(
    "keeps immediate loading on the unrelated route %s", (pathname) => {
      const run = runBootstrap({ pathname });
      expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
      expect(run.observe).not.toHaveBeenCalled();
      expect(run.sandbox.setTimeout).not.toHaveBeenCalled();
    },
  );

  it.each(["pointerdown", "keydown", "pagehide"])("starts early on %s, once only", (event) => {
    const run = runBootstrap();
    run.windowEvents.emit(event);
    run.paint();
    run.expireDeadline();
    run.windowEvents.emit(event);
    expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
  });

  it("starts immediately for an initially hidden document", () => {
    const run = runBootstrap({ hidden: true });
    expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
    expect(run.observe).not.toHaveBeenCalled();
  });

  it("starts when a waiting page becomes hidden, not when it stays visible", () => {
    const run = runBootstrap();
    run.documentEvents.emit("visibilitychange");
    expect(run.append).not.toHaveBeenCalled();
    run.sandbox.document.visibilityState = "hidden";
    run.documentEvents.emit("visibilitychange");
    expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
  });

  it.each(["conversion", "generate_lead"])("preserves queued events and starts on an early %s", (name) => {
    const run = runBootstrap();
    const event = ["event", name, { send_to: "AW-18188447838/MmohCIvmoe4cEN7g9uBD" }];
    run.sandbox.gtag!("event", "quote_form_submit", { form_type: "quote" });
    expect(run.append).not.toHaveBeenCalled();
    run.sandbox.gtag!(...event);
    expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
    expect(run.events().slice(3)).toEqual([
      ["event", "quote_form_submit", { form_type: "quote" }], event,
    ]);
    run.sandbox.gtag!("event", "page_view", { page_path: "/quote" });
    run.paint();
    expect(run.events().at(-1)).toEqual(["event", "page_view", { page_path: "/quote" }]);
    expect(run.append).toHaveBeenCalledOnce();
  });

  it("does not let early performance metrics start the SDK before content paint", () => {
    const run = runBootstrap();
    run.sandbox.gtag!("event", "TTFB", { send_to: "G-BHGBSCVJ1Y", value: 250 });
    expect(run.append).not.toHaveBeenCalled();
    run.paint();
    expect(run.events().at(-1)?.[1]).toBe("TTFB");
    expect(run.append).toHaveBeenCalledOnce();
  });

  it("has a bounded safety fallback when paint never arrives", () => {
    const run = runBootstrap();
    expect(run.sandbox.setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    run.expireDeadline();
    run.paint();
    expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
    expect(run.timers.size).toBe(0);
  });

  it.each(["missing", "unsupported", "throws"] as const)("falls back to page load if the observer is %s", (observer) => {
    const run = runBootstrap({ observer });
    expect(run.append).not.toHaveBeenCalled();
    run.windowEvents.emit("load");
    expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
    expect(run.timers.size).toBe(0);
  });

  it("starts immediately when the fallback page-load event already happened", () => {
    const run = runBootstrap({ observer: "missing", readyState: "complete" });
    expect(run.append).toHaveBeenCalledExactlyOnceWith(expectedScript);
  });

  it.each(["localhost", "127.0.0.1", "preview.up.railway.app", "www.morocco-incoming.com.example"])(
    "does not send test sessions to production Google properties from %s", (hostname) => {
      const run = runBootstrap({ hostname });
      run.paint();
      run.expireDeadline();
      run.windowEvents.emit("pointerdown");
      run.sandbox.gtag!("event", "generate_lead");
      expect(run.events()).toEqual([["event", "generate_lead"]]);
      expect(run.append).not.toHaveBeenCalled();
      expect(run.sandbox.setTimeout).not.toHaveBeenCalled();
      expect(run.observe).not.toHaveBeenCalled();
    },
  );
});
