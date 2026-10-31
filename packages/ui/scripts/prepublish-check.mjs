// Guard executed by `prepublishOnly`: blocks accidental publication to the public npm registry
// if the licence is missing or UNLICENSED. Private registries (GitHub Packages, Azure Artifacts,
// Verdaccio, …) are allowed because access is controlled by the registry itself.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Checks the package being published: an explicit path, the one npm is running the lifecycle for, or this one.
const manifestPath = process.argv[2] ? resolve(process.argv[2]) : (process.env.npm_package_json ?? resolve(root, 'package.json'));
const pkg = JSON.parse(readFileSync(manifestPath, 'utf8'));

const registry = (pkg.publishConfig?.registry ?? process.env.npm_config_registry ?? 'https://registry.npmjs.org/').toLowerCase();
const isPublicNpm = /^https?:\/\/registry\.(npmjs\.org|yarnpkg\.com)\/?/.test(registry);
const license = typeof pkg.license === 'string' ? pkg.license.trim() : '';
const licenseUndecided = license === '' || license.toUpperCase() === 'UNLICENSED';

if (isPublicNpm && licenseUndecided) {
  console.error(
    [
      '',
      `✖ Pubblicazione bloccata: ${pkg.name}@${pkg.version} → ${registry}`,
      '  La licenza non è stata scelta (license: "UNLICENSED").',
      '  Prima di pubblicare su un registry pubblico:',
      '    1. scegli una licenza (decisione del titolare del progetto, non automatica);',
      '    2. aggiorna "license" in packages/ui/package.json e aggiungi il file LICENSE;',
      '  Per un registry privato imposta "publishConfig.registry" o usa --registry <url>.',
      '',
    ].join('\n'),
  );
  process.exit(1);
}

console.log(`prepublish-check: ${pkg.name}@${pkg.version} → ${registry} (license: ${license || 'n/d'}) ok`);
