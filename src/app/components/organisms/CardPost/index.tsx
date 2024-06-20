import { FC } from "react";
import type { TNotionBlogPage } from "@models/notion_blog";
import BaseImage from "@components/atoms/BaseImage";
import { getBlurData } from "@helpers/image";
import { formatDateLocalized } from "@helpers/date";
import Link from "next/link";

type TProps = {
  data: TNotionBlogPage;
};

const CardPost: FC<TProps> = async (props: TProps) => {
  const { data } = props;
  const image =
    data.properties.PresentativeMedia.files[0]?.file?.url ||
    data.properties.PresentativeMedia.files[0]?.external?.url ||
    "";
  const { base64 } = await getBlurData(image);
  const postUrl = `/blog/${data.properties.Slug.rich_text[0]?.plain_text}`;
  return (
    <article className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Link href={postUrl} className="block">
        <BaseImage
          width={600}
          height={400}
          className="rounded-t-lg w-full aspect-video"
          src={image}
          blurData={base64}
          alt={"Card image"}
        />
      </Link>
      <div className="p-5">
        <Link href={postUrl} className="block">
          <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
            {data.properties.Title.title[0]?.plain_text || "No title"}
          </h5>
        </Link>
        <p className="mb-3 text-sm font-normal leading-relaxed text-gray-700 dark:text-gray-400 line-clamp-3">
          {data.properties.Description.rich_text[0]?.plain_text || "No description"}
        </p>
        <time
          className="text-sm italic text-gray-500 dark:text-gray-400"
          dateTime={new Date(data.created_time).toISOString()}
        >
          {formatDateLocalized(new Date(data.created_time))}
        </time>
      </div>
    </article>
  );
};

export default CardPost;
