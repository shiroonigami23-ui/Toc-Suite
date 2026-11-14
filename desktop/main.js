// Toc-Suite desktop app (Electron).
// The web app is packaged in ./web and served from a private app:// origin, so ES modules,
// fetch() of the JSON libraries and localStorage all behave exactly as on the website.
// Requests to /.netlify/functions/* (assignments, submissions) are forwarded to the live site.
const { app, BrowserWindow, Menu, net, protocol, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.join(__dirname, 'web');
const REMOTE = 'https://toc-suite.netlify.app';
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.gif': 'image/gif', '.woff2': 'font/woff2',
  '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
};

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
]);

async function serve(request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/.netlify/functions/')) {
    return net.fetch(REMOTE + url.pathname + url.search, {
      method: request.method, headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
    });
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) return new Response('Forbidden', { status: 403 });
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    return new Response(fs.readFileSync(path.join(ROOT, '404.html')), { status: 404, headers: { 'content-type': MIME['.html'] } });
  }
  const res = await net.fetch(pathToFileURL(file).toString());
  return new Response(res.body, { status: 200, headers: { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' } });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 360, minHeight: 560,
    title: 'Toc-Suite', backgroundColor: '#07071a', autoHideMenuBar: true,
    icon: path.join(__dirname, 'web', 'assets', 'icons', 'icon-512.png'),
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  // links to other sites open in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('app://')) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('app://')) { e.preventDefault(); shell.openExternal(url); }
  });
  win.loadURL('app://toc-suite/index.html');
}

app.whenReady().then(() => {
  protocol.handle('app', serve);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'File', submenu: [{ role: 'reload' }, { role: 'forceReload' }, { type: 'separator' }, { role: 'quit' }] },
    { label: 'View', submenu: [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }, { role: 'toggleDevTools' }] },
    { label: 'Help', submenu: [
      { label: 'Website', click: () => shell.openExternal(REMOTE) },
      { label: 'Source code', click: () => shell.openExternal('https://github.com/shiroonigami23-ui/Toc-Suite') },
    ] },
  ]));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
