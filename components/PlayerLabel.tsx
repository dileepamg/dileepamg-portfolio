"use client";

import { createContext } from "react";

/**
 * The name of the video a player belongs to.
 *
 * next-video renders its theme with only a style and a data attribute, so a
 * per-video name cannot travel down as a prop. It travels as context instead:
 * the theme reads it and names its player after the video, so four players on
 * one page are four distinct regions to a screen reader rather than four
 * identical ones.
 */
export const PlayerLabelContext = createContext<string | undefined>(undefined);

export function PlayerLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <PlayerLabelContext.Provider value={label}>
      {children}
    </PlayerLabelContext.Provider>
  );
}
