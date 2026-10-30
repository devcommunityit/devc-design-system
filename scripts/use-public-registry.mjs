// CI only: the committed package-lock.json resolves tarballs through the private feed used on the
// development machine. GitHub-hosted runners cannot authenticate to it, so this rewrites every
// `resolved` URL of the form `https://<host>/.../npm/registry/<pkg>/-/<file>.tgz` to the public npm
// registry (same packages, same `integrity` hashes, which npm still verifies). Do not commit the result.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const lockPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package-lock.json');
const before = readFileSync(lockPath, 'utf8');
let count = 0;
const after = before.replace(/"resolved": "https:\/\/[^"]+?\/npm\/registry\/([^"]+)"/g, (_match, rest) => {
  count += 1;
  return `"resolved": "https://registry.npmjs.org/${rest}"`;
});
writeFileSync(lockPath, after);
console.log(`package-lock.json: ${count} URL riscritti verso https://registry.npmjs.org/`);
