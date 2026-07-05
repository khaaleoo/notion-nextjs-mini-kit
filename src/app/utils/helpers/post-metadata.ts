import type { TNotionBlogPage } from "@models/notion_blog";
import { getAbsoluteUrl, getSiteAuthor } from "@helpers/site-url";

export function getPostSlug(post: TNotionBlogPage) {
  return post.properties.Slug.rich_text[0]?.plain_text ?? "";
}

export function getPostTitle(post: TNotionBlogPage) {
  return post.properties.Title.title[0]?.plain_text ?? "";
}

export function getPostDescription(post: TNotionBlogPage) {
  return post.properties.Description.rich_text[0]?.plain_text ?? "";
}

export function getPostPublishedAt(post: TNotionBlogPage) {
  const published = post.properties.PublishedAt?.date?.start;
  return new Date(published ?? post.created_time);
}

export function getPostModifiedAt(post: TNotionBlogPage) {
  return new Date(post.last_edited_time);
}

export function getPostAuthors(post: TNotionBlogPage) {
  const authors = post.properties.Author?.people?.map((person: any) => person.name).filter(Boolean) ?? [];
  return authors.length > 0 ? authors : [getSiteAuthor()];
}

export function getPostOgImageUrl(post: TNotionBlogPage) {
  const ogImages =
    post.properties["OpenGraph.Image"]?.files
      ?.map((file: any) => file.external?.url)
      .filter(Boolean) ?? [];
  if (ogImages[0]) return ogImages[0];

  const slug = getPostSlug(post);
  if (slug) return getAbsoluteUrl(`/blog/${slug}/opengraph-image`);

  return getAbsoluteUrl("/opengraph-image");
}

export function getPostImageUrl(post: TNotionBlogPage) {
  const media =
    post.properties.PresentativeMedia?.files?.[0]?.file?.url ||
    post.properties.PresentativeMedia?.files?.[0]?.external?.url;
  if (media) return media;

  return getPostOgImageUrl(post);
}

export function getPostCanonicalUrl(post: TNotionBlogPage) {
  const slug = getPostSlug(post);
  return getAbsoluteUrl(`/blog/${slug}`);
}

export function getPostKeywords(post: TNotionBlogPage) {
  const keywords = post.properties.Keywords?.rich_text?.map((item: any) => item.plain_text).filter(Boolean) ?? [];
  const tags = post.properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [];
  return [...keywords, ...tags];
}
