import type { CaseStudyChapter } from "@/components/WorkSection/caseStudies";
import { imageSizes } from "@/lib/layout";
import { cn } from "@/lib/utils";
import MediaFrame, { mediaGridClass, mediaSizes } from "./MediaFrame";

/**
 * Anchor for a chapter.
 *
 * The chapter's own `id` wins, so a link that has been shared keeps working
 * while the title above it is still being edited. Without one, the title is
 * slugified, which stays readable in the URL bar and describes the section
 * rather than its position in a list.
 */
export function chapterId(chapter: CaseStudyChapter) {
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
};

/**
 * One chapter of a case study.
 *
 * Unboxed: the heading and a generous gap above are enough to mark where a
 * chapter starts, and dropping the card frame gives the text and
 * the screenshots the full width of the column. The lede is set a size up in
 * full ink so someone skimming headings and ledes alone still gets the story.
 */
export default function ChapterItem({ chapter }: ChapterItemProps) {
  const id = chapterId(chapter);
  const isPhoneSet = chapter.media?.every(
    (item) => item.kind === "image" && item.orientation === "portrait",
  );
  const ListTag = chapter.list?.ordered ? "ol" : "ul";

  return (
    <li id={id} className="scroll-mt-24">
      <h3 className="text-lg sm:text-xl">{chapter.title}</h3>

      {chapter.lede && (
        <p className="text-ink mt-2 text-[1.0625rem] text-pretty">{chapter.lede}</p>
      )}

      {chapter.list && chapter.list.items.length > 0 && (
        <ListTag
          className={cn(
            "text-ink-soft marker:text-ink-faint mt-4 space-y-1.5 pl-5 text-pretty",
            chapter.list.ordered
              ? "list-decimal marker:text-sm"
              : "list-disc",
          )}
        >
          {chapter.list.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      )}

      <div className="text-ink-soft mt-4 space-y-4">
        {chapter.body.map((paragraph) => (
          <p key={paragraph} className="text-pretty">
            {paragraph}
          </p>
        ))}
      </div>

      {chapter.media && chapter.media.length > 0 && (
        <div className={cn("mt-8", mediaGridClass(chapter.media))}>
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
                  isFeatured ? imageSizes.content : mediaSizes(chapter.media!)
                }
              />
            );
          })}
        </div>
      )}

      {/* A quiet box: a tint and a soft corner set the decisions apart from
          the story around them, with no rule or accent edge competing. */}
      {chapter.decisions && chapter.decisions.length > 0 && (
        <div className="bg-surface-2 rounded-frame mt-8 px-5 py-4 sm:px-6 sm:py-5">
          <h4 className="text-ink text-[0.9375rem] font-semibold">
            Key decisions
          </h4>
          <ul className="text-ink-soft marker:text-ink-faint mt-2 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-pretty">
            {chapter.decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
