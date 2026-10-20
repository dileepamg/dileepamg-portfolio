import { BlogPortableText } from "@/components/Blog/BlogPortableText";
import { BlogPostPageSkeleton } from "@/components/loading/PageSkeletons";
import { JsonLd } from "@/components/structured-data/JsonLd";
import { getBlogPostStructuredData } from "@/components/structured-data/blogPost";
import { Badge } from "@/components/ui/badge";
import { imageSizes, ratioOf } from "@/lib/layout";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { AUTHOR_NAME } from "@/lib/site";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import { toStaticImageData, cleanSanityString } from "@/sanity/lib/mappers";
import { BLOG_POST_QUERY } from "@/sanity/lib/queries";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC",
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetchMetadata({
    query: BLOG_POST_QUERY,
    params: { slug },
    perspective: "published",
  });
  if (!post) return {};

  const postSlug = cleanSanityString(post.slug);
  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt;
  const image = post.seo?.image?.asset?.url ?? post.featuredImage.asset?.url;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${postSlug}` },
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    authors: [{ name: AUTHOR_NAME, url: "/" }],
    openGraph: {
      title,
      description,
      url: `/blog/${postSlug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: [AUTHOR_NAME],
      images: image ? [image] : ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : ["/opengraph-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return (
      <Suspense fallback={<BlogPostPageSkeleton />}>
        <DynamicBlogPostPage params={params} />
      </Suspense>
    );
  }

  const { slug } = await params;
  return (
    <CachedBlogPostPage slug={slug} perspective="published" stega={false} />
  );
}

async function DynamicBlogPostPage({ params }: PageProps) {
  const [{ slug }, options] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedBlogPostPage slug={slug} {...options} />;
}

async function CachedBlogPostPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";

  const { data: post } = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!post) notFound();

  const postSlug = cleanSanityString(post.slug);
  const image = toStaticImageData(
    post.featuredImage,
    `${post._id}.featuredImage`,
  );
  const imageUrl = post.featuredImage.asset?.url;
  if (!imageUrl) {
    throw new Error(`Featured image asset is missing for ${post._id}`);
  }

  const readingMinutes = estimateReadingMinutes(post.body);
  const jsonLd = getBlogPostStructuredData({
    slug: postSlug,
    title: post.title,
    description: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post._updatedAt,
    imageUrl,
  });

  return (
    <>
      <JsonLd data={jsonLd} />

      <main id="main" className="page-grid flex-1">
        <nav aria-label="Breadcrumb" className="pt-8 sm:pt-12">
          <Link
            href="/blog"
            className="text-brand-text inline-flex items-center gap-1.5 text-xs underline-offset-4 hover:underline"
          >
            <LuArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Blog
          </Link>
        </nav>

        <header className="mt-8 sm:mt-10">
          <p className="text-ink-faint flex flex-wrap items-center gap-2 text-xs">
            <time dateTime={post.publishedAt}>
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
            <span aria-hidden="true">·</span>
            <span>{readingMinutes} min read</span>
          </p>

          <h1 className="mt-3 text-[1.875rem] leading-tight tracking-[-0.02em] text-pretty sm:text-[2.25rem]">
            {post.title}
          </h1>
          <p className="text-ink-soft mt-4 text-lg text-pretty sm:text-xl sm:leading-relaxed">
            {post.excerpt}
          </p>

          {((post.categories ?? []).length > 0 ||
            (post.tags ?? []).length > 0) && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {(post.categories ?? []).map((category) => (
                <Badge key={category._id} variant="brand">
                  {category.title}
                </Badge>
              ))}
              {(post.tags ?? []).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </header>

        <div className="bleed-wide mt-10 sm:mt-12">
          <div
            className="border-rule bg-surface-2 rounded-frame relative overflow-hidden border"
            style={{ aspectRatio: ratioOf(image) }}
          >
            <Image
              src={image}
              alt={post.featuredImage.alt}
              fill
              priority
              placeholder="blur"
              sizes={imageSizes.wide}
              className="object-cover object-center"
            />
          </div>
        </div>

        <article className="mt-12 sm:mt-14">
          <BlogPortableText
            value={post.body as Parameters<typeof BlogPortableText>[0]["value"]}
          />
        </article>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="border-rule mt-20 border-t pt-8"
          >
            <h2
              id="related-heading"
              className="text-ink text-[1.25rem] font-semibold tracking-[-0.015em] sm:text-[1.375rem]"
            >
              Continue reading
            </h2>
            <div className="mt-4 space-y-1">
              {post.relatedPosts.map((related) => (
                <Link
                  key={related._id}
                  href={`/blog/${cleanSanityString(related.slug)}`}
                  className="group hover:bg-tint rounded-frame -mx-3 flex items-center justify-between gap-4 px-3 py-3 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="text-ink block text-[0.9375rem] font-medium text-pretty">
                      {related.title}
                    </span>
                    <span className="text-ink-soft mt-0.5 line-clamp-2 block text-sm text-pretty">
                      {related.excerpt}
                    </span>
                  </span>
                  <LuArrowRight
                    aria-hidden="true"
                    className="text-ink-faint group-hover:text-ink size-4 shrink-0 transition-[translate,color] group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
