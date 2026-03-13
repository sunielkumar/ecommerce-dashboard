const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrl(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;

  return normalizeSiteUrl(siteUrl);
}

export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl());
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
