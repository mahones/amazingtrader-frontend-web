import type { Metadata } from "next";

const SITE_NAME = "Amazing Traders";

/**
 * Per-page metadata. `openGraph` must be built here (not inherited) because a page that
 * doesn't define its own would show the root layout's generic title/description when the
 * link is shared (WhatsApp, Facebook, etc.). `title` gets the layout's " · Amazing Traders"
 * template; the Open Graph title is spelled out in full since templates don't apply to it.
 */
export function buildMetadata({
  title,
  description,
  image,
  absoluteTitle,
}: {
  title: string;
  description: string;
  image?: string | null;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    openGraph: {
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      type: "website",
      locale: "fr_FR",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

/** Collapses whitespace and cuts to a link-preview-friendly length. */
export function summarize(text: string | null | undefined, max = 160): string {
  const plain = (text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? `${plain.slice(0, max - 1).trimEnd()}…` : plain;
}
