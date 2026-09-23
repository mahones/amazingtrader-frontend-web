import type { ReactNode } from "react";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits a message body into plain text, clickable URLs, and highlighted
 * `@Member Name` mentions. Mentions are matched against the known member
 * names (rather than a generic `@\w+` pattern) since display names contain
 * spaces, e.g. "@Rodolphe SEDJRO".
 */
export function renderMessageBody(body: string, memberNames: string[] = []): ReactNode[] {
  const urlPart = "https?://[^\\s]+|www\\.[^\\s]+";
  const mentionNames = [...memberNames].sort((a, b) => b.length - a.length).map(escapeRegExp);
  const mentionPart = mentionNames.length ? mentionNames.map((name) => `@${name}`).join("|") : null;
  const pattern = mentionPart ? `${urlPart}|${mentionPart}` : urlPart;
  const regex = new RegExp(pattern, "g");

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push(body.slice(lastIndex, match.index));
    }

    const text = match[0];
    if (text.startsWith("@")) {
      parts.push(
        <span key={key++} className="font-medium text-primary">
          {text}
        </span>
      );
    } else {
      const href = text.startsWith("www.") ? `https://${text}` : text;
      parts.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-primary underline"
        >
          {text}
        </a>
      );
    }

    lastIndex = match.index + text.length;
  }

  if (lastIndex < body.length) {
    parts.push(body.slice(lastIndex));
  }

  return parts;
}
