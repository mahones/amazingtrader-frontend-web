import { Fragment } from "react";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/**
 * Renders plain text with any bare http(s) URL turned into a clickable link —
 * FAQ answers (and similar admin-authored plain text) are stored as raw
 * strings, not HTML, so this is the simplest way to make a pasted URL
 * clickable without introducing a rich text editor.
 */
export function LinkifiedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        // str.split(/(capturing group)/) interleaves the captured
        // delimiters (the URLs) at odd indices — no need to re-test them.
        index % 2 === 1 ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            {part}
          </a>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </span>
  );
}
