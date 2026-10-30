// Serves apps/docs/dist like GitHub Pages does: static files only, under PAGES_BASE,
// `dir/` → `dir/index.html`, `dir` → redirect to `dir/`, anything else → 404.html with status 404.
//
//   npm run preview:pages -- --base /design-system/    → http://localhost:4174/design-system/
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'apps/docs/dist');
const argBase = process.argv.indexOf('--base');
const rawBase = argBase > -1 ? process.argv[argBase + 1] : process.env.PAGES_BASE;
const trimmed = (rawBase ?? '/').trim().replace(/^\/+|\/+$/g, '');
const base = trimmed ? `/${trimmed}/` : '/';
const port = Number(process.env.PORT ?? 4174);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(join(root, 'index.html'))) {
  console.error('apps/docs/dist non trovato: esegui prima npm run build:pages');
  process.exit(1);
}

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  const notFound = () => send(res, 404, join(root, '404.html'));
  if (!pathname.startsWith(base)) return notFound();
  let file;
  try {
    file = normalize(join(root, decodeURIComponent(pathname.slice(base.length))));
  } catch {
    return notFound();
  }
  if (file !== root && !file.startsWith(root + sep)) return notFound();
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${pathname}/` });
      return res.end();
    }
    file = join(file, 'index.html');
  }
  if (!existsSync(file) || !statSync(file).isFile()) return notFound();
  send(res, 200, file);
}).listen(port, () => console.log(`GitHub Pages locale: http://localhost:${port}${base}`));
