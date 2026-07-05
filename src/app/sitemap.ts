import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@helpers/site-url";
import { getPostModifiedAt, getPostSlug } from "@helpers/post-metadata";
import { getAllPublishedPosts } from "@lib/notion";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts().catch(() => []);
  const now = new Date();

  return [
    {
      url: getAbsoluteUrl("/blog"),
      lastModified: posts[0] ? getPostModifiedAt(posts[0]) : now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: getAbsoluteUrl(`/blog/${getPostSlug(post)}`),
      lastModified: getPostModifiedAt(post),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
