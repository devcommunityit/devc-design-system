// Builds, validates and packs @dev-community/ui into releases/ with a SHA-256 checksum.
// Does not publish anything: the resulting .tgz can be installed with `npm install <path>`
// or uploaded manually to an internal file share / release page.
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = resolve(repo, 'packages/ui');
const out = resolve(repo, 'releases');
const run = (cmd, cwd = repo) => execSync(cmd, { cwd, stdio: 'inherit' });

run('npm run build -w @dev-community/ui');
run('npm run lint:package', pkgDir);

mkdirSync(out, { recursive: true });
const json = execSync(`npm pack --json --ignore-scripts --pack-destination "${out}"`, { cwd: pkgDir, encoding: 'utf8' });
const [info] = JSON.parse(json);
const tarball = resolve(out, info.filename);
const sha256 = createHash('sha256').update(readFileSync(tarball)).digest('hex');
writeFileSync(`${tarball}.sha256`, `${sha256}  ${info.filename}\n`);

const rel = relative(repo, tarball).replaceAll('\\', '/');
console.log(`
✔ ${info.name}@${info.version}
  file:    ${rel} (${(info.size / 1024).toFixed(1)} KiB, ${info.entryCount} file)
  sha256:  ${sha256}

Installazione in un altro progetto React:
  npm install /percorso/assoluto/${rel}
`);
