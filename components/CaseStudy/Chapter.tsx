import type { CaseStudyChapter } from "@/components/WorkSection/caseStudies";
import { cn } from "@/lib/utils";
import MediaFrame, { mediaGridClass, mediaSizes } from "./MediaFrame";

/**
 * The numbered marker: the node on the spine at desktop, and the inline number
 * beside the title on mobile. One constant so the two read as the same mark at
 * two sizes rather than as separate treatments.
 */
const markerClass = "border-rule bg-paper text-brand-text border";

/**
 * Anchor for a chapter.
 *
 * The chapter's own `id` wins, so a link that has been shared keeps working
 * while the title above it is still being edited. Without one, the title is
 * slugified, which stays readable in the URL bar and describes the section
 * rather than its position in a list.
 */
function chapterId(chapter: CaseStudyChapter) {
  return (
    chapter.id ??
    chapter.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

type ChapterItemProps = {
  chapter: CaseStudyChapter;
  index: number;
  isLast: boolean;
};

export default function ChapterItem({
  chapter,
  index,
  isLast,
}: ChapterItemProps) {
  const number = String(index + 1).padStart(2, "0");
  const id = chapterId(chapter);
  const isPhoneSet = chapter.media?.every(
    (item) => item.kind === "image" && item.orientation === "portrait",
  );
  const ListTag = chapter.list?.ordered ? "ol" : "ul";

  return (
    <li id={id} className="relative scroll-mt-28 md:pl-24">
      {/* Connector running down to the next chapter. */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="border-rule absolute top-16 bottom-[-2rem] left-8 hidden border-l border-dashed md:block"
        />
      )}

      {/* Numbered node, desktop only. It becomes an inline number on mobile. */}
      <div
        className={cn(
          "absolute top-0 left-0 hidden h-16 w-16 items-center justify-center md:flex",
          markerClass,
        )}
      >
        <span className="text-2xl font-semibold tabular-nums">{number}</span>
      </div>

      <div className="border-rule bg-paper border p-6 md:p-8">
        {/* The number sits beside the title rather than above it, so a chapter
            opens on its heading at every width. */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center text-sm font-semibold tabular-nums md:hidden",
              markerClass,
            )}
          >
            {number}
          </span>
          <h3 className="text-xl font-semibold md:text-2xl">{chapter.title}</h3>
        </div>

        {/* The chapter's argument in one line. Sized between the heading and
            the body so a reader skimming headings still catches it. */}
        {chapter.lede && (
          <p className="text-brand-text mt-3 text-base font-medium text-pretty md:text-lg">
            {chapter.lede}
          </p>
        )}

        {chapter.list && chapter.list.items.length > 0 && (
          <ListTag
            className={cn(
              "text-ink-soft marker:text-brand-text mt-4 space-y-1.5 pl-5 text-sm text-pretty lg:text-base",
              chapter.list.ordered
                ? "list-decimal marker:font-medium marker:tabular-nums"
                : "list-disc",
            )}
          >
            {chapter.list.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ListTag>
        )}

        <div className="text-ink-soft mt-4 space-y-3">
          {chapter.body.map((paragraph) => (
            <p key={paragraph} className="text-sm text-pretty lg:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {chapter.media && chapter.media.length > 0 && (
          <div className={cn("mt-5", mediaGridClass(chapter.media))}>
            {chapter.media.map((item, mediaIndex) => {
              // An odd count would leave a lone item stranded in one column,
              // so the pairs come first and the odd one out runs full width.
              // Phone screens keep their own layout and are never stretched.
              const isFeatured =
                !isPhoneSet &&
                chapter.media!.length % 2 === 1 &&
                mediaIndex === chapter.media!.length - 1;

              return (
                <MediaFrame
                  key={item.kind === "image" ? item.alt : item.src}
                  media={item}
                  expandable
                  className={cn(isFeatured && "md:col-span-2")}
                  sizes={
                    isFeatured
                      ? "(min-width: 1536px) 40vw, (min-width: 768px) 60vw, 90vw"
                      : mediaSizes(chapter.media!)
                  }
                />
              );
            })}
          </div>
        )}

        {chapter.decisions && chapter.decisions.length > 0 && (
          <div className="border-rule bg-brand/5 mt-6 border p-5">
            {/* A label rather than a heading: it names the list under it, and
                putting it in the outline would add a level per chapter that
                says nothing the chapter title has not already said. */}
            <p className="text-brand-text text-sm font-semibold tracking-wide">
              Key decisions
            </p>
            <ul className="text-ink-soft mt-2 space-y-1">
              {chapter.decisions.map((decision) => (
                <li key={decision} className="text-sm text-pretty">
                  • {decision}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
