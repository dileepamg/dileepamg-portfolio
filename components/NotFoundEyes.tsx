"use client";

import { cn } from "@/lib/utils";
import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

type Point = { x: number; y: number };

function usePointerTarget(enabled: boolean) {
  const [target, setTarget] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const point = "touches" in event ? event.touches[0] : event;
      if (!point) {
        return;
      }

      setTarget({ x: point.clientX, y: point.clientY });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [enabled]);

  return target;
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function Eye({
  eyeRef,
  target,
  trackPointer,
}: {
  eyeRef: RefObject<HTMLDivElement | null>;
  target: Point;
  trackPointer: boolean;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!trackPointer || !eyeRef.current) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    const rect = eyeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = target.x - centerX;
    const dy = target.y - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.hypot(dx, dy) * 0.1, rect.width * 0.16);

    setOffset({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
  }, [eyeRef, target, trackPointer]);

  return (
    <div
      ref={eyeRef}
      className="border-rule relative size-24 overflow-hidden border bg-paper md:size-32"
      aria-hidden
    >
      <div className="border-rule absolute inset-3 rounded-full border bg-paper" />
      <div
        className="bg-brand absolute top-1/2 left-1/2 size-8 rounded-full md:size-10"
        style={{
          transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
          transition: trackPointer ? "transform 80ms ease-out" : undefined,
        }}
      />
    </div>
  );
}

export function NotFoundEyes() {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const target = usePointerTarget(!reducedMotion);

  return (
    <div
      className={cn(
        "border-rule mx-auto mb-8 flex w-fit items-center justify-center gap-4 border bg-paper p-6 md:gap-6 md:p-8",
      )}
      aria-hidden
    >
      <Eye
        eyeRef={leftEyeRef}
        target={target}
        trackPointer={!reducedMotion}
      />
      <Eye
        eyeRef={rightEyeRef}
        target={target}
        trackPointer={!reducedMotion}
      />
    </div>
  );
}
