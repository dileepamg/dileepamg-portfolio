import { BlogPostCard } from "@/components/Blog/BlogPostCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { BlogPostCardView } from "@/sanity/lib/mappers";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type BlogSectionProps = {
  posts: readonly BlogPostCardView[];
  heading?: string;
  description?: string;
};

export function BlogSection({
  posts,
  heading = "Blog",
  description =
    "Stories from things I build in my spare time with friends.",
}: BlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="scroll-mt-28">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="pt-0 transition-opacity hover:opacity-70 [&>svg]:size-6">
            <SectionHeading title={heading} description={description} />
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-8 pt-2 pb-4">
              <div className={cn(splitGrid, "gap-8")}>
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
