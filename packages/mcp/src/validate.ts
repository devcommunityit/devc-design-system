import ts from 'typescript';
import { type Catalog, type ComponentEntry, componentForExport, exportName, suggest } from './catalog.js';
import { lengthToPx, nearestColors, nearestLengths, parseColor } from './tokens.js';

export type Severity = 'error' | 'warning' | 'info';

export interface Diagnostic {
  severity: Severity;
  rule: string;
  message: string;
  line: number;
  column: number;
}

const PACKAGE = '@devcommunityit/ui';
const ALLOWED_SUBPATHS = new Set(['styles.css', 'reset.css', 'tokens.css', 'tokens.json', 'theme', 'editor', 'patterns', 'widgets', 'package.json']);
// Subpath entries that export components (their exports are tracked in the catalog with `entry`).
const COMPONENT_SUBPATHS = new Set(['editor', 'patterns', 'widgets']);
const COLOR_RE = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z_-])|\b(?:rgba?|hsla?)\([^)]*\)/gi;
const VAR_REF_RE = /var\(\s*(--dc-[a-z0-9-]+)/g;
const ALWAYS_ALLOWED_PROPS = new Set(['key', 'ref', 'children', 'className', 'style', 'id', 'slot', 'role', 'title', 'lang', 'dir', 'hidden', 'tabIndex']);
const STYLE_ATTRS = new Set(['style', 'color', 'fill', 'stroke', 'background', 'backgroundColor', 'stopColor']);
const SPACING_PROPS = /^(margin|padding)(Top|Right|Bottom|Left|Block|Inline|BlockStart|BlockEnd|InlineStart|InlineEnd)?$|^(gap|rowGap|columnGap)$/;
const NATIVE_ALTERNATIVES: Record<string, string[]> = {
  button: ['Button', 'IconButton'],
  input: ['TextField', 'Checkbox', 'Switch', 'SearchField', 'NumberField'],
  select: ['Select', 'ComboBox'],
  textarea: ['Textarea', 'TextArea'],
  table: ['Table', 'DataTable'],
  dialog: ['Dialog', 'AlertDialog'],
  progress: ['ProgressBar', 'Progress'],
  h1: ['Heading'],
  h2: ['Heading'],
  h3: ['Heading'],
  h4: ['Heading'],
  h5: ['Heading'],
  h6: ['Heading'],
};

function isCssSource(code: string, filename?: string): boolean {
  if (filename) return /\.(css|scss|less)$/i.test(filename);
  return !/\b(import|export|const|let|function|return)\b|=>/.test(code) && /[^{}]+\{[^}]*:[^}]*\}/.test(code);
}

interface ParsedProp {
  names: string[];
  type: string;
  required: boolean;
  raw: string;
}

/**
 * Props documented for the main export. Doc names can target sub-exports
 * ("CardHeader.title / subtitle", "Header: brand, navigation"); those are excluded.
 */
function mainProps(component: ComponentEntry, main: string): ParsedProp[] {
  return component.props.flatMap((p) => {
    // Methods/hooks documented alongside props (e.g. "show(options)") are not JSX props.
    if (p.name.includes('(')) return [];
    let rest = p.name;
    const owned = p.name.match(/^([A-Z]\w*(?:\/[A-Z]\w*)*)\s*(?:\.|:\s|\s)\s*(.+)$/);
    if (owned) {
      if (!owned[1]!.split('/').includes(main)) return [];
      rest = owned[2]!;
    }
    const names = rest.match(/[A-Za-z_][\w-]*/g) ?? [];
    return names.length ? [{ names, type: p.type, required: Boolean(p.required), raw: p.name }] : [];
  });
}

/** `'a' | 'b'` → {a, b}; null when the type is not a pure string-literal union. */
function literalUnion(type: string): Set<string> | null {
  const parts = type.split('|').map((p) => p.trim());
  if (!parts.length || !parts.every((p) => /^'[^']*'$/.test(p))) return null;
  return new Set(parts.map((p) => p.slice(1, -1)));
}

function colorHint(catalog: Catalog, color: string): string {
  const [best] = nearestColors(catalog, color, undefined, 'light', 1);
  return best ? ` Closest theme role: ${best.role} → var(${best.cssVar}) (${best.value} in the default theme), but pick the role by meaning, not by hue.` : '';
}

function spacingHint(catalog: Catalog, value: string): string {
  const [best] = nearestLengths(catalog, value, 'space', 1);
  return best ? ` Closest token: var(${best.cssVar}) = ${best.value}.` : '';
}

class Collector {
  readonly items: Diagnostic[] = [];
  private seen = new Set<string>();
  add(d: Diagnostic) {
    const key = `${d.line}:${d.column}:${d.rule}:${d.message}`;
    if (!this.seen.has(key)) {
      this.seen.add(key);
      this.items.push(d);
    }
  }
}

function checkText(catalog: Catalog, out: Collector, text: string, at: (offset: number) => { line: number; column: number }, opts: { colors: boolean }) {
  const known = new Set(catalog.cssVars);
  for (const m of text.matchAll(VAR_REF_RE)) {
    const name = m[1]!;
    if (name.endsWith('-') || /^--dc-(light|dark)-color-/.test(name) || known.has(name)) continue;
    const hints = suggest(name, catalog.cssVars);
    out.add({
      severity: 'error',
      rule: 'unknown-token',
      message: `${name} is not defined by the design system.${hints.length ? ` Did you mean ${hints.join(', ')}?` : ''}`,
      ...at(m.index! + m[0].indexOf(name)),
    });
  }
  if (!opts.colors) return;
  for (const m of text.matchAll(COLOR_RE)) {
    if (!parseColor(m[0])) continue;
    out.add({
      severity: 'warning',
      rule: 'hardcoded-color',
      message: `Hard-coded color ${m[0]}: use a theme color token so light/dark mode and custom themes keep working.${colorHint(catalog, m[0])}`,
      ...at(m.index!),
    });
  }
}

function validateCss(catalog: Catalog, code: string): Diagnostic[] {
  const out = new Collector();
  const lineStarts = [0];
  for (let i = 0; i < code.length; i++) if (code[i] === '\n') lineStarts.push(i + 1);
  const at = (offset: number) => {
    let line = lineStarts.findIndex((start) => start > offset);
    line = line === -1 ? lineStarts.length : line;
    return { line, column: offset - lineStarts[line - 1]! + 1 };
  };
  // Blank comments out (keeping offsets) so commented code is ignored.
  const text = code.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  checkText(catalog, out, text, at, { colors: true });
  for (const m of text.matchAll(/(?:^|[;{\s])((?:margin|padding)(?:-[a-z]+)*|gap|row-gap|column-gap)\s*:\s*([^;}]+)/g)) {
    for (const part of m[2]!.trim().split(/\s+/)) {
      const px = lengthToPx(part);
      if (px === null || px === 0) continue;
      out.add({
        severity: 'info',
        rule: 'hardcoded-spacing',
        message: `${m[1]}: ${part} is a raw length; prefer spacing tokens.${spacingHint(catalog, part)}`,
        ...at(m.index! + m[0].indexOf(m[2]!)),
      });
      break;
    }
  }
  return out.items;
}

function validateTsx(catalog: Catalog, code: string, filename: string): Diagnostic[] {
  const out = new Collector();
  const sf = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true, /\.ts$/i.test(filename) ? ts.ScriptKind.TS : ts.ScriptKind.TSX);
  const pos = (offset: number) => {
    const { line, character } = sf.getLineAndCharacterOfPosition(offset);
    return { line: line + 1, column: character + 1 };
  };
  const exportKinds = new Map(catalog.exports.map((e) => [e.name, e.kind]));
  const exportEntries = new Set(catalog.exports.map((e) => `${e.entry ?? ''}:${e.name}`));
  const localToImported = new Map<string, string>();
  let hasStylesImport = false;
  let themeProviderNode: ts.Node | undefined;

  for (const statement of sf.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const from = statement.moduleSpecifier.text;
    if (from === `${PACKAGE}/styles.css`) hasStylesImport = true;
    const subpath = from.startsWith(`${PACKAGE}/`) ? from.slice(PACKAGE.length + 1) : undefined;
    if (subpath !== undefined) {
      if (!ALLOWED_SUBPATHS.has(subpath)) {
        out.add({
          severity: 'error',
          rule: 'invalid-import',
          message: `'${from}' is not a public entry point. Use '${PACKAGE}' or one of: ${[...ALLOWED_SUBPATHS].map((s) => `${PACKAGE}/${s}`).join(', ')}.`,
          ...pos(statement.moduleSpecifier.getStart(sf)),
        });
      }
    }
    if (from !== PACKAGE && subpath !== 'theme' && !(subpath && COMPONENT_SUBPATHS.has(subpath))) continue;
    const bindings = statement.importClause?.namedBindings;
    if (statement.importClause?.name) {
      out.add({ severity: 'error', rule: 'invalid-import', message: `${PACKAGE} has no default export; use named imports.`, ...pos(statement.importClause.name.getStart(sf)) });
    }
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const el of bindings.elements) {
      const imported = (el.propertyName ?? el.name).text;
      localToImported.set(el.name.text, imported);
      const entry = from === PACKAGE ? undefined : subpath && COMPONENT_SUBPATHS.has(subpath) ? subpath : null;
      if (entry !== null && exportKinds.has(imported) && !exportEntries.has(`${entry ?? ''}:${imported}`)) {
        const right = catalog.exports.find((e) => e.name === imported)?.entry;
        out.add({
          severity: 'error',
          rule: 'invalid-import',
          message: `'${imported}' is exported by '${right ? `${PACKAGE}/${right}` : PACKAGE}', not '${from}'.`,
          ...pos(el.getStart(sf)),
        });
      }
      if (entry !== null && !exportKinds.has(imported)) {
        const hints = suggest(imported, exportKinds.keys());
        out.add({
          severity: 'error',
          rule: 'unknown-export',
          message: `'${imported}' is not exported by ${from}.${hints.length ? ` Did you mean ${hints.join(', ')}?` : ' Use search_components to find an alternative.'}`,
          ...pos(el.getStart(sf)),
        });
      }
      if (imported === 'ThemeProvider') themeProviderNode = el;
    }
  }

  const checkLiteral = (node: ts.StringLiteralLike | ts.TemplateLiteralLikeNode) => {
    const parent = node.parent;
    // In JSX attributes, colors are only flagged on styling attributes (not data such as value="#0f62fe" or href="#abc").
    const attr = ts.isJsxAttribute(parent) ? parent : ts.isJsxExpression(parent) && ts.isJsxAttribute(parent.parent) ? parent.parent : undefined;
    const inNonColorAttr = attr !== undefined && !STYLE_ATTRS.has(attr.name.getText(sf));
    const isImport = ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent);
    const text = node.text;
    // Colors only where the literal is a value (or CSS text), not an id/anchor such as href="#abc".
    const looksLikeColorValue = parseColor(text) !== null || /[a-z-]+\s*:[^;]*?(#[0-9a-f]{3}|rgba?\(|hsla?\()/i.test(text);
    const start = node.getStart(sf) + 1;
    checkText(catalog, out, text, (offset) => pos(start + offset), { colors: !inNonColorAttr && !isImport && looksLikeColorValue });
  };

  const checkStyleObject = (obj: ts.ObjectLiteralExpression) => {
    for (const prop of obj.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const key = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : '';
      if (key.startsWith('--dc-') && !catalog.cssVars.includes(key)) {
        out.add({
          severity: 'warning',
          rule: 'unknown-token',
          message: `${key} is not a design system custom property, so setting it has no effect on components.${suggest(key, catalog.cssVars).map((s) => ` Did you mean ${s}?`)[0] ?? ''}`,
          ...pos(prop.name.getStart(sf)),
        });
      }
      if (!SPACING_PROPS.test(key)) continue;
      const init = prop.initializer;
      const raw = ts.isNumericLiteral(init) ? `${init.text}px` : ts.isStringLiteralLike(init) ? init.text : null;
      const px = raw === null ? null : lengthToPx(raw.trim().split(/\s+/)[0] ?? '');
      if (px === null || px === 0 || raw === null) continue;
      out.add({
        severity: 'info',
        rule: 'hardcoded-spacing',
        message: `style.${key} = ${init.getText(sf)} is a raw length; prefer layout components (Stack, Inline, Grid with gap) or spacing tokens.${spacingHint(catalog, raw.trim().split(/\s+/)[0]!)}`,
        ...pos(init.getStart(sf)),
      });
    }
  };

  const checkElement = (node: ts.JsxOpeningElement | ts.JsxSelfClosingElement) => {
    const tag = node.tagName.getText(sf);
    const attrs = node.attributes.properties;
    for (const attr of attrs) {
      if (ts.isJsxAttribute(attr) && attr.name.getText(sf) === 'style' && attr.initializer && ts.isJsxExpression(attr.initializer)) {
        const expr = attr.initializer.expression;
        if (expr && ts.isObjectLiteralExpression(expr)) checkStyleObject(expr);
      }
    }

    if (/^[a-z]/.test(tag)) {
      const alternatives = (NATIVE_ALTERNATIVES[tag] ?? []).filter((name) => exportKinds.get(name) === 'value');
      if (alternatives.length) {
        out.add({
          severity: 'info',
          rule: 'prefer-component',
          message: `Native <${tag}>: the design system provides ${alternatives.join(' / ')} with built-in accessibility and theming.`,
          ...pos(node.tagName.getStart(sf)),
        });
      }
      return;
    }

    const imported = localToImported.get(tag);
    if (!imported) return;
    const component = componentForExport(catalog, imported);
    if (!component || exportName(component.exports[0] ?? '') !== imported) return;
    const props = mainProps(component, imported);
    const documented = new Set(props.flatMap((p) => p.names));
    const present = new Set<string>();
    const hasSpread = attrs.some((a) => ts.isJsxSpreadAttribute(a));

    for (const attr of attrs) {
      if (!ts.isJsxAttribute(attr)) continue;
      const name = attr.name.getText(sf);
      present.add(name);
      const at = pos(attr.getStart(sf));
      if (name === 'onClick' && documented.has('onPress')) {
        out.add({ severity: 'warning', rule: 'prefer-onpress', message: `${imported} uses onPress (React Aria) for mouse, touch, keyboard and screen readers; onClick is not the documented API.`, ...at });
        continue;
      }
      const doc = props.find((p) => p.names.includes(name));
      if (doc) {
        const allowed = literalUnion(doc.type);
        const init = attr.initializer;
        const value =
          init && ts.isStringLiteral(init)
            ? init.text
            : init && ts.isJsxExpression(init) && init.expression && ts.isStringLiteralLike(init.expression)
              ? init.expression.text
              : undefined;
        if (allowed && value !== undefined && !allowed.has(value)) {
          out.add({
            severity: 'error',
            rule: 'invalid-prop-value',
            message: `${imported} ${name}="${value}" is not valid. Allowed: ${[...allowed].map((v) => `'${v}'`).join(' | ')}.`,
            ...at,
          });
        }
        continue;
      }
      if (documented.has(name) || ALWAYS_ALLOWED_PROPS.has(name) || /^(aria|data)-/.test(name) || component.inherits) continue;
      const hints = suggest(name, documented);
      // Prop docs list the main props, not every forwarded one: an undocumented prop is a hint, not a defect.
      out.add({
        severity: 'info',
        rule: 'unknown-prop',
        message: `${imported} does not document a '${name}' prop.${hints.length ? ` Did you mean ${hints.join(', ')}?` : ''}`,
        ...at,
      });
    }
    if (!hasSpread) {
      for (const p of props.filter((x) => x.required)) {
        if (!p.names.some((n) => present.has(n)) && !(p.names.includes('children') && ts.isJsxOpeningElement(node))) {
          out.add({ severity: 'warning', rule: 'missing-required-prop', message: `${imported} requires '${p.raw}' (${p.type}).`, ...pos(node.tagName.getStart(sf)) });
        }
      }
    }
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) checkElement(node);
    else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      checkLiteral(node);
    } else if (ts.isObjectLiteralExpression(node) && !ts.isJsxExpression(node.parent)) {
      // Style-like objects outside JSX (e.g. const vars = { '--dc-…': … }): check custom property keys.
      const hasTokenKey = node.properties.some((p) => ts.isPropertyAssignment(p) && ts.isStringLiteral(p.name) && p.name.text.startsWith('--dc-'));
      if (hasTokenKey) checkStyleObject(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  if (themeProviderNode && !hasStylesImport) {
    out.add({
      severity: 'info',
      rule: 'missing-styles',
      message: `Import '${PACKAGE}/styles.css' once at the app entry point; components are unstyled without it.`,
      ...pos(themeProviderNode.getStart(sf)),
    });
  }
  return out.items;
}

/** Statically checks code that uses the design system. Accepts TSX/TS/JSX or CSS. */
export function validateUsage(catalog: Catalog, code: string, filename?: string): Diagnostic[] {
  const diagnostics = isCssSource(code, filename) ? validateCss(catalog, code) : validateTsx(catalog, code, filename ?? 'input.tsx');
  const order: Record<Severity, number> = { error: 0, warning: 1, info: 2 };
  return diagnostics.sort((a, b) => order[a.severity] - order[b.severity] || a.line - b.line || a.column - b.column);
}
