import { ImageResponse } from "next/og";
import pageInfo from "@helpers/info";
import { getSiteUrl } from "@helpers/site-url";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const ACCENT = "#FF9F0A";
const BG = "#0f1015";
const TEXT = "#ffffff";
const MUTED = "#a1a1aa";
const DIM = "#71717a";

type TCreateBlogOgImageOptions = {
  title: string;
  description?: string;
  label?: string;
  dateLabel?: string;
};

export function createBlogOgImage({
  title,
  description,
  label = pageInfo.meta.title,
  dateLabel,
}: TCreateBlogOgImageOptions) {
  const siteHost = new URL(getSiteUrl()).host;
  const safeTitle = title.trim() || pageInfo.meta.title;
  const safeDescription = (description ?? pageInfo.meta.description).trim().slice(0, 160);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 64,
          background: `linear-gradient(145deg, ${BG} 0%, #1a1b22 55%, #12131a 100%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: ACCENT,
            }}
          />
          <span style={{ color: ACCENT, fontSize: 26, fontWeight: 600 }}>{label}</span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <h1
            style={{
              display: "flex",
              margin: 0,
              color: TEXT,
              fontSize: safeTitle.length > 72 ? 48 : 56,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {safeTitle}
          </h1>
          {safeDescription ? (
            <p
              style={{
                display: "flex",
                margin: 0,
                color: MUTED,
                fontSize: 28,
                lineHeight: 1.4,
              }}
            >
              {safeDescription}
            </p>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ color: DIM, fontSize: 24 }}>{siteHost}</span>
          {dateLabel ? <span style={{ color: DIM, fontSize: 24 }}>{dateLabel}</span> : null}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
