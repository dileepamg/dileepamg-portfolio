import {
  rowClass,
  rowDescriptionClass,
  rowMetaClass,
  rowTitleClass,
} from "@/components/ui/row";
import { imageSizes, ratioOf } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { BlogPostCardView } from "@/sanity/lib/mappers";
import Image from "next/image";
import Link from "next/link";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

/**
 * An article as a row: picture, title, a line of excerpt, then when and how
 * long. The whole row is the link, through the title's stretched link.
 *
 * Used under an `h1` on /blog and under the section's `h2` on the home page,
 * so the heading level is a prop. Defaulting to 2 keeps /blog correct.
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
      className={cn(
        rowClass,
        "grid-cols-[6rem_minmax(0,1fr)] items-start sm:grid-cols-[8rem_minmax(0,1fr)]",
      )}
    >
      <div
        className="border-rule bg-surface-2 relative overflow-hidden rounded-md border"
        style={{ aspectRatio: ratioOf(post.image) }}
      >
        <Image
          src={post.image}
          alt=""
          fill
          placeholder="blur"
          sizes={imageSizes.rowThumb}
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <Heading id={headingId} className={rowTitleClass}>
          <Link href={href} className="stretched-link">
            {post.title}
          </Link>
        </Heading>
        <p className={cn(rowDescriptionClass, "line-clamp-2")}>
          {post.excerpt}
        </p>
        <p className={cn(rowMetaClass, "mt-2 flex flex-wrap gap-x-2 gap-y-1")}>
          <time dateTime={post.publishedAt}>
            {dateFormatter.format(new Date(post.publishedAt))}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
          {post.categories.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                {post.categories.map((category) => category.title).join(", ")}
              </span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

/**
 * An article as a tile, for the blog index: the cover at full width and its
 * own shape, then the date, the title and the excerpt under it. The home page
 * keeps the compact row; this is the browsing view, where the pictures are
 * what you scan by.
 */
export function BlogPostTile({ post }: { post: BlogPostCardView }) {
  const href = `/blog/${post.slug}`;
  const headingId = `post-${post.slug}`;

  return (
    <article aria-labelledby={headingId} className="group relative">
      <div
        className="border-rule bg-surface-2 rounded-frame relative overflow-hidden border"
        style={{ aspectRatio: ratioOf(post.image) }}
      >
        <Image
          src={post.image}
          alt=""
          fill
          placeholder="blur"
          sizes={imageSizes.contentHalf}
          className="ease-out-soft object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <p className={cn(rowMetaClass, "mt-4 flex flex-wrap gap-x-2 gap-y-1")}>
        <time dateTime={post.publishedAt}>
          {dateFormatter.format(new Date(post.publishedAt))}
        </time>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes} min read</span>
        {post.categories.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span>
              {post.categories.map((category) => category.title).join(", ")}
            </span>
          </>
        )}
      </p>

      <h2
        id={headingId}
        className="text-ink mt-1.5 text-lg font-semibold text-pretty"
      >
        <Link
          href={href}
          className="stretched-link group-hover:decoration-ink/30 group-hover:underline group-hover:underline-offset-4"
        >
          {post.title}
        </Link>
      </h2>
      <p className="text-ink-soft mt-1.5 line-clamp-3 text-sm text-pretty">
        {post.excerpt}
      </p>
    </article>
  );
}
