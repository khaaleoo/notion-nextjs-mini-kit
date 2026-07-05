import { getPostGeneralInfoBySlug } from "@lib/notion";
import { getPostDescription, getPostPublishedAt, getPostTitle } from "@helpers/post-metadata";
import pageInfo from "@helpers/info";
import { createBlogOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@helpers/og/create-blog-og-image";

export const alt = "Blog post preview";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 3600;

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type TProps = {
  params: { slug: string };
};

export default async function Image({ params }: TProps) {
  const { slug } = params;

  try {
    const post = await getPostGeneralInfoBySlug(slug);

    return createBlogOgImage({
      title: getPostTitle(post),
      description: getPostDescription(post),
      label: pageInfo.meta.title,
      dateLabel: dateFormatter.format(getPostPublishedAt(post)),
    });
  } catch {
    return createBlogOgImage({
      title: pageInfo.meta.title,
      description: pageInfo.meta.description,
    });
  }
}
