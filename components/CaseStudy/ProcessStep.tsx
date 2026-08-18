import type { ProcessStep } from "@/components/WorkSection/caseStudies";
import { cn } from "@/lib/utils";
import MediaFrame, { mediaGridClass, mediaSizes } from "./MediaFrame";

/**
 * One colour for every step, so the spine reads as a single sequence.
 * Light blue, chosen for a strong contrast ratio against the black text
 * and border that sit on top of it.
 */
export const stepColor = "bg-[#93c5fd]";

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
          className="border-border absolute top-16 bottom-[-2rem] left-8 hidden border-l-2 border-dashed md:block"
        />
      )}

      {/* Numbered node, desktop only — it becomes an inline chip on mobile. */}
      <div
        className={cn(
          "border-border shadow-shadow rounded-base absolute top-0 left-0 hidden h-16 w-16 items-center justify-center border-2 md:flex",
          stepColor,
        )}
      >
        <span className="font-heading text-2xl text-black">{number}</span>
      </div>

      <div className="shadow-shadow rounded-lg border-3 bg-white p-5 md:p-6 dark:bg-black">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "border-border rounded-base flex h-8 w-8 items-center justify-center border-2 text-sm font-bold text-black md:hidden",
              stepColor,
            )}
          >
            {number}
          </span>
          <span
            className={cn(
              "border-border rounded-base border-2 px-3 py-1 text-xs font-bold tracking-wide text-black uppercase",
              stepColor,
            )}
          >
            {step.phase}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-bold md:text-2xl">{step.title}</h3>

        <div className="mt-3 space-y-3">
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
          <div className="border-border bg-main rounded-base mt-5 border-2 p-4">
            <p className="text-main-foreground text-xs font-bold tracking-wide uppercase">
              What this told me
            </p>
            <ul className="mt-2 space-y-1">
              {step.takeaways.map((takeaway) => (
                <li
                  key={takeaway}
                  className="text-main-foreground text-sm text-pretty"
                >
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
