#!/usr/bin/env node
/**
 * Release helpers used by .github/workflows/release.yml (also runnable locally).
 *
 *   node scripts/release.mjs bump  <ui|mcp> <patch|minor|major|prepatch|preminor|premajor|prerelease> [preid]
 *        Updates package.json, package-lock.json and the "Non rilasciato" section of the CHANGELOG.
 *        Prints the new tag (e.g. ui-v0.2.0). Does not commit or tag.
 *   node scripts/release.mjs plan  <tag>
 *        Validates a tag such as ui-v0.2.0 / mcp-v0.2.0-next.0 against package.json.
 *   node scripts/release.mjs notes <ui|mcp> <version> <out-file>
 *        Writes release notes: installation instructions + the CHANGELOG section for the version.
 *
 * When GITHUB_OUTPUT is set, results are also appended there as step outputs.
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getPackage, PACKAGES, repo } from './release-packages.mjs';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
const UNRELEASED = /^## \[(Non rilasciato|Unreleased)\][^\n]*$/im;
const REGISTRY = 'https://npm.pkg.github.com/';

function output(values) {
  for (const [k, v] of Object.entries(values)) console.log(`${k}=${v}`);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(values).map(([k, v]) => `${k}=${v}\n`).join(''));
  }
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function increment(version, type, preid = 'next') {
  const m = SEMVER.exec(version);
  if (!m) throw new Error(`Versione non semver: ${version}`);
  const [maj, min, pat] = m.slice(1, 4).map(Number);
  const pre = m[4];
  switch (type) {
    case 'major':
      return pre && min === 0 && pat === 0 ? `${maj}.0.0` : `${maj + 1}.0.0`;
    case 'minor':
      return pre && pat === 0 ? `${maj}.${min}.0` : `${maj}.${min + 1}.0`;
    case 'patch':
      return pre ? `${maj}.${min}.${pat}` : `${maj}.${min}.${pat + 1}`;
    case 'premajor':
      return `${maj + 1}.0.0-${preid}.0`;
    case 'preminor':
      return `${maj}.${min + 1}.0-${preid}.0`;
    case 'prepatch':
      return `${maj}.${min}.${pat + 1}-${preid}.0`;
    case 'prerelease': {
      if (!pre) return `${maj}.${min}.${pat + 1}-${preid}.0`;
      const parts = pre.split('.');
      const last = parts.at(-1);
      if (parts[0] === preid && parts.length > 1 && /^\d+$/.test(last)) {
        parts[parts.length - 1] = String(Number(last) + 1);
        return `${maj}.${min}.${pat}-${parts.join('.')}`;
      }
      return `${maj}.${min}.${pat}-${preid}.0`;
    }
    default:
      throw new Error(`Tipo di incremento non valido: ${type}`);
  }
}

/** npm dist-tag: "latest" for stable versions, the prerelease identifier (e.g. "next", "beta") otherwise. */
export function distTag(version) {
  const pre = SEMVER.exec(version)?.[4];
  if (!pre) return 'latest';
  const id = pre.split('.')[0];
  return /^\d+$/.test(id) ? 'next' : id;
}

function bump(key, type, preid) {
  const pkg = getPackage(key);
  const manifestPath = resolve(pkg.path, 'package.json');
  const manifest = readJson(manifestPath);
  const version = increment(manifest.version, type, preid || 'next');
  manifest.version = version;
  writeJson(manifestPath, manifest);

  const lockPath = resolve(repo, 'package-lock.json');
  if (existsSync(lockPath)) {
    const lock = readJson(lockPath);
    if (lock.packages?.[pkg.dir]) {
      lock.packages[pkg.dir].version = version;
      writeJson(lockPath, lock);
    }
  }

  const changelogPath = resolve(repo, pkg.changelog);
  if (existsSync(changelogPath) && !SEMVER.exec(version)[4]) {
    const text = readFileSync(changelogPath, 'utf8');
    if (UNRELEASED.test(text)) {
      const date = new Date().toISOString().slice(0, 10);
      writeFileSync(changelogPath, text.replace(UNRELEASED, `## [Non rilasciato]\n\n## [${version}] — ${date}`));
    }
  }

  output({ tag: `${key}-v${version}`, version });
}

export function parseTag(tag) {
  const m = /^([a-z]+)-v(.+)$/.exec(tag);
  if (!m || !PACKAGES[m[1]] || !SEMVER.test(m[2])) {
    throw new Error(`Tag non valido "${tag}". Formato atteso: <${Object.keys(PACKAGES).join('|')}>-v<semver>, per esempio ui-v0.2.0`);
  }
  return { key: m[1], version: m[2] };
}

function plan(tag) {
  const { key, version } = parseTag(tag);
  const pkg = getPackage(key);
  const manifest = readJson(resolve(pkg.path, 'package.json'));
  if (manifest.version !== version) {
    throw new Error(`Il tag ${tag} indica ${version}, ma ${pkg.dir}/package.json ha "version": "${manifest.version}". Aggiorna la versione prima di creare il tag.`);
  }
  if (manifest.name !== pkg.name) throw new Error(`Nome inatteso in ${pkg.dir}/package.json: ${manifest.name}`);
  const tagName = distTag(version);
  output({
    key,
    name: pkg.name,
    dir: pkg.dir,
    version,
    dist_tag: tagName,
    prerelease: String(tagName !== 'latest'),
  });
}

export function changelogSection(text, version) {
  const lines = text.split(/\r?\n/);
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = lines.findIndex((l) => new RegExp(`^## \\[${escaped}\\]`).test(l));
  if (start < 0) return '';
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^## /.test(l));
  return (end < 0 ? rest : rest.slice(0, end)).join('\n').trim();
}

function notes(key, version, outFile) {
  const pkg = getPackage(key);
  const changelogPath = resolve(repo, pkg.changelog);
  const section = existsSync(changelogPath) ? changelogSection(readFileSync(changelogPath, 'utf8'), version) : '';
  const file = `${pkg.name.replace('@', '').replace('/', '-')}-${version}.tgz`;
  const install =
    key === 'mcp'
      ? [
          '```json',
          '{ "servers": { "dev-community-ui": { "command": "npx", "args": ["-y", "-p", "' + `${pkg.name}@${version}` + '", "dc-ui-mcp"] } } }',
          '```',
        ]
      : ['```bash', `npm install ${pkg.name}@${version}`, '```'];
  const body = [
    '## Installazione',
    '',
    `Da GitHub Packages, con un \`.npmrc\` nel progetto (token con permesso \`read:packages\`):`,
    '',
    '```ini',
    `@devcommunityit:registry=${REGISTRY}`,
    '//npm.pkg.github.com/:_authToken=${NPM_TOKEN}',
    '```',
    '',
    ...install,
    '',
    `Senza registry: scarica \`${file}\` dagli asset di questa release (verifica il checksum \`.sha256\`) e installa con \`npm install ./${file}\`.`,
    '',
    '## Novità',
    '',
    section || `Nessuna sezione \`## [${version}]\` in \`${pkg.changelog}\`: vedi le modifiche elencate sotto.`,
    '',
  ].join('\n');
  writeFileSync(resolve(outFile), body);
  output({ notes_file: outFile, has_changelog: String(Boolean(section)) });
}

const [command, ...args] = process.argv.slice(2);
const isMain = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  try {
    if (command === 'bump') bump(args[0], args[1], args[2]);
    else if (command === 'plan') plan(args[0]);
    else if (command === 'notes') notes(args[0], args[1], args[2]);
    else throw new Error('Uso: node scripts/release.mjs <bump|plan|notes> …');
  } catch (error) {
    console.error(`✖ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
