import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@helpers/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
