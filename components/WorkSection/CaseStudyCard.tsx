import MediaFrame from "@/components/CaseStudy/MediaFrame";
import Link from "next/link";
import { type CaseStudy } from "./caseStudies";

type CaseStudyCardProps = {
  study: CaseStudy;
};

export default function CaseStudyCard({ study }: CaseStudyCardProps) {
  const { slug, title, description, media } = study;
  const headingId = `case-study-${slug}`;
  const href = `/work/${slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className="shadow-shadow rounded-lg border-3 bg-white p-4 md:p-5 dark:bg-black"
    >
      <div className="flex flex-col gap-5 sm:flex-row-reverse">
        <Link
          href={href}
          aria-label={`View the ${title} case study`}
          className="w-full shrink-0 sm:w-1/2"
        >
          <MediaFrame
            media={media}
            bordered={false}
            sizes="(min-width: 1536px) 20vw, (min-width: 640px) 30vw, 90vw"
          />
        </Link>

        <div className="flex w-full flex-col justify-center gap-4">
          <h3 id={headingId} className="text-2xl font-bold">
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          </h3>

          <p className="dark:text-darkText text-sm text-pretty lg:text-base">
            {description}
          </p>

          <Link
            href={href}
            className="shadow-shadow bg-main flex w-fit transform items-center gap-2 border-2 px-2 py-2 text-black transition-transform hover:-translate-y-1 dark:text-black"
          >
            See how it came together <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
