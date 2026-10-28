/** Sub-path the site is served from ("" in dev, "/algo-clash" on GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public-folder asset URL with the base path. */
export const asset = (p: string): string => `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`;
