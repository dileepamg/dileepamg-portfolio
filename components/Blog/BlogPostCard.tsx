import type { BlogPostCardView } from "@/sanity/lib/mappers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function BlogPostCard({ post }: { post: BlogPostCardView }) {
  const href = `/blog/${post.slug}`;
  const headingId = `post-${post.slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className="group border-rule bg-paper hover:border-brand/50 flex h-full flex-col border transition-colors"
    >
      <Link
        href={href}
        aria-label={`Read ${post.title}`}
        className="border-rule relative block aspect-[16/9] overflow-hidden border-b"
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 65vw, 90vw"
          className="object-cover object-center"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <time
              dateTime={post.publishedAt}
              className="text-ink-faint text-xs font-medium"
            >
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
            <span className="text-ink-faint text-xs" aria-hidden>
              ·
            </span>
            <span className="text-ink-faint text-xs font-medium">
              {post.readingMinutes} min read
            </span>
          </div>
          {post.categories.length > 0 ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              {post.categories.map((category) => (
                <Badge key={category.slug} variant="outline">
                  {category.title}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex-1">
          <h2 id={headingId} className="text-xl font-semibold">
            <Link
              href={href}
              className="hover:text-brand-text transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          <p className="text-ink-soft mt-2 text-sm text-pretty">
            {post.excerpt}
          </p>
        </div>

        <Button asChild variant="outline" className="w-fit">
          <Link href={href}>
            Read article
            <LuArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
