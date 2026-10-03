import superjson from "superjson";
import type { SsrData } from "@/providers/ssr-data";

export const SSR_DATA_ELEMENT_ID = "ssr-data";

export function setHtmlDocumentLocale(template: string, locale: SsrData["locale"]) {
  return template.replace(
    /(<html\b[^>]*\blang=)(['"])[^'"]*\2/i,
    `$1"${locale}"`,
  );
}

export function serializeSsrData(data: SsrData) {
  return superjson.stringify(data)
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")
    .replace(/'/g, "\\u0027");
}

export function deserializeSsrData(value: string): SsrData {
  return superjson.parse<SsrData>(value);
}

export function readSsrDataFromDocument(): SsrData | null {
  const element = document.getElementById(SSR_DATA_ELEMENT_ID);
  if (!element?.textContent) return null;

  try {
    return deserializeSsrData(element.textContent);
  } catch {
    return null;
  }
}
