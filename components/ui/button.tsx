import { Slot } from "radix-ui";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Radius is owned by `shape`, never by `variant` or `size`, so the morph is
  // the same everywhere and nothing can quietly opt out of it. Shadows are
  // deliberately absent, since the design separates surfaces with rules, not depth.
  "inline-flex shrink-0 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap select-none outline-none transition-[border-radius,background-color,border-color,color] duration-300 ease-morph focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        // `border-border`, not `border-rule`: the rules were halved to match
        // the reference grid, and a control that faint stops reading as
        // something you can press. Same split the reference makes, where the
        // ruled grid is `gray-950/5` and buttons carry `gray-950/10`.
        outline:
          "border-border bg-background hover:border-brand hover:bg-brand hover:text-brand-ink border",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      /**
       * Each size carries the radius that makes it a pill, half its own
       * height. `rounded-full` cannot be used here: Tailwind v4 resolves it to
       * `calc(infinity * 1px)`, which computes to ~33,554,432px. A transition
       * across that range is real but spends all but its final instant above
       * the largest visible radius, so the corner appears to snap rather than
       * morph. A finite value interpolates over the range the eye can see.
       */
      size: {
        default: "h-10 px-5 has-[>svg]:px-4 [--btn-radius:1.25rem]",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 [--btn-radius:1rem]",
        lg: "h-11 px-6 [--btn-radius:1.375rem]",
        icon: "size-10 [--btn-radius:1.25rem]",
      },
      /**
       * The morph, named for the shape each starts in. `square` is the default
       * for every action on the page; `pill` is the reverse and is used only
       * by the social row, so it reads as a set apart from the page's actions
       * rather than as four more of them.
       */
      shape: {
        square: "rounded-none hover:rounded-(--btn-radius)",
        pill: "rounded-(--btn-radius) hover:rounded-none",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "square",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "square",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
