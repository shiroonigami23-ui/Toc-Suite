// shared/downloads.js — direct download links for the apps and the study papers.
const REPO = 'shiroonigami23-ui/Toc-Suite';
const SITE = 'https://toc-suite.netlify.app';
export const IS_APP = location.protocol === 'app:' || !!window.Capacitor;
export const IS_ANDROID = !!window.Capacitor;

const FALLBACK = {
  windows: `https://github.com/${REPO}/releases/download/v2.0.0/Toc-Suite-Setup-2.0.0.exe`,
  android: `https://github.com/${REPO}/releases/download/v2.0.0/Toc-Suite-2.0.0.apk`,
  linux: `https://github.com/${REPO}/releases/download/v2.0.0/Toc-Suite-2.0.0.AppImage`,
};
const PICK = {
  windows: (n) => /setup.*\.exe$/i.test(n),
  android: (n) => /\.apk$/i.test(n),
  linux: (n) => /\.appimage$/i.test(n),
};

// <a data-dl="windows|android|linux"> → the file itself, from the newest release
export async function wireAppDownloads(root = document) {
  const links = [...root.querySelectorAll('[data-dl]')];
  links.forEach(a => { a.href = FALLBACK[a.dataset.dl]; a.rel = 'noopener'; });
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) return;
    const assets = (await r.json()).assets || [];
    for (const a of links) {
      const hit = assets.find(x => PICK[a.dataset.dl](x.name));
      if (hit) a.href = hit.browser_download_url;
    }
  } catch { /* offline: keep the built-in links */ }
}

// <a data-paper="01-preliminaries"> → open the PDF (Android hands it to the phone's PDF viewer)
export function wirePapers(root = document, base = '../') {
  root.querySelectorAll('[data-paper]').forEach(a => {
    const file = `docs/papers/${a.dataset.paper}.pdf`;
    a.href = IS_ANDROID ? `${SITE}/${file}` : base + file;
    if (!a.hasAttribute('download')) a.target = '_blank';
    a.rel = 'noopener';
  });
}
