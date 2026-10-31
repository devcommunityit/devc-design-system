import { type Catalog, type ComponentEntry, exportName } from './catalog.js';
import type { Diagnostic } from './validate.js';

const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n');

export function importLine(component: ComponentEntry): string {
  const values = component.exports.filter((e) => !e.startsWith('type ')).map(exportName);
  const types = component.exports.filter((e) => e.startsWith('type ')).map((e) => `type ${exportName(e)}`);
  return `import { ${[...values, ...types].join(', ')} } from '@dev-community/ui${component.entry ? `/${component.entry}` : ''}';`;
}

export function componentSummaryLine(catalog: Catalog, c: ComponentEntry): string {
  return `- **${c.name}** (\`${c.slug}\`, ${catalog.categories[c.category] ?? c.category}) — exports: ${c.exports.map(exportName).join(', ')}. ${c.summary}`;
}

export function formatComponent(catalog: Catalog, c: ComponentEntry, options: { examples: 'all' | 'none' | string[] }): string {
  const sections: string[] = [
    `# ${c.name}`,
    `Slug: \`${c.slug}\` · Category: ${catalog.categories[c.category] ?? c.category} · Kind: ${c.kind}`,
    '```tsx\n' + importLine(c) + '\n```',
    c.summary,
  ];
  if (c.whenToUse.length) sections.push(`## When to use\n${bullets(c.whenToUse)}`);
  if (c.whenNotToUse.length) sections.push(`## When not to use\n${bullets(c.whenNotToUse)}`);
  if (c.props.length) {
    const rows = c.props.map(
      (p) => `| \`${cell(p.name)}\`${p.required ? ' *' : ''} | \`${cell(p.type)}\` | ${p.default ? `\`${cell(p.default)}\`` : ''} | ${cell(p.description)} |`,
    );
    sections.push(`## Props (${exportName(c.exports[0] ?? c.name)})\n| Prop | Type | Default | Description |\n| --- | --- | --- | --- |\n${rows.join('\n')}${c.props.some((p) => p.required) ? '\n\n\\* required' : ''}`);
  }
  if (c.inherits) sections.push(`**Also accepts:** ${c.inherits}`);
  if (c.keyboard.length) sections.push(`## Keyboard\n${bullets(c.keyboard.map((k) => `\`${k.keys}\`: ${k.action}`))}`);
  if (c.accessibility.length) sections.push(`## Accessibility\n${bullets(c.accessibility)}`);
  if (c.responsive.length) sections.push(`## Responsive\n${bullets(c.responsive)}`);
  if (c.customization.length) sections.push(`## Customization\n${bullets(c.customization)}`);
  if (c.commonMistakes.length) sections.push(`## Common mistakes\n${bullets(c.commonMistakes)}`);
  if (c.status.limits.length) sections.push(`## Known limits\n${bullets(c.status.limits)}`);
  if (c.apg) sections.push(`WAI-ARIA pattern: ${c.apg}`);

  const wanted =
    options.examples === 'all' ? c.examples : options.examples === 'none' ? [] : c.examples.filter((e) => (options.examples as string[]).includes(e.name));
  if (wanted.length) {
    sections.push(
      `## Examples\n${wanted
        .map((e) => `### ${e.title} (\`${e.name}\`)\n${e.description ? `${e.description}\n\n` : ''}\`\`\`tsx\n${e.code}\n\`\`\``)
        .join('\n\n')}`,
    );
  }
  const others = c.examples.filter((e) => !wanted.includes(e));
  if (others.length) sections.push(`Other examples (use get_component_example): ${others.map((e) => `\`${e.name}\` (${e.title})`).join(', ')}`);
  return sections.join('\n\n');
}

export function formatDiagnostics(diagnostics: Diagnostic[]): string {
  if (!diagnostics.length) return 'No problems found. The code uses the design system as documented (static check only; it does not run or type-check the code).';
  const count = (s: string) => diagnostics.filter((d) => d.severity === s).length;
  const header = `${count('error')} error(s), ${count('warning')} warning(s), ${count('info')} suggestion(s).`;
  return `${header}\n\n${diagnostics.map((d) => `- L${d.line}:${d.column} [${d.severity}] ${d.rule}: ${d.message}`).join('\n')}`;
}

export function table(headers: string[], rows: string[][]): string {
  return [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');
}
