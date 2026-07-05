import { buildRssFeed } from "@helpers/rss";
import {
  getPostAuthors,
  getPostCanonicalUrl,
  getPostDescription,
  getPostPublishedAt,
  getPostTitle,
} from "@helpers/post-metadata";
import { getSiteAuthor, getSiteDescription, getSiteName, getSiteUrl } from "@helpers/site-url";
import { getAllPublishedPosts } from "@lib/notion";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPublishedPosts().catch(() => []);
  const siteUrl = getSiteUrl();

  const feed = buildRssFeed({
    siteUrl,
    siteName: getSiteName(),
    siteDescription: getSiteDescription(),
    items: posts.slice(0, 20).map((post) => ({
      title: getPostTitle(post),
      link: getPostCanonicalUrl(post),
      description: getPostDescription(post) || getPostTitle(post),
      pubDate: getPostPublishedAt(post),
      guid: getPostCanonicalUrl(post),
      author: getPostAuthors(post)[0] ?? getSiteAuthor(),
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
