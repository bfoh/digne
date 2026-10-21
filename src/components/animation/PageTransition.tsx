import { ViewTransition, type ReactNode } from "react";

/**
 * PageTransition — wraps each page's content (not the layout, which persists).
 * The outgoing view lifts away quickly; the incoming view rises in from a
 * shallow mask. Uses the browser's View Transitions API through React, so
 * history, focus and scroll behave natively; unsupported browsers simply
 * navigate without animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
