/**
 * paths.js — resolves app files relative to the site root, wherever the app is hosted
 * (Netlify at /, GitHub Pages under /Toc-Suite/, or a local server). Modules live in
 * src/<area>/, so a bare 'data/x.json' would otherwise resolve against the current page.
 */
const ROOT = new URL('../../', import.meta.url);

/** Absolute URL of a file given its path from the repository root, e.g. appUrl('data/libraries/library.json'). */
export const appUrl = (path) => new URL(path, ROOT).href;
