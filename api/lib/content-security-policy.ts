// Keep the existing policy; allow only the endpoints used by the installed
// Google tags. https://developers.google.com/tag-platform/security/guides/csp
const googleConnections = [
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://www.googletagmanager.com",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
  "https://stats.g.doubleclick.net",
  "https://ad.doubleclick.net",
  "https://www.google.com",
  "https://www.google.co.ma",
  "https://pagead2.googlesyndication.com",
];

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://res.cloudinary.com ${googleConnections.join(" ")}`,
  `connect-src 'self' ${googleConnections.join(" ")}`,
  "frame-src https://www.googletagmanager.com https://td.doubleclick.net",
  "font-src 'self' data:",
].join("; ");
