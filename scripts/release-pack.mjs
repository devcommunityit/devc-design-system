// Builds, validates and packs a workspace package with a SHA-256 checksum. Publishes nothing:
// the resulting .tgz can be installed with `npm install <path>`, attached to a GitHub Release
// (see .github/workflows/release.yml) or uploaded to an internal file share.
//
// Usage: node scripts/release-pack.mjs [--package ui|mcp] [--skip-build] [--out <dir>]
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { getPackage, repo } from './release-packages.mjs';

const { values } = parseArgs({
  options: {
    package: { type: 'string', default: 'ui' },
    'skip-build': { type: 'boolean', default: false },
    out: { type: 'string', default: 'releases' },
  },
});

const pkg = getPackage(values.package);
const out = resolve(repo, values.out);
const run = (cmd, cwd = repo) => execSync(cmd, { cwd, stdio: 'inherit' });

if (!values['skip-build']) run(`npm run build -w ${pkg.name}`);
run(pkg.lint, pkg.path);

mkdirSync(out, { recursive: true });
const json = execSync(`npm pack --json --ignore-scripts --pack-destination "${out}"`, { cwd: pkg.path, encoding: 'utf8' });
const [info] = JSON.parse(json);
const tarball = resolve(out, info.filename);
const sha256 = createHash('sha256').update(readFileSync(tarball)).digest('hex');
writeFileSync(`${tarball}.sha256`, `${sha256}  ${info.filename}\n`);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `tarball=${tarball}\nfilename=${info.filename}\nsha256=${sha256}\n`);
}

const rel = relative(repo, tarball).replaceAll('\\', '/');
console.log(`
✔ ${info.name}@${info.version}
  file:    ${rel} (${(info.size / 1024).toFixed(1)} KiB, ${info.entryCount} file)
  sha256:  ${sha256}

Installazione in un altro progetto:
  npm install /percorso/assoluto/${rel}
`);
