import type { ProcessStep } from "@/components/WorkSection/caseStudies";
import { cn } from "@/lib/utils";
import MediaFrame, { mediaGridClass, mediaSizes } from "./MediaFrame";

/**
 * Shared chrome for the step markers: the numbered node, the phase chip and
 * the jump links above the list. Kept in one constant so the spine reads as a
 * single sequence rather than three separate treatments.
 */
export const stepChipClass = "border-rule bg-paper text-brand-text border";

export function stepId(index: number, title: string) {
  return `step-${index + 1}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

type ProcessStepItemProps = {
  step: ProcessStep;
  index: number;
  isLast: boolean;
};

export default function ProcessStepItem({
  step,
  index,
  isLast,
}: ProcessStepItemProps) {
  const number = String(index + 1).padStart(2, "0");
  const id = stepId(index, step.title);
  const isPhoneSet = step.media?.every(
    (item) => item.kind === "image" && item.orientation === "portrait",
  );

  return (
    <li id={id} className="relative scroll-mt-28 md:pl-24">
      {/* Connector running down to the next step. */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="border-rule absolute top-16 bottom-[-2rem] left-8 hidden border-l border-dashed md:block"
        />
      )}

      {/* Numbered node, desktop only. It becomes an inline chip on mobile. */}
      <div
        className={cn(
          "absolute top-0 left-0 hidden h-16 w-16 items-center justify-center md:flex",
          stepChipClass,
        )}
      >
        <span className="text-2xl font-semibold tabular-nums">{number}</span>
      </div>

      <div className="border-rule bg-paper border p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center text-sm font-semibold tabular-nums md:hidden",
              stepChipClass,
            )}
          >
            {number}
          </span>
          <span
            className={cn(
              "px-3 py-1 text-xs font-medium tracking-wide",
              stepChipClass,
            )}
          >
            {step.phase}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-semibold md:text-2xl">{step.title}</h3>

        <div className="text-ink-soft mt-3 space-y-3">
          {step.body.map((paragraph) => (
            <p key={paragraph} className="text-sm text-pretty lg:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {step.media && step.media.length > 0 && (
          <div className={cn("mt-5", mediaGridClass(step.media))}>
            {step.media.map((item, mediaIndex) => {
              // An odd count would leave a lone item stranded in one column,
              // so the pairs come first and the odd one out runs full width.
              // Phone screens keep their own layout and are never stretched.
              const isFeatured =
                !isPhoneSet &&
                step.media!.length % 2 === 1 &&
                mediaIndex === step.media!.length - 1;

              return (
                <MediaFrame
                  key={item.kind === "image" ? item.alt : item.src}
                  media={item}
                  expandable
                  className={cn(isFeatured && "md:col-span-2")}
                  sizes={
                    isFeatured
                      ? "(min-width: 1536px) 40vw, (min-width: 768px) 60vw, 90vw"
                      : mediaSizes(step.media!)
                  }
                />
              );
            })}
          </div>
        )}

        {step.takeaways && step.takeaways.length > 0 && (
          <div className="border-rule bg-brand/5 mt-6 border p-5">
            {/* Same size as the points below it, so the callout reads as one
                block of text rather than a label sitting above a list. */}
            <p className="text-brand-text text-sm font-semibold tracking-wide">
              What this told me
            </p>
            <ul className="text-ink-soft mt-2 space-y-1">
              {step.takeaways.map((takeaway) => (
                <li key={takeaway} className="text-sm text-pretty">
                  • {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
