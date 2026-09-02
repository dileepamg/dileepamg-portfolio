import { BlogPortableText } from "@/components/Blog/BlogPortableText";
import { BlogPostPageSkeleton } from "@/components/loading/PageSkeletons";
import { JsonLd } from "@/components/structured-data/JsonLd";
import { getBlogPostStructuredData } from "@/components/structured-data/blogPost";
import { Badge } from "@/components/ui/badge";
import { Band } from "@/components/ui/band";
import { columnClass, columnPadding, imageSizes } from "@/lib/layout";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { AUTHOR_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
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
  const image =
    post.seo?.image?.asset?.url ?? post.featuredImage.asset?.url;

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
    <CachedBlogPostPage
      slug={slug}
      perspective="published"
      stega={false}
    />
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
    <div className="relative">
      <JsonLd data={jsonLd} />
      <main className={cn(columnClass, "relative mx-auto")}>
        <div className="bg-hatch relative z-10 space-y-8 pb-12">
          <Band
            topCrosses={false}
            className={cn(columnPadding, "pt-32 md:pt-40")}
          >
            <Link
              href="/blog"
              className="text-ink-soft hover:text-brand-text inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <LuArrowLeft />
              Back to Blog
            </Link>

            <header className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <time
                  dateTime={post.publishedAt}
                  className="text-ink-faint text-sm font-medium"
                >
                  {dateFormatter.format(new Date(post.publishedAt))}
                </time>
                <span className="text-ink-faint" aria-hidden>
                  ·
                </span>
                <span className="text-ink-faint text-sm">
                  {readingMinutes} min read
                </span>
              </div>

              <h1 className="mt-4 max-w-4xl text-2xl text-pretty md:text-3xl">
                {post.title}
              </h1>
              <p className="text-brand-text mt-4 max-w-3xl text-lg font-medium text-pretty md:text-xl">
                {post.excerpt}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {(post.categories ?? []).map((category) => (
                  <Badge key={category._id} variant="outline">
                    {category.title}
                  </Badge>
                ))}
                {(post.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            <div className="border-rule relative mt-8 aspect-video overflow-hidden border">
              <Image
                src={image}
                alt={post.featuredImage.alt}
                fill
                priority
                placeholder="blur"
                sizes={imageSizes.content}
                className="object-cover object-center"
              />
            </div>
          </Band>

          <Band className={columnPadding}>
            <article className="mx-auto max-w-3xl">
              <BlogPortableText
                value={
                  post.body as Parameters<
                    typeof BlogPortableText
                  >[0]["value"]
                }
              />
            </article>
          </Band>

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <Band bottomCrosses={false} className={columnPadding}>
              <section>
                <h2 className="text-2xl md:text-3xl">Continue reading</h2>
                <div className="mt-6 grid gap-4">
                  {post.relatedPosts.map((related) => (
                    <Link
                      key={related._id}
                      href={`/blog/${cleanSanityString(related.slug)}`}
                      className="border-rule bg-paper hover:border-brand/50 group flex items-center justify-between gap-4 border p-6 transition-colors"
                    >
                      <span>
                        <span className="text-lg font-semibold">
                          {related.title}
                        </span>
                        <span className="text-ink-soft mt-1 block text-sm">
                          {related.excerpt}
                        </span>
                      </span>
                      <LuArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </section>
            </Band>
          )}
        </div>
      </main>
    </div>
  );
}
