const IMPORT_RE = /^import\s+([\s\S]*?)\s+from\s+'([^']+)';$/gm;

function usedIn(code: string, name: string): boolean {
  return new RegExp(`(^|[^\\w$.])${name.replace(/\$/g, '\\$')}(?![\\w$])`).test(code);
}

/**
 * Extracts one exported example function from an examples file, plus only the imports it uses.
 * Shared top-level helpers are listed so the snippet stays copyable.
 */
export function extractExample(source: string, name: string): string {
  const start = source.search(new RegExp(`^export function ${name}\\(`, 'm'));
  if (start < 0) return source.trim();
  const rest = source.slice(start + 1);
  const nextExport = rest.search(/\n(?:export |\/\*\*)/);
  const body = (nextExport < 0 ? source.slice(start) : source.slice(start, start + 1 + nextExport)).trim();

  // Top-level declarations (const/function/interface/type) referenced by the example.
  const helpers: string[] = [];
  const declRe = /^(?:const|function|interface|type)\s+([A-Za-z_$][\w$]*)[\s\S]*?(?=\n(?:export |const |function |interface |type |\/\*\*)|$)/gm;
  const head = source.slice(0, start);
  for (const match of head.matchAll(declRe)) {
    const declName = match[1];
    if (declName && usedIn(body, declName)) helpers.push(match[0].trim());
  }
  // Also include exported helpers (e.g. sample data) used by the example.
  const exportedDeclRe = /^export (const|interface|type) ([A-Za-z_$][\w$]*)[\s\S]*?(?=\n(?:export |const |function |interface |type |\/\*\*)|$)/gm;
  for (const match of source.matchAll(exportedDeclRe)) {
    const declName = match[2];
    if (declName && declName !== name && usedIn(body, declName)) helpers.push(match[0].trim());
  }

  const code = [...helpers, body].join('\n\n');
  const imports: string[] = [];
  for (const match of source.matchAll(IMPORT_RE)) {
    const clause = match[1] ?? '';
    const from = match[2] ?? '';
    const named = clause.match(/\{([\s\S]*)\}/);
    if (!named) {
      if (usedIn(code, clause.trim())) imports.push(`import ${clause.trim()} from '${from}';`);
      continue;
    }
    const kept = (named[1] ?? '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => usedIn(code, part.replace(/^type\s+/, '').split(/\s+as\s+/).pop() ?? part));
    if (kept.length > 0) imports.push(`import { ${kept.join(', ')} } from '${from}';`);
  }
  return `${imports.join('\n')}\n\n${code}\n`;
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}