import NotionContent from "./NotionContent";
import { highlightCodeBlocks } from "@helpers/shiki";
import { TNotionBlogPage } from "@models/notion_blog";
import clsx from "clsx";
import "../../../styles/notion-content.css";

type TProps = {
  generalInfo: TNotionBlogPage;
  detailInfo: any;
  className?: string;
};

const PostDetail = async (props: TProps) => {
  const {
    generalInfo, //
    detailInfo,
    className,
  } = props;

  const highlightedDetailInfo = detailInfo ? await highlightCodeBlocks(detailInfo) : null;

  return (
    <div id="post-detail" className={clsx("max-w-7xl mx-auto", className)}>
      {highlightedDetailInfo && (
        <div className="mt-4">
          <NotionContent detailInfo={highlightedDetailInfo} />
        </div>
      )}
    </div>
  );
};

export default PostDetail;
