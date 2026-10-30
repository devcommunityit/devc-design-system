import path from 'node:path';
import type { CSSOptions } from 'vite';

/**
 * Shared CSS Modules configuration (library build, Storybook, docs site, tests).
 * Class names are deterministic and prefixed: `dc-<module>-<local>`.
 */
export function scopedName(local: string, filename: string): string {
  const base = path.basename(filename).replace(/\.module\.css(\?.*)?$/, '');
  const kebab = base.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return `dc-${kebab}-${local}`;
}

export const cssOptions: CSSOptions = {
  transformer: 'postcss',
  modules: {
    generateScopedName: scopedName,
    localsConvention: 'camelCaseOnly',
  },
};
