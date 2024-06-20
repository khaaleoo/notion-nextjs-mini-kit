import { FC } from "react";
import { NotionRenderer } from "react-notion";
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css"; // only needed for code highlighting
import "prismjs/components/prism-javascript";
import { TNotionBlogPage } from "@models/notion_blog";
import clsx from "clsx";

type TProps = {
  generalInfo: TNotionBlogPage;
  detailInfo: any;
  className?: string;
};

const PostDetail: FC<TProps> = (props: TProps) => {
  const {
    generalInfo, //
    detailInfo,
    className,
  } = props;
  return (
    <div id="post-detail" className={clsx("max-w-7xl mx-auto", className)}>
      {detailInfo && (
        <div className="mt-4">
          <NotionRenderer blockMap={detailInfo} />
        </div>
      )}
    </div>
  );
};

export default PostDetail;
