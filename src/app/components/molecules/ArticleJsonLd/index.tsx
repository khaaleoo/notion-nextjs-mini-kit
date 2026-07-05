import type { TNotionBlogPage } from "@models/notion_blog";
import {
  getPostAuthors,
  getPostCanonicalUrl,
  getPostDescription,
  getPostImageUrl,
  getPostKeywords,
  getPostModifiedAt,
  getPostPublishedAt,
  getPostTitle,
} from "@helpers/post-metadata";
import { getSiteAuthor, getSiteName, getAbsoluteUrl } from "@helpers/site-url";

type ArticleJsonLdProps = {
  post: TNotionBlogPage;
};

export default function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const title = getPostTitle(post);
  const description = getPostDescription(post);
  const url = getPostCanonicalUrl(post);
  const image = getPostImageUrl(post);
  const authors = getPostAuthors(post);
  const keywords = getPostKeywords(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || title,
    image: [image],
    datePublished: getPostPublishedAt(post).toISOString(),
    dateModified: getPostModifiedAt(post).toISOString(),
    author: authors.map((name: string) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Person",
      name: getSiteAuthor(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: {
      "@type": "Blog",
      name: getSiteName(),
      url: getAbsoluteUrl("/blog"),
    },
    ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
