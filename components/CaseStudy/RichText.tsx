import { ExternalLink } from "@/components/ExternalLink";
import { inlineLink } from "@/lib/link-styles";
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
      <ExternalLink
        key={match.index}
        href={match[2]}
        className={inlineLink}
      >
        {match[1]}
      </ExternalLink>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return <>{parts}</>;
}
