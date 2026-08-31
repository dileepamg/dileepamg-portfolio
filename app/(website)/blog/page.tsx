import { BlogPostCard } from "@/components/Blog/BlogPostCard";
import { BlogIndexSkeleton } from "@/components/loading/PageSkeletons";
import { Band } from "@/components/ui/band";
import { columnClass, columnPadding, splitGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { mapBlogPostCard } from "@/sanity/lib/mappers";
import { BLOG_POSTS_QUERY } from "@/sanity/lib/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { LuArrowLeft } from "react-icons/lu";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories from things I build in my spare time with friends.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog",
    description:
      "Stories from things I build in my spare time with friends.",
    type: "website",
    url: "/blog",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description:
      "Stories from things I build in my spare time with friends.",
    images: ["/opengraph-image.png"],
  },
};

export default async function BlogPage() {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return (
      <Suspense fallback={<BlogIndexSkeleton />}>
        <DynamicBlogPage />
      </Suspense>
    );
  }

  return <CachedBlogPage perspective="published" stega={false} />;
}

async function DynamicBlogPage() {
  const options = await getDynamicFetchOptions();
  return <CachedBlogPage {...options} />;
}

async function CachedBlogPage({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";

  const { data: documents } = await sanityFetch({
    query: BLOG_POSTS_QUERY,
    perspective,
    stega,
  });

  const posts = documents.map(mapBlogPostCard);

  return (
    <div className="relative">
      <main className={cn(columnClass, "relative mx-auto")}>
        <div className="bg-hatch relative z-10 space-y-8 pb-12">
          <Band
            topCrosses={false}
            className={cn(columnPadding, "pt-32 md:pt-40")}
          >
            <nav aria-label="Breadcrumb">
              <Link
                href="/"
                className="text-ink-soft hover:text-brand-text inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <LuArrowLeft />
                Back to Home
              </Link>
            </nav>

            <header className="mt-8">
              <h1 className="text-3xl md:text-4xl">Blog</h1>
              <p className="text-ink-soft mt-3 max-w-2xl text-pretty">
                Stories from things I build in my spare time with friends.
              </p>
            </header>
          </Band>

          <Band bottomCrosses={false} className={columnPadding}>
            {posts.length > 0 ? (
              <div className={cn(splitGrid, "gap-8")}>
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-ink-soft py-8">
                The first article is being prepared.
              </p>
            )}
          </Band>
        </div>
      </main>
    </div>
  );
}
