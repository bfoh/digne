type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Tailwind conflicts are avoided by design, not merged at runtime. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
