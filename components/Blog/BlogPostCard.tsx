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

/**
 * The card is used under an `h1` on /blog and under the section's `h2` on the
 * home page, so the level it should sit at differs by page. Defaulting to 2
 * keeps /blog correct without a prop.
 */
export function BlogPostCard({
  post,
  headingLevel = 2,
}: {
  post: BlogPostCardView;
  headingLevel?: 2 | 3;
}) {
  const href = `/blog/${post.slug}`;
  const headingId = `post-${post.slug}`;
  const Heading = `h${headingLevel}` as "h2" | "h3";

  return (
    <article
      aria-labelledby={headingId}
      className="group border-rule bg-paper hover:border-brand/50 flex flex-col border transition-colors"
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
          placeholder="blur"
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 65vw, 90vw"
          className="object-cover object-center"
        />
      </Link>

      {/* `flex-1` on both the body and the text block inside it: the article
          is already a column, so growing these two hands the leftover height
          to the excerpt and leaves the button on the card floor. Without it a
          short excerpt parks its button halfway up while the card beside it
          keeps its own at the bottom. */}
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
          <Heading id={headingId} className="text-lg font-medium text-pretty">
            <Link
              href={href}
              className="hover:text-brand-text transition-colors"
            >
              {post.title}
            </Link>
          </Heading>
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
