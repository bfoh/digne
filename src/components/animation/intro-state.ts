"use client";

/**
 * Coordinates the brand intro with page intros. The preloader calls
 * `releaseIntro()` as its exit begins; intro animations wait on `onIntro()`.
 * When the preloader is skipped (seen this session, reduced motion, or a
 * client-side navigation), intros run straight away.
 */
type Listener = () => void;

let released = false;
const listeners = new Set<Listener>();

function preloaderWillRun(): boolean {
  const html = document.documentElement;
  return html.dataset.motion === "full" && !("introSeen" in html.dataset);
}

export function releaseIntro() {
  if (released) return;
  released = true;
  for (const fn of listeners) fn();
  listeners.clear();
}

/** Runs `fn` once the intro is released. Returns an unsubscribe. */
export function onIntro(fn: Listener): () => void {
  if (released || !preloaderWillRun()) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
