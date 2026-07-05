import pageInfo from "@helpers/info";
import { createBlogOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@helpers/og/create-blog-og-image";

export const alt = pageInfo.meta.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 86400;

export default function Image() {
  return createBlogOgImage({
    title: pageInfo.meta.title,
    description: pageInfo.meta.description,
    label: pageInfo.name,
  });
}
