import { BlogPostTile } from "@/components/Blog/BlogPostCard";
import { BlogIndexSkeleton } from "@/components/loading/PageSkeletons";
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
  description: "Stories from things I build in my spare time with friends.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog",
    description: "Stories from things I build in my spare time with friends.",
    type: "website",
    url: "/blog",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Stories from things I build in my spare time with friends.",
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

async function CachedBlogPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const { data: documents } = await sanityFetch({
    query: BLOG_POSTS_QUERY,
    perspective,
    stega,
  });

  const posts = documents.map(mapBlogPostCard);

  return (
    <main id="main" className="page-grid flex-1">
      <nav aria-label="Breadcrumb" className="pt-8 sm:pt-12">
        <Link
          href="/"
          className="text-brand-text inline-flex items-center gap-1.5 text-xs underline-offset-4 hover:underline"
        >
          <LuArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Home
        </Link>
      </nav>

      <header className="mt-4">
        <h1 className="text-[1.875rem] leading-tight tracking-[-0.02em] sm:text-[2.25rem]">
          Blog
        </h1>
        <p className="text-ink-soft mt-2 text-lg text-pretty">
          Stories from things I build in my spare time with friends.
        </p>
      </header>

      <div className="mt-8">
        {posts.length > 0 ? (
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {posts.map((post) => (
              <BlogPostTile key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft py-8">
            The first article is being prepared.
          </p>
        )}
      </div>
    </main>
  );
}
