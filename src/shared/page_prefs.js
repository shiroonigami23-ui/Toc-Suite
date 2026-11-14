// shared/page_prefs.js — apply the saved theme, text size and motion preference on the stand-alone
// pages (Help, Settings, Grammar Studio) exactly as the studios do.
const get = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
export const THEME_COLORS = { default: '#667eea', ocean: '#0284c7', forest: '#15803d', sunset: '#ea580c' };

export function applyPrefs() {
  const theme = THEME_COLORS[get('tocTheme', 'default')] ? get('tocTheme', 'default') : 'default';
  document.body.setAttribute('data-theme', theme);
  const scale = get('tocFontScale', 'normal');
  document.documentElement.setAttribute('data-font-scale', ['normal', 'large', 'xlarge'].includes(scale) ? scale : 'normal');
  document.body.setAttribute('data-motion', get('tocMotion', 'normal') === 'reduced' ? 'reduced' : 'normal');
}
