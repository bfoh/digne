import type { Route } from "next";

/**
 * Checks a literal href against the app's routes — static and dynamic, e.g.
 * "/collections/suits" — and widens it to `Route` for use in typed config.
 */
export const route = <T extends string>(href: Route<T>): Route => href as Route;
