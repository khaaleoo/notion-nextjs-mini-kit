import { FC } from "react";
import PostDetail from "@components/organisms/PostDetail";
import { TNotionBlogPage } from "@models/notion_blog";
import { rootDomain } from "@helpers/config";

type TProps = {
  params: {
    slug: string;
  };
};

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
      <PostDetail detailInfo={res.result.detailInfo} generalInfo={res.result.generalInfo} />
    </div>
  );
};

export default Page;
