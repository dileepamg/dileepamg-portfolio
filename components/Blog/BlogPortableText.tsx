import type { BLOG_POST_QUERY_RESULT } from "@/sanity.types";
import { ExternalLink } from "@/components/ExternalLink";
import type { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { stegaClean } from "@sanity/client/stega";
import { toStaticImageData } from "@/sanity/lib/mappers";
import Image from "next/image";
import type { ReactNode } from "react";
import { imageSizes } from "@/lib/layout";

type PostBody = NonNullable<NonNullable<BLOG_POST_QUERY_RESULT>["body"]>;
type ImageBlock = Extract<PostBody[number], { _type: "imageWithAlt" }>;
type CalloutBlock = Extract<PostBody[number], { _type: "callout" }>;
type CodeBlock = Extract<PostBody[number], { _type: "codeBlock" }>;
type TimelineBlock = Extract<PostBody[number], { _type: "timeline" }>;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-ink-soft text-[1.0625rem] leading-[1.75] text-pretty">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl sm:text-[1.625rem]">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="mt-6 text-xl">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-brand text-ink border-l-2 pl-5 text-xl text-pretty">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-ink-soft marker:text-ink-faint flex list-disc flex-col gap-2 pl-6 text-[1.0625rem] leading-[1.75]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-ink-soft marker:text-ink-faint flex list-decimal flex-col gap-2 pl-6 text-[1.0625rem] leading-[1.75] marker:text-sm">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: ReactNode;
      value?: { href?: string; blank?: boolean };
    }) => {
      const href = value?.href ? stegaClean(value.href) : undefined;
      if (!href) {
        return <>{children}</>;
      }

      const external = value?.blank || href.startsWith("http");
      if (external) {
        return (
          <ExternalLink
            href={href}
            className="text-ink decoration-ink/30 hover:text-brand-text hover:decoration-brand-text underline underline-offset-4 transition-colors"
          >
            {children}
          </ExternalLink>
        );
      }

      return (
        <a
          href={href}
          className="text-ink decoration-ink/30 hover:text-brand-text hover:decoration-brand-text underline underline-offset-4 transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.875em]">
        {children}
      </code>
    ),
  },
  types: {
    imageWithAlt: ({ value }) => {
      const image = value as ImageBlock;
      const asset = image.asset;
      const dimensions = asset?.metadata?.dimensions;
      if (!asset?.url || !dimensions) return null;

      const src = toStaticImageData(
        image as Parameters<typeof toStaticImageData>[0],
        `blog-body-${image._key ?? "image"}`,
      );

      return (
        <figure className="my-6">
          <div className="border-rule border bg-surface-2 rounded-frame overflow-hidden">
            <Image
              src={src}
              alt={image.alt}
              width={dimensions.width}
              height={dimensions.height}
              placeholder="blur"
              sizes={imageSizes.content}
              className="h-auto w-full"
            />
          </div>
          {image.caption && (
            <figcaption className="text-ink-faint mt-2.5 text-xs text-pretty">
              {image.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => {
      const callout = value as CalloutBlock;
      return (
        <aside className="border-brand bg-surface-2 my-4 border-l-2 px-5 py-4">
          {callout.title && (
            <p className="text-ink font-semibold">{callout.title}</p>
          )}
          <p className="text-ink-soft mt-1">{callout.body}</p>
        </aside>
      );
    },
    codeBlock: ({ value }) => {
      const block = value as CodeBlock;
      return (
        <figure className="my-8">
          {block.filename && (
            <figcaption className="bg-surface-2 text-ink-faint text-xs px-4 py-2">
              {block.filename}
            </figcaption>
          )}
          <pre className="bg-secondary text-secondary-foreground overflow-x-auto rounded-frame p-5 font-mono text-[0.8125rem] leading-relaxed">
            <code data-language={block.language}>{block.code}</code>
          </pre>
        </figure>
      );
    },
    timeline: ({ value }) => {
      const timeline = value as TimelineBlock;
      const items = timeline.items?.filter((item) => item?.date && item?.body);
      if (!items?.length) return null;

      return (
        <div className="flex flex-col gap-5">
          {items.map((item, index) => (
            <p
              key={item._key ?? `${item.date}-${index}`}
              className="text-ink-soft text-[1.0625rem] leading-[1.75] text-pretty"
            >
              <span className="text-ink text-sm font-medium">
                {item.date}.
              </span>{" "}
              {item.body}
            </p>
          ))}
        </div>
      );
    },
  },
};

export function BlogPortableText({ value }: { value: PostBody }) {
  return (
    <div className="flex flex-col gap-5">
      <PortableText value={value} components={components} />
    </div>
  );
}
