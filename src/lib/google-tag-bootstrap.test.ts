import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const bootstrap = html.match(/<!-- Google tag \(gtag.js\) -->\s*<script>([\s\S]*?)<\/script>/)?.[1];

function runBootstrap(hostname: string) {
  const append = vi.fn();
  const context = {
    dataLayer: [] as unknown[][],
    location: { hostname },
    document: { createElement: vi.fn(() => ({})), head: { append } },
  };
  runInNewContext(bootstrap!, { ...context, window: context });
  return { ...context, append, events: context.dataLayer.map((event) => Array.from(event)) };
}

describe("existing Google tag bootstrap", () => {
  it.each(["www.morocco-incoming.com", "morocco-incoming.com"])(
    "keeps both existing IDs and immediate event queuing on %s", (hostname) => {
      expect(bootstrap).toBeTruthy();
      const { events, append } = runBootstrap(hostname);
      expect(events.slice(1)).toEqual([
        ["config", "G-BHGBSCVJ1Y"],
        ["config", "AW-18188447838"],
      ]);
      expect(append).toHaveBeenCalledExactlyOnceWith({
        async: true, fetchPriority: "low",
        src: "https://www.googletagmanager.com/gtag/js?id=G-BHGBSCVJ1Y",
      });
    },
  );

  it.each(["localhost", "127.0.0.1", "preview.up.railway.app", "www.morocco-incoming.com.example"])(
    "does not send test sessions to production Google properties from %s", (hostname) => {
      const { events, append } = runBootstrap(hostname);
      expect(events).toHaveLength(0);
      expect(append).not.toHaveBeenCalled();
    },
  );
});
