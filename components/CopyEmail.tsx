"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

type CopyState = "idle" | "copied" | "failed";

type CopyEmailProps = {
  email: string;
  /** The word shown in the sentence. The address itself lives in the label. */
  children: React.ReactNode;
  className?: string;
};

/**
 * The email address, copied rather than handed to a mail client.
 *
 * A `mailto:` opens whatever the OS believes the mail client to be, which for
 * most people is either nothing or the wrong thing. Copying puts the address
 * where they can paste it into the client they actually use.
 *
 * The address is in `aria-label`, so a screen reader hears what will be copied
 * before activating it, and the outcome is announced through a live region
 * rather than only being drawn. Radix owns the tooltip's own semantics and the
 * `aria-describedby` wiring.
 */
export function CopyEmail({ email, children, className }: CopyEmailProps) {
  const [state, setState] = useState<CopyState>("idle");
  const [hovered, setHovered] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copy() {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      // Clipboard access is refused outside a secure context and in some
      // embedded browsers. Show the address instead of failing silently, so it
      // can still be selected by hand.
      setState("failed");
    }

    resetTimer.current = setTimeout(() => setState("idle"), 2000);
  }

  const label =
    state === "copied"
      ? "Copied"
      : state === "failed"
        ? email
        : "Click to copy";

  return (
    <>
      {/* Held open while the confirmation shows: Radix closes a tooltip on
          pointer down, which would take "Copied" away at the exact moment it
          is worth reading. */}
      <Tooltip
        open={state !== "idle" || hovered}
        onOpenChange={setHovered}
        delayDuration={300}
      >
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`Copy email address ${email}`}
            className={cn(
              "cursor-pointer underline underline-offset-4 transition-colors",
              "focus-visible:ring-brand focus-visible:rounded-xs focus-visible:ring-2 focus-visible:outline-none",
              className,
            )}
            onClick={copy}
          >
            {children}
          </button>
        </TooltipTrigger>

        <TooltipContent sideOffset={6} className="flex items-center gap-1.5">
          {state === "copied" ? (
            <LuCheck
              aria-hidden="true"
              className="size-3.5 shrink-0 motion-safe:animate-[var(--animate-copy-pop)]"
            />
          ) : state === "idle" ? (
            <LuCopy aria-hidden="true" className="size-3.5 shrink-0" />
          ) : null}
          {label}
        </TooltipContent>
      </Tooltip>

      {/* Announced, not just drawn. */}
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Email address copied to clipboard"
          : state === "failed"
            ? `Could not copy. The address is ${email}`
            : ""}
      </span>
    </>
  );
}
