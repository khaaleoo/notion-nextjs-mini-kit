"use client";

import NotionRenderer from "@components/molecules/NotionRenderer";
import type { BlockMap } from "@components/molecules/NotionRenderer";
import NotionCodeBlock from "@components/molecules/NotionCodeBlock";
import NotionHeading from "@components/molecules/NotionHeading";
import NotionRevealAnswer from "@components/molecules/NotionRevealAnswer";

type TProps = {
  detailInfo: BlockMap;
};

const NotionContent = ({ detailInfo }: TProps) => {
  return (
    <NotionRenderer
      blockMap={detailInfo}
      customBlockComponents={{
        code: ({ blockValue }) => <NotionCodeBlock blockValue={blockValue} />,
        header: ({ blockValue }) => <NotionHeading blockValue={blockValue} />,
        sub_header: ({ blockValue }) => <NotionHeading blockValue={blockValue} />,
        sub_sub_header: ({ blockValue }) => <NotionHeading blockValue={blockValue} />,
        toggle: ({ blockValue, children, renderComponent }) => (
          <NotionRevealAnswer blockValue={blockValue} renderDefault={renderComponent}>
            {children}
          </NotionRevealAnswer>
        ),
      }}
    />
  );
};

export default NotionContent;
