import { rootDomain } from "@helpers/config";
import pageInfo from "@helpers/info";

export function getSiteUrl() {
  const url = rootDomain?.replace(/\/$/, "");
  if (!url || url.includes("localhost")) {
    return "http://localhost:3000";
  }
  return url;
}

export function getAbsoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function getSiteName() {
  return pageInfo.meta.title;
}

export function getSiteDescription() {
  return pageInfo.meta.description;
}

export function getSiteAuthor() {
  return pageInfo.name;
}
