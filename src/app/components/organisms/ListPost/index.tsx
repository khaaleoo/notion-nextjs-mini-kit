import { FC } from "react";
import type { TNotionBlogResult } from "@models/notion_blog";

import CardPost from "@components/organisms/CardPost";

type TProps = {
  data: TNotionBlogResult;
};

const ListPost: FC<TProps> = (props: TProps) => {
  const { data } = props;
  return (
    <>
      {data.results.map((post: any) => (
        <CardPost key={post.id} data={post} />
      ))}
    </>
  );
};

export default ListPost;
