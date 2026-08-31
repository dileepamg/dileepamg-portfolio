"use client";

import { VisualEditing } from "next-sanity/visual-editing";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getSnapshot = () => window.self !== window.top;

/**
 * Draft mode uses a same-origin cookie, so it remains enabled when the site is
 * opened in a normal tab. Only mount the editing overlay inside Sanity
 * Presentation's iframe; draft content can still be viewed without the overlay.
 */
export function StudioVisualEditing() {
  const isEmbeddedPreview = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return isEmbeddedPreview ? <VisualEditing /> : null;
}
