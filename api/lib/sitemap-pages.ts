type StaticSitemapPage = {
  path: string;
  changefreq: string;
  priority: number;
};

export const STATIC_SITEMAP_PAGES: readonly StaticSitemapPage[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/circuits", changefreq: "weekly", priority: 0.9 },
  { path: "/destinations", changefreq: "weekly", priority: 0.9 },
  { path: "/services", changefreq: "monthly", priority: 0.8 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/mice", changefreq: "monthly", priority: 0.8 },
  { path: "/b2b", changefreq: "monthly", priority: 0.8 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.7 },
  { path: "/quote", changefreq: "monthly", priority: 0.7 },
  { path: "/dmc-morocco", changefreq: "monthly", priority: 0.9 },
  { path: "/incoming-agency-morocco", changefreq: "monthly", priority: 0.9 },
  { path: "/morocco-tours-for-travel-agencies", changefreq: "monthly", priority: 0.8 },
  { path: "/morocco-group-tours", changefreq: "monthly", priority: 0.8 },
  { path: "/mice-morocco", changefreq: "monthly", priority: 0.8 },
];
