const origin = "https://www.morocco-incoming.com";
const host = new URL(origin).host;
const key = "8e02b19bfd0dd65282a663ec3f3a5bda";
const keyLocation = `${origin}/${key}.txt`;
const sitemapUrl = `${origin}/sitemap.xml`;

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1]?.trim())
    .filter(Boolean);
}

const sitemapResponse = await fetch(sitemapUrl, {
  headers: { "user-agent": "MoroccoIncoming-IndexNow/1.0" },
});

if (!sitemapResponse.ok) {
  throw new Error(`Could not load sitemap (${sitemapResponse.status}).`);
}

const xml = await sitemapResponse.text();
const urls = [...new Set(sitemapUrls(xml))].filter((url) => {
  try {
    return new URL(url).origin === origin;
  } catch {
    return false;
  }
});

if (urls.length === 0) {
  throw new Error("The sitemap did not contain any valid site URLs.");
}

if (urls.length > 10_000) {
  throw new Error("IndexNow accepts a maximum of 10,000 URLs per request.");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
});

if (![200, 202].includes(response.status)) {
  const responseText = await response.text();
  throw new Error(
    `IndexNow rejected the submission (${response.status})${responseText ? `: ${responseText}` : "."}`,
  );
}

console.log(
  `IndexNow accepted ${urls.length} URLs (${response.status === 202 ? "key verification pending" : "success"}).`,
);
