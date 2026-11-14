// shared/remote.js — where the Netlify functions live.
// In the browser and the desktop app (which proxies them) the relative path works; the Android app
// serves the site from https://localhost, so it calls the live site directly.
export const REMOTE_ORIGIN = 'https://toc-suite.netlify.app';

export function isNativeApp() {
    return !!(typeof window !== 'undefined' && window.Capacitor && (window.Capacitor.isNativePlatform?.() ?? true));
}

/** api('/.netlify/functions/save-to-db') → the URL to fetch on this platform */
export function api(path) {
    return isNativeApp() ? REMOTE_ORIGIN + path : path;
}
