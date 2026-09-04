export const PREFERRED_ORIGIN = "https://www.morocco-incoming.com";

const PREFERRED_HOST = "www.morocco-incoming.com";
const APEX_HOST = "morocco-incoming.com";
const LEGACY_HOSTS = new Set(["incoming-morocco.com", "www.incoming-morocco.com"]);
const LEGACY_DMC_ARTICLE = "/blog/what-does-a-morocco-dmc-do-for-travel-agencies";
const CURRENT_DMC_ARTICLE = "/blog/what-does-a-dmc-in-morocco-do-for-travel-agencies";

type CanonicalRedirectInput = {
  requestUrl: string;
  method: string;
  forwardedHost?: string;
  forwardedProto?: string;
};

function firstForwardedValue(value?: string) {
  return value?.split(",")[0]?.trim().toLowerCase();
}

function hostnameFromHost(value: string) {
  try {
    return new URL(`http://${value}`).hostname.toLowerCase();
  } catch {
    return value.toLowerCase();
  }
}

function isPublicContentPath(pathname: string) {
  if (pathname.startsWith("/api/") || pathname === "/api") return false;
  if (pathname.startsWith("/admin/") || pathname === "/admin") return false;

  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  return !/\.[a-zA-Z0-9]{2,8}$/.test(lastSegment);
}

export function getCanonicalRedirect({
  requestUrl,
  method,
  forwardedHost,
  forwardedProto,
}: CanonicalRedirectInput) {
  const url = new URL(requestUrl);
  const host = firstForwardedValue(forwardedHost) ?? url.host.toLowerCase();
  const hostname = hostnameFromHost(host);

  // Do not interfere with localhost, preview domains or Railway's internal host.
  if (hostname !== PREFERRED_HOST && hostname !== APEX_HOST && !LEGACY_HOSTS.has(hostname)) {
    return null;
  }

  const protocol =
    firstForwardedValue(forwardedProto) ?? url.protocol.replace(":", "").toLowerCase();
  const isSafeMethod = method.toUpperCase() === "GET" || method.toUpperCase() === "HEAD";
  let pathname = url.pathname;

  if (isSafeMethod && pathname === LEGACY_DMC_ARTICLE) {
    pathname = CURRENT_DMC_ARTICLE;
  } else if (
    isSafeMethod &&
    isPublicContentPath(pathname) &&
    pathname.length > 1 &&
    pathname.endsWith("/")
  ) {
    pathname = pathname.replace(/\/+$/, "");
  }

  const alreadyCanonical =
    hostname === PREFERRED_HOST &&
    protocol === "https" &&
    pathname === url.pathname;

  if (alreadyCanonical) return null;

  return `${PREFERRED_ORIGIN}${pathname}${url.search}${url.hash}`;
}
