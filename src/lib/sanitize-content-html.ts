import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes Tiptap-authored HTML (course/bot/post descriptions) before it's
 * rendered via dangerouslySetInnerHTML in Server Components. Uses
 * `sanitize-html` (pure JS, no jsdom) instead of isomorphic-dompurify —
 * jsdom's dependency tree isn't reliably traced into Vercel's serverless
 * function bundle, which caused these pages to 500 in production while
 * working fine locally.
 */
export function sanitizeContentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr",
      "strong", "b", "em", "i", "s", "strike", "u", "code",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "blockquote", "pre",
      "a", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
