import { BlogPostCard } from "@/components/Blog/BlogPostCard";
import {
  accentLinkClass,
  SectionHeading,
} from "@/components/ui/section-heading";
import type { BlogPostCardView } from "@/sanity/lib/mappers";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

type BlogSectionProps = {
  posts: readonly BlogPostCardView[];
  heading?: string;
  description?: string;
};

export function BlogSection({
  posts,
  heading = "Blog",
  description = "Stories from things I build in my spare time with friends.",
}: BlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" aria-labelledby="blog-heading">
      <SectionHeading
        id="blog-heading"
        title={heading}
        description={description}
        action={
          <Link
            href="/blog"
            className={accentLinkClass}
          >
            View all articles
            <LuArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="space-y-1">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} headingLevel={3} />
        ))}
      </div>
    </section>
  );
}
