import type { BLOG_POST_QUERY_RESULT } from "@/sanity.types";
import type { PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { stegaClean } from "@sanity/client/stega";
import { toStaticImageData } from "@/sanity/lib/mappers";
import Image from "next/image";
import type { ReactNode } from "react";

type PostBody = NonNullable<
  NonNullable<BLOG_POST_QUERY_RESULT>["body"]
>;
type ImageBlock = Extract<PostBody[number], { _type: "imageWithAlt" }>;
type CalloutBlock = Extract<PostBody[number], { _type: "callout" }>;
type CodeBlock = Extract<PostBody[number], { _type: "codeBlock" }>;
type TimelineBlock = Extract<PostBody[number], { _type: "timeline" }>;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-ink-soft text-base leading-7 text-pretty">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-brand-text mt-10 text-2xl md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-brand-text mt-8 text-xl font-semibold">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-brand text-ink-soft border-l-4 pl-5 text-lg italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-ink-soft flex list-disc flex-col gap-2 pl-6">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-ink-soft flex list-decimal flex-col gap-2 pl-6">
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
      const external = value?.blank || href?.startsWith("http");
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="text-brand-text underline underline-offset-4"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-surface-2 border-rule border px-1.5 py-0.5 text-sm">
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
        <figure className="my-8">
          <div className="border-rule bg-paper overflow-hidden border">
            <Image
              src={src}
              alt={image.alt}
              width={dimensions.width}
              height={dimensions.height}
              placeholder="blur"
              sizes="(min-width: 1463px) 960px, (min-width: 640px) 66vw, 90vw"
              className="h-auto w-full"
            />
          </div>
          {image.caption && (
            <figcaption className="text-ink-soft mt-2 text-sm">
              {image.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => {
      const callout = value as CalloutBlock;
      return (
        <aside className="border-rule bg-brand/5 my-8 border p-6">
          {callout.title && (
            <p className="font-semibold">{callout.title}</p>
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
            <figcaption className="border-rule bg-surface-2 border border-b-0 px-4 py-2 text-xs font-medium">
              {block.filename}
            </figcaption>
          )}
          <pre className="bg-secondary text-secondary-foreground overflow-x-auto p-5 text-sm">
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
              className="text-ink-soft text-base leading-7 text-pretty"
            >
              <span className="text-brand-text font-medium">
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
