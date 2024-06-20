import { FC } from "react";
import ListPost from "@components/organisms/ListPost";
import { TNotionBlogResult } from "@models/notion_blog";
import { rootDomain } from "@helpers/config";

interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

type TProps = {};

const Blogs: FC<TProps> = async (props: TProps) => {
  let posts: TNotionBlogResult | null = null;

  try {
    const response = await fetch(rootDomain + "/api/blog", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const res = await response.json();
      posts = res.result;
    } else {
      console.error("Failed to add todo item");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  if (!posts) {
    return <div>loading...</div>;
  }

  return (
    <div className="py-4">
      <section className="mt-8">
        <h2 className="text-2xl font-semibold">📝 Blogs:</h2>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ListPost data={posts} />
        </div>
      </section>
      {/* {JSON.stringify(posts)} */}
    </div>
  );
};

export default Blogs;
