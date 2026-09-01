"use client";

import { Button } from "@/components/ui/button";
import { useId, useState } from "react";

type DisclosureProps = {
  /** Rendered on the server and passed through, so it stays a server tree. */
  heading: React.ReactNode;
  children: React.ReactNode;
  showLabel?: string;
  hideLabel?: string;
  defaultOpen?: boolean;
};

/**
 * A heading with a button that reveals the block under it.
 *
 * This replaces the accordion the section used to be wrapped in. The panel is
 * mounted only while open, matching what the accordion did: the videos inside
 * fetch their metadata when they are shown, not on first paint.
 *
 * `heading` and `children` arrive as props rather than being built here, so
 * everything inside stays server rendered and only the toggle ships JavaScript.
 */
export function Disclosure({
  heading,
  children,
  showLabel = "View",
  hideLabel = "Hide",
  defaultOpen = false,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        {heading}

        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? hideLabel : showLabel}
        </Button>
      </div>

      {open && (
        <div id={panelId} className="mt-6">
          {children}
        </div>
      )}
    </>
  );
}
