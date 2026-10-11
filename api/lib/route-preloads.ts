import type { Manifest } from "vite";

// Only optimise the audited route. Do not fetch other pages or admin chunks.
const DMC_ENTRY = "src/pages/SEOLandingPage.tsx";

export function addRoutePreloads(template: string, pathname: string, manifest: Manifest) {
  if (pathname !== "/dmc-morocco" || !manifest[DMC_ENTRY]) return template;

  const visited = new Set<string>();
  const assets = new Set<string>();
  function collect(key: string) {
    if (visited.has(key)) return;
    visited.add(key);
    const chunk = manifest[key];
    if (!chunk) return;
    for (const file of [chunk.file, ...(chunk.css ?? [])]) {
      // Manifest assets are local build outputs, never user-controlled URLs.
      if (/^assets\/[\w/-]+\.(js|css)$/.test(file)) assets.add(file);
    }
    // Static dependencies only: following dynamicImports would preload every route.
    for (const dependency of chunk.imports ?? []) collect(dependency);
  }
  collect(DMC_ENTRY);

  const links = [...assets]
    .filter((file) => !template.includes(`href="/${file}"`))
    .map((file) => file.endsWith(".css")
      ? `<link rel="stylesheet" href="/${file}" crossorigin />`
      : `<link rel="modulepreload" href="/${file}" crossorigin />`)
    .join("\n    ");
  return links ? template.replace("</head>", `${links}\n  </head>`) : template;
}
