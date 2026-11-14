// Copies the deployable web app (no tests, tools, docs or server code) into a folder, for the
// desktop (Electron), Android (Capacitor) and container builds.  node tools/stage-web.mjs <dir> [--app]
// --app adds the animated launch intro (src/app/app_intro.js) — used for the APK and EXE only.
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const out = process.argv[2];
const forApp = process.argv.includes('--app');
if (!out) { console.error('usage: node tools/stage-web.mjs <output-dir>'); process.exit(1); }
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const ENTRIES = ['index.html', '404.html', 'manifest.json', 'service-worker.js', 'pages', 'src', 'assets', 'data'];
for (const e of ENTRIES) if (existsSync(join(root, e))) cpSync(join(root, e), join(out, e), { recursive: true });
if (forApp) {
  const idx = join(out, 'index.html');
  const html = readFileSync(idx, 'utf8').replace(/<body([^>]*)>/, '<body$1>\n  <script src="src/app/app_intro.js"></script>');
  writeFileSync(idx, html);
}
console.log(`staged ${ENTRIES.length} entries into ${out}${forApp ? ' (with app intro)' : ''}`);
