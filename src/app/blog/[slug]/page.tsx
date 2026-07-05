import { FC } from "react";
import type { Metadata } from "next";
import PostDetail from "@components/organisms/PostDetail";
import ArticleJsonLd from "@components/molecules/ArticleJsonLd";
import { TNotionBlogPage } from "@models/notion_blog";
import { rootDomain } from "@helpers/config";
import {
  getPostCanonicalUrl,
  getPostDescription,
  getPostOgImageUrl,
  getPostTitle,
} from "@helpers/post-metadata";

type TProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params: { slug } }: TProps): Promise<Metadata> {
  try {
    const response = await fetch(rootDomain + `/api/blog/${slug}`, { method: "GET" });
    if (!response.ok) return {};

    const res = await response.json();
    const post: TNotionBlogPage | null = res.result?.generalInfo ?? null;
    if (!post) return {};

    const title = getPostTitle(post);
    const description = getPostDescription(post);
    const url = getPostCanonicalUrl(post);
    const image = getPostOgImageUrl(post);

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {};
  }
}

const Page: FC<TProps> = async (props: TProps) => {
  const {
    params: { slug },
  } = props;
  let res: {
    result: {
      generalInfo: TNotionBlogPage | null;
      detailInfo: any;
    };
  } = {
    result: {
      generalInfo: null,
      detailInfo: null,
    },
  };
  try {
    // Send a POST request to the API route with the todo item
    const response = await fetch(rootDomain + `/api/blog/${slug}`, {
      method: "GET",
    });
    if (response.ok) {
      res = await response.json();
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
  if (!res.result || !res.result.generalInfo || !res.result.detailInfo) {
    return <div>Not Found</div>;
  }
  return (
    <div className="pb-4">
      <ArticleJsonLd post={res.result.generalInfo} />
      <PostDetail detailInfo={res.result.detailInfo} generalInfo={res.result.generalInfo} />
    </div>
  );
};

export default Page;
