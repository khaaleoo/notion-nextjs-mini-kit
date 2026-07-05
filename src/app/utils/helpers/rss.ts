function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssFeed({
  siteUrl,
  siteName,
  siteDescription,
  items,
}: {
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  items: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: Date;
    guid: string;
    author?: string;
  }>;
}) {
  const channelLink = `${siteUrl}/blog`;
  const feedLink = `${siteUrl}/feed.xml`;
  const lastBuildDate = items[0]?.pubDate ?? new Date();

  const itemXml = items
    .map((item) => {
      const fields = [
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(item.link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(item.guid)}</guid>`,
        `<description>${escapeXml(item.description)}</description>`,
        `<pubDate>${item.pubDate.toUTCString()}</pubDate>`,
      ];

      if (item.author) {
        fields.push(`<author>${escapeXml(item.author)}</author>`);
      }

      return `<item>\n${fields.map((field) => `  ${field}`).join("\n")}\n</item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedLink)}" rel="self" type="application/rss+xml" />
${itemXml}
  </channel>
</rss>`;
}
