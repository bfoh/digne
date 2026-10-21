/**
 * ScrollProgressIndicator — a single gold hairline across the top of the
 * viewport. Driven entirely by CSS scroll-driven animations (no JS); hidden
 * where unsupported.
 */
export function ScrollProgress() {
  return <div aria-hidden="true" className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-gold" />;
}
