const WORDS_PER_MINUTE = 220;

type PortableTextChild = {
  text?: string | null;
};

type PortableTextLikeBlock = {
  _type: string;
  children?: PortableTextChild[] | null;
  title?: string | null;
  body?: string | null;
  code?: string | null;
  items?: Array<{
    date?: string | null;
    title?: string | null;
    body?: string | null;
  }> | null;
};

function collectText(blocks: readonly PortableTextLikeBlock[]): string {
  return blocks
    .flatMap((block) => {
      if (block._type === "block") {
        return (block.children ?? []).map((child) => child.text ?? "");
      }
      if (block._type === "callout") {
        return [block.title ?? "", block.body ?? ""];
      }
      if (block._type === "codeBlock") {
        return [block.code ?? ""];
      }
      if (block._type === "timeline") {
        return (block.items ?? []).flatMap((item) => [
          item.date ?? "",
          item.title ?? "",
          item.body ?? "",
        ]);
      }
      return [];
    })
    .join(" ");
}

export function estimateReadingMinutes(
  blocks: readonly PortableTextLikeBlock[] | null | undefined,
): number {
  const text = collectText(blocks ?? []).trim();
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
