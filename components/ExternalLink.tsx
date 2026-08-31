"use client";

import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  GlimpseTitle,
  GlimpseTrigger,
} from "@/components/kibo-ui/glimpse";
import type { GlimpsePreview } from "@/components/kibo-ui/glimpse/server";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  useCallback,
  useRef,
  useState,
} from "react";

type ExternalLinkProps = ComponentProps<"a">;

export function ExternalLink({
  href,
  className,
  children,
  onPointerEnter,
  ...props
}: ExternalLinkProps) {
  const [preview, setPreview] = useState<GlimpsePreview | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  const fetchPreview = useCallback(async () => {
    if (!href || fetchedRef.current || loading) {
      return;
    }

    fetchedRef.current = true;
    setLoading(true);

    try {
      const response = await fetch(
        `/api/glimpse?url=${encodeURIComponent(href)}`,
      );
      if (response.ok) {
        setPreview(await response.json());
      }
    } catch {
      // Preview is optional; the link still works without it.
    } finally {
      setLoading(false);
    }
  }, [href, loading]);

  const hasPreviewContent =
    preview?.title || preview?.description || preview?.image;

  return (
    <Glimpse
      openDelay={200}
      closeDelay={100}
      onOpenChange={(open) => {
        if (open) {
          void fetchPreview();
        }
      }}
    >
      <GlimpseTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onPointerEnter={(event) => {
            void fetchPreview();
            onPointerEnter?.(event);
          }}
          {...props}
        >
          {children}
        </a>
      </GlimpseTrigger>
      <GlimpseContent
        align="start"
        side="top"
        className={cn("border-rule w-80 overflow-hidden p-0")}
      >
        <div className="p-4">
          {loading && !hasPreviewContent ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="aspect-[120/63] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ) : hasPreviewContent ? (
            <>
              {preview?.image ? (
                <GlimpseImage src={preview.image} alt="" />
              ) : null}
              {preview?.title ? (
                <GlimpseTitle>{preview.title}</GlimpseTitle>
              ) : null}
              {preview?.description ? (
                <GlimpseDescription>{preview.description}</GlimpseDescription>
              ) : null}
            </>
          ) : null}
        </div>
      </GlimpseContent>
    </Glimpse>
  );
}
