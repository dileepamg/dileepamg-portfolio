import type { ReactNode } from "react";

/**
 * Renders case study prose, turning markdown-style [label](https://url)
 * into external links. Only http and https are matched, so nothing else
 * in the copy is treated as markup.
 */
export default function RichText({ children }: { children: string }) {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }

    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold underline underline-offset-2"
      >
        {match[1]}
      </a>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return <>{parts}</>;
}
