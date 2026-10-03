import { useLayoutEffect } from "react";
import { safeJsonLd } from "@/lib/structured-data";

export default function StructuredData({ id, value }: { id: string; value: unknown }) {
  const json = safeJsonLd(value);

  useLayoutEffect(() => {
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.append(script);
    }
    script.textContent = json;

    return () => script?.remove();
  }, [id, json]);

  return null;
}
