#!/usr/bin/env node
/**
 * Verifies the *packed* library in a consumer that lives outside the repository, so nothing can
 * resolve from the workspace sources or the root node_modules.
 *
 *   1. build @dev-community/ui (skip with --skip-build)
 *   2. npm pack into a temporary directory
 *   3. copy apps/playground there, point it at the tarball, npm install
 *   4. static checks on the installed package (exports, specifiers, single React, no workspace paths)
 *   5. Node import of the server-safe entry without a DOM
 *   6. consumer type-check + production build
 *   7. browser checks with Playwright on `vite preview` (render, styles, interactions, portals, console)
 *
 * Usage: node scripts/verify-package.mjs [--skip-build] [--keep]
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const isWin = process.platform === 'win32';
const results = [];
let failed = false;

async function step(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true });
    console.log(`✔ ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (error) {
    failed = true;
    results.push({ name, ok: false });
    console.error(`✘ ${name}\n  ${error instanceof Error ? error.message : String(error)}`);
  }
}

function run(cmd, cmdArgs, cwd) {
  // npm is a .cmd shim on Windows and needs a shell; arguments are internal constants, quoted when needed.
  const line = [cmd, ...cmdArgs.map((a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a))].join(' ');
  const res = isWin
    ? spawnSync(line, { cwd, encoding: 'utf8', shell: true, maxBuffer: 64 * 1024 * 1024 })
    : spawnSync(cmd, cmdArgs, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.status !== 0) {
    throw new Error(`${cmd} ${cmdArgs.join(' ')} failed (exit ${res.status}):\n${(res.stdout ?? '').slice(-3000)}\n${(res.stderr ?? '').slice(-3000)}`);
  }
  return res.stdout ?? '';
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function isFocusedSoon(locator, timeout = 2000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await locator.evaluate((el) => el === document.activeElement)) return true;
    await new Promise((r) => setTimeout(r, 50));
  }
  return false;
}

const work = mkdtempSync(join(tmpdir(), 'dc-verify-'));
const consumer = join(work, 'consumer');
const pkgDir = join(consumer, 'node_modules', '@dev-community', 'ui');
console.log(`Cartella di lavoro: ${work}`);

if (!args.has('--skip-build')) {
  await step('Build della libreria', () => {
    run('npm', ['run', 'build', '-w', '@dev-community/ui'], root);
  });
}

let tarball = '';
await step('npm pack', () => {
  const out = run('npm', ['pack', '-w', '@dev-community/ui', '--pack-destination', work, '--json'], root);
  const info = JSON.parse(out.slice(out.indexOf('[')));
  tarball = join(work, info[0].filename);
  const files = info[0].files.map((f) => f.path);
  const outside = files.filter((f) => !f.startsWith('dist/') && !['package.json', 'README.md', 'CHANGELOG.md'].includes(f));
  assert(outside.length === 0, `unexpected files in tarball: ${outside.join(', ')}`);
  const leaked = files.filter((f) => /\.(test|examples|meta)\.|stories/.test(f));
  assert(leaked.length === 0, `test/docs files in tarball: ${leaked.slice(0, 5).join(', ')}`);
  return `${info[0].filename}, ${files.length} file, ${(info[0].size / 1024).toFixed(0)} kB`;
});
if (!tarball) process.exit(1);

await step('Consumer separato fuori dal repository: npm install dal tarball', () => {
  const src = join(root, 'apps', 'playground');
  for (const entry of ['index.html', 'tsconfig.json', 'vite.config.ts', 'src']) cpSync(join(src, entry), join(consumer, entry), { recursive: true });
  const pkg = JSON.parse(readFileSync(join(src, 'package.json'), 'utf8'));
  pkg.dependencies['@dev-community/ui'] = `file:${relative(consumer, tarball).split(sep).join('/')}`;
  writeFileSync(join(consumer, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
  run('npm', ['install', '--no-audit', '--no-fund'], consumer);
  assert(existsSync(join(pkgDir, 'dist', 'index.js')), 'package not installed');
  assert(!lstatSync(pkgDir).isSymbolicLink(), '@dev-community/ui is a symlink, not an installed copy');
  return relative(work, pkgDir);
});

await step('Export dichiarati presenti; React solo peer dependency', () => {
  const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
  let count = 0;
  for (const [key, value] of Object.entries(pkg.exports)) {
    for (const p of typeof value === 'string' ? [value] : Object.values(value)) {
      assert(existsSync(join(pkgDir, p)), `export "${key}" → ${p} missing`);
      count++;
    }
  }
  for (const name of ['react', 'react-dom']) {
    assert(pkg.peerDependencies?.[name] && !pkg.dependencies?.[name], `${name} must be a peer dependency only`);
  }
  return `${Object.keys(pkg.exports).length} export, ${count} file`;
});

await step('Specificatori di import risolvibili, nessun percorso del workspace', () => {
  const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
  const allowed = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]);
  const dist = join(pkgDir, 'dist');
  const repoPath = root.split(sep).join('/').toLowerCase();
  const problems = [];
  let checked = 0;
  for (const file of walk(dist)) {
    const text = readFileSync(file, 'utf8');
    if (text.split('\\').join('/').toLowerCase().includes(repoPath)) problems.push(`${relative(dist, file)} contains the repository path`);
    if (!/\.(js|d\.ts)$/.test(file)) continue;
    checked++;
    const specifiers = /^\s*(?:import|export)\b[^'"`;]*?\bfrom\s*["']([^"'\n]+)["']|^\s*import\s*["']([^"'\n]+)["']|\bimport\(\s*["']([^"'\n]+)["']\s*\)/gm;
    for (const m of text.matchAll(specifiers)) {
      const spec = m[1] ?? m[2] ?? m[3];
      if (spec.startsWith('.')) {
        const target = resolve(dirname(file), spec);
        if (!target.startsWith(dist)) problems.push(`${relative(dist, file)} imports outside dist: ${spec}`);
        else if (file.endsWith('.js') && !existsSync(target)) problems.push(`${relative(dist, file)}: unresolved ${spec}`);
      } else {
        const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        if (!allowed.has(name)) problems.push(`${relative(dist, file)} imports undeclared "${spec}"`);
      }
    }
  }
  assert(problems.length === 0, problems.slice(0, 15).join('\n  '));
  return `${checked} moduli controllati`;
});

await step('Una sola copia di React e React DOM', () => {
  const manifests = walk(join(consumer, 'node_modules')).filter((f) => /[\\/]node_modules[\\/]react(-dom)?[\\/]package\.json$/.test(f));
  const react = manifests.filter((f) => /[\\/]react[\\/]package\.json$/.test(f));
  const reactDom = manifests.filter((f) => /[\\/]react-dom[\\/]package\.json$/.test(f));
  assert(react.length === 1 && reactDom.length === 1, `found: ${manifests.map((f) => relative(consumer, f)).join(', ')}`);
  return `react@${JSON.parse(readFileSync(react[0], 'utf8')).version}`;
});

await step('Import Node dell’entry server-safe (senza DOM)', () => {
  const script = `
import * as t from '@dev-community/ui/theme';
if (typeof window !== 'undefined' || typeof document !== 'undefined') throw new Error('DOM present');
const theme = t.createTheme({ name: 'acme', extends: 'graphite', seeds: { brand: '#0f766e' } });
if (!t.themeToCss(theme).includes('--dc-color-action-primary')) throw new Error('themeToCss output missing variables');
const bad = t.parseThemeJson('{"schemaVersion":99,"name":"x"}');
if (bad.success) throw new Error('unsupported schema accepted');
const evil = t.parseThemeJson('{"schemaVersion":1,"name":"x","colors":{"light":{"text.primary":"red;}body{display:none"}}}');
if (evil.success) throw new Error('CSS injection accepted');
console.log(Object.keys(t).length);
`;
  writeFileSync(join(consumer, 'server-check.mjs'), script);
  const out = execFileSync(process.execPath, ['server-check.mjs'], { cwd: consumer, encoding: 'utf8' });
  return `${out.trim()} export, JSON non valido rifiutato`;
});

await step('Type-check (strict) e build di produzione del consumer', () => {
  run('npm', ['run', 'build'], consumer);
  const assets = join(consumer, 'dist', 'assets');
  const read = (ext) => readdirSync(assets).filter((f) => f.endsWith(ext)).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');
  const js = read('.js');
  assert(read('.css').includes('--dc-color-text-primary'), 'library styles not bundled');
  for (const unused of ['dc-data-table', 'dc-calendar', 'dc-color-picker', 'dc-file-upload']) {
    assert(!js.includes(unused), `tree-shaking: unused module "${unused}" in bundle`);
  }
  return 'tsc ok, vite build ok, moduli non usati esclusi';
});

await step('Browser: rendering, stili, interazioni, persistenza, portal, console', async () => {
  const { preview } = await import(pathToFileURL(join(consumer, 'node_modules', 'vite', 'dist', 'node', 'index.js')).href);
  const { chromium } = await import('@playwright/test');
  const server = await preview({ root: consumer, logLevel: 'silent', preview: { port: 4174 } });
  const url = server.resolvedUrls?.local[0];
  assert(url, 'preview server did not start');
  const browser = await chromium.launch();
  const errors = [];
  try {
    const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await context.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') errors.push(`${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    await page.goto(url);
    await page.getByRole('heading', { level: 1, name: 'Consumer del pacchetto compilato' }).waitFor();

    const token = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--dc-color-text-primary').trim());
    assert(token !== '', 'tokens not applied on the document');
    const increment = page.getByRole('button', { name: 'Incrementa' });
    const bg = await increment.evaluate((el) => getComputedStyle(el).backgroundColor);
    assert(bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent', 'button styles not loaded');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(overflow <= 0, `horizontal overflow at 375px: ${overflow}px`);

    await increment.click();
    await page.keyboard.press('Enter');
    assert((await page.getByTestId('counter').textContent())?.includes('2'), 'click + Enter did not increment twice');

    await page.locator('label', { hasText: 'Scuro' }).click();
    assert((await page.locator('html').getAttribute('data-dc-resolved-scheme')) === 'dark', 'applyToDocument did not set the dark scheme');
    const stored = await page.evaluate(() => localStorage.getItem('dc-playground'));
    assert(stored?.includes('dark'), `persistence not written: ${stored}`);
    await page.reload();
    await page.getByRole('heading', { level: 1 }).waitFor();
    assert(await page.getByRole('radio', { name: 'Scuro' }).isChecked(), 'persisted mode not restored');
    await page.locator('label', { hasText: 'Chiaro' }).click();

    await page.getByRole('button', { name: 'Mostra notifica' }).click();
    await page.getByRole('status').filter({ hasText: 'Preferenze salvate' }).waitFor({ state: 'attached' });

    const login = page.getByTestId('login-card');
    const email = login.getByRole('textbox', { name: /email/i });
    await login.getByRole('button', { name: 'Accedi' }).click();
    assert((await email.getAttribute('aria-invalid')) === 'true', 'empty submit did not mark the email invalid');
    await email.fill('giulia@acme.example');
    await login.getByLabel(/^password/i).fill('una-password-lunga');
    await login.getByRole('button', { name: 'Accedi' }).click();
    await page.getByText('Accesso simulato').waitFor();

    const trigger = page.getByRole('button', { name: /Giulia Bianchi/ });
    await trigger.click();
    await page.getByRole('menuitem', { name: 'Impostazioni' }).click();
    assert((await page.getByTestId('last-action').textContent())?.includes('settings'), 'menu action not reported');
    // Focus returns once the popover's exit transition ends: poll instead of reading it once.
    await page.getByRole('menu').waitFor({ state: 'detached' });
    assert(await isFocusedSoon(trigger), 'focus not restored to the menu trigger');

    const opener = page.getByRole('button', { name: 'Apri dialogo annidato' });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Dialogo nel tema Acme' });
    await dialog.waitFor();
    const portal = await dialog.evaluate((el) => {
      const host = el.closest('[data-dc-portal]');
      return host ? { palette: host.getAttribute('data-dc-palette'), scheme: host.getAttribute('data-dc-resolved-scheme') } : null;
    });
    assert(portal?.palette === 'acme' && portal.scheme === 'dark', `portal theme not inherited: ${JSON.stringify(portal)}`);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert(await isFocusedSoon(opener), 'focus not restored after closing the dialog');

    await trigger.click();
    await page.getByRole('menuitem', { name: 'Esci' }).click();
    await page.getByText('Ospite').waitFor();

    assert(errors.length === 0, `console:\n  ${errors.join('\n  ')}`);
    return 'token, stili, click/Enter, persistenza, toast, validazione form, menu utente, dialog annidato, ripristino focus';
  } finally {
    await browser.close();
    await new Promise((r) => server.httpServer.close(r));
  }
});

console.log('\nRiepilogo');
for (const r of results) console.log(`${r.ok ? '✔' : '✘'} ${r.name}`);
if (args.has('--keep') || failed) console.log(`\nCartella conservata: ${work}`);
else {
  try {
    rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (error) {
    // On Windows, files can stay locked briefly after child processes exit: the check result still holds.
    console.warn(`\nImpossibile rimuovere ${work}: ${error.code ?? error.message}. Rimuoverla manualmente.`);
  }
}
process.exit(failed ? 1 : 0);
