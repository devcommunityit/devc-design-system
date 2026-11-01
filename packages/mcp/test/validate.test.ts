import { describe, expect, it } from 'vitest';
import { loadCatalog } from '../src/catalog.js';
import { validateUsage } from '../src/validate.js';

const catalog = loadCatalog();
const rules = (code: string, filename?: string) => validateUsage(catalog, code, filename).map((d) => `${d.severity}:${d.rule}`);

describe('validateUsage', () => {
  it('accepts every documented example and page template without errors or warnings', () => {
    const sources = [
      ...catalog.components.flatMap((c) => c.examples.map((e) => ({ id: `${c.slug}/${e.name}`, code: e.code }))),
      ...catalog.pages.map((p) => ({ id: `page:${p.slug}`, code: p.code })),
    ];
    const problems = sources.flatMap(({ id, code }) =>
      validateUsage(catalog, code, 'example.tsx')
        .filter((d) => d.severity !== 'info' && d.rule !== 'hardcoded-color')
        .map((d) => `${id} L${d.line}: ${d.rule} ${d.message}`),
    );
    expect(problems).toEqual([]);
  });

  it('reports unknown exports and deep imports with suggestions', () => {
    const diagnostics = validateUsage(
      catalog,
      `import { Buton, Stack } from '@dev-community/ui';\nimport x from '@dev-community/ui/dist/index.js';`,
    );
    expect(diagnostics.find((d) => d.rule === 'unknown-export')?.message).toContain('Did you mean Button');
    expect(diagnostics.filter((d) => d.rule === 'invalid-import')).toHaveLength(1);
    expect(diagnostics.find((d) => d.rule === 'invalid-import')?.line).toBe(2);
  });

  it.each(['@dev-community/ui', '@dev-community/ui/patterns'])('accepts shared export names from %s', (entry) => {
    expect(validateUsage(catalog, `import type { RaffleEntry, VolunteerShift } from '${entry}';`)).toEqual([]);
  });

  it('accepts EmailPreview only from the editor entry point', () => {
    expect(validateUsage(catalog, `import { EmailPreview, type EmailPreviewProps } from '@dev-community/ui/editor';`)).toEqual([]);
    const diagnostics = validateUsage(catalog, `import { EmailPreview, type EmailPreviewProps } from '@dev-community/ui';`);
    expect(diagnostics).toHaveLength(2);
    for (const diagnostic of diagnostics) {
      expect(diagnostic.rule).toBe('invalid-import');
      expect(diagnostic.message).toContain('@dev-community/ui/editor');
    }
  });

  it('checks props of design system components', () => {
    const code = `import { Button } from '@dev-community/ui';
export const A = () => <Button variant="tertiary" size="md" onClick={() => {}}>Ok</Button>;`;
    expect(rules(code)).toEqual(expect.arrayContaining(['error:invalid-prop-value', 'warning:prefer-onpress']));
    expect(rules(code)).not.toContain('warning:unknown-prop');
  });

  it('respects aliased imports', () => {
    const code = `import { Button as DsButton } from '@dev-community/ui';
export const A = () => <DsButton variant="nope">Ok</DsButton>;`;
    expect(rules(code)).toContain('error:invalid-prop-value');
  });

  it('flags unknown tokens and hard-coded values with token hints', () => {
    const code = `export const A = () => (
  <div style={{ color: '#ff0000', padding: 16, background: 'var(--dc-color-surface-raisd)' }}>
    <a href="#abc">link</a>
  </div>
);`;
    const diagnostics = validateUsage(catalog, code);
    expect(diagnostics.find((d) => d.rule === 'unknown-token')?.message).toContain('--dc-color-surface-raised');
    expect(diagnostics.find((d) => d.rule === 'hardcoded-color')?.message).toContain('var(--dc-color-');
    expect(diagnostics.find((d) => d.rule === 'hardcoded-spacing')?.message).toContain('--dc-space-4');
    expect(diagnostics.filter((d) => d.rule === 'hardcoded-color')).toHaveLength(1);
  });

  it('suggests design system components for native elements', () => {
    expect(rules('export const A = () => <button onClick={() => {}}>x</button>;')).toContain('info:prefer-component');
  });

  it('reminds to import styles.css with ThemeProvider', () => {
    expect(rules(`import { ThemeProvider } from '@dev-community/ui';`)).toContain('info:missing-styles');
    expect(rules(`import '@dev-community/ui/styles.css';\nimport { ThemeProvider } from '@dev-community/ui';`)).not.toContain('info:missing-styles');
  });

  it('checks CSS sources', () => {
    const css = `.card {\n  color: #333;\n  padding: 12px 8px;\n  /* border: 1px solid #000; */\n  background: var(--dc-color-nope);\n}`;
    const diagnostics = validateUsage(catalog, css, 'card.css');
    expect(diagnostics.map((d) => `${d.line}:${d.rule}`)).toEqual(['5:unknown-token', '2:hardcoded-color', '3:hardcoded-spacing']);
  });

  it('returns nothing for clean code', () => {
    const code = `import '@dev-community/ui/styles.css';
import { Button, Stack, ThemeProvider } from '@dev-community/ui';
export const App = () => (
  <ThemeProvider>
    <Stack gap={4} style={{ color: 'var(--dc-color-text-primary)' }}>
      <Button variant="secondary" onPress={() => {}}>Salva</Button>
    </Stack>
  </ThemeProvider>
);`;
    expect(validateUsage(catalog, code)).toEqual([]);
  });
});
