type StaticSitemapPage = {
  path: string;
  changefreq: string;
  priority: number;
  lastmod: string;
};

export const SITE_CONTENT_LAST_MODIFIED = "2026-09-04";

export const STATIC_SITEMAP_PAGES: readonly StaticSitemapPage[] = [
  { path: "/", changefreq: "weekly", priority: 1.0, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/circuits", changefreq: "weekly", priority: 0.9, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/destinations", changefreq: "weekly", priority: 0.9, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/services", changefreq: "monthly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/about", changefreq: "monthly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/mice", changefreq: "monthly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/b2b", changefreq: "monthly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/blog", changefreq: "weekly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/contact", changefreq: "monthly", priority: 0.7, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/quote", changefreq: "monthly", priority: 0.7, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/dmc-morocco", changefreq: "monthly", priority: 0.9, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/incoming-agency-morocco", changefreq: "monthly", priority: 0.9, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/morocco-tours-for-travel-agencies", changefreq: "monthly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/morocco-group-tours", changefreq: "monthly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
  { path: "/mice-morocco", changefreq: "monthly", priority: 0.8, lastmod: SITE_CONTENT_LAST_MODIFIED },
];

export const STATIC_BLOG_PAGES = [
  "what-does-a-dmc-in-morocco-do-for-travel-agencies",
  "how-to-choose-a-morocco-incoming-agency",
  "mice-morocco-best-destinations-for-incentive-groups",
  "morocco-tours-for-travel-agencies-b2b-programs",
  "morocco-travel-guide-2026",
  "sahara-desert-camps",
  "marrakech-hidden-gems",
] as const;
