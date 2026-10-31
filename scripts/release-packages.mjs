// Packages that can be released, keyed by the prefix used in git tags (`<key>-v<version>`).
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const PACKAGES = {
  ui: {
    name: '@dev-community/ui',
    dir: 'packages/ui',
    changelog: 'packages/ui/CHANGELOG.md',
    lint: 'npm run lint:package',
  },
  mcp: {
    name: '@dev-community/ui-mcp',
    dir: 'packages/mcp',
    changelog: 'packages/mcp/CHANGELOG.md',
    lint: 'npx publint --strict',
  },
};

export function getPackage(key) {
  const pkg = PACKAGES[key];
  if (!pkg) {
    throw new Error(`Pacchetto sconosciuto "${key}". Valori ammessi: ${Object.keys(PACKAGES).join(', ')}`);
  }
  return { key, ...pkg, path: resolve(repo, pkg.dir) };
}
