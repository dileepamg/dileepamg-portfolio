import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BlogPostCard } from "@/components/Blog/BlogPostCard";
import { SectionHeading } from "@/components/ui/section-heading";
import { splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { BlogPostCardView } from "@/sanity/lib/mappers";
import Link from "next/link";

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
    <section id="blog" className="scroll-mt-28">
      <SectionHeading title={heading} description={description} />

      <div className="mt-6 flex flex-col gap-8">
        <div className={cn(splitGrid, "gap-8")}>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} headingLevel={3} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline" className="w-fit">
            <Link href="/blog">
              View all articles
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
