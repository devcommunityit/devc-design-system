import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type Catalog, findComponent, loadCatalog, normalize, searchComponents, suggest } from './catalog.js';
import { componentSummaryLine, formatComponent, formatDiagnostics, table } from './format.js';
import { allTokens, getPreset, lengthToPx, lookupToken, nearestColors, nearestLengths, parseColor, searchTokens, suggestCssVars, tokenGroups } from './tokens.js';
import { validateUsage } from './validate.js';

export const SERVER_NAME = 'dev-community-ui';

const INSTRUCTIONS = `Design system @dev-community/ui (React/TypeScript, React Aria, CSS custom properties with prefix --dc-).
Use these tools whenever you write or review UI code for a project that uses @dev-community/ui:
1. Find components with search_components / list_components and read get_component BEFORE using one (props, when to use, accessibility).
2. Start from get_setup (providers + styles.css import) and the page templates (list_patterns / get_page_template) for full pages.
3. Never hard-code colors, spacing or radii: use tokens (get_tokens, resolve_token) via var(--dc-…), and layout components (Stack, Inline, Grid).
4. Run validate_usage on the code you produce and fix errors and warnings.
Documentation prose is in Italian; component and prop names are the source of truth.`;

type Text = { content: Array<{ type: 'text'; text: string }>; isError?: boolean };
const text = (t: string): Text => ({ content: [{ type: 'text', text: t }] });
const fail = (t: string): Text => ({ content: [{ type: 'text', text: t }], isError: true });

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

function notFoundComponent(catalog: Catalog, query: string): Text {
  const hits = searchComponents(catalog, query, 5).map((h) => h.component.name);
  const close = suggest(query, catalog.components.flatMap((c) => [c.name, c.slug]));
  const ideas = [...new Set([...close, ...hits])].slice(0, 5);
  return fail(`No component or pattern named "${query}".${ideas.length ? ` Did you mean: ${ideas.join(', ')}?` : ''} Use search_components or list_components.`);
}

/** A supplied catalog is fixed; a loader (or the default file loader) is evaluated per request. */
export function createServer(source?: Catalog | (() => Catalog)): McpServer {
  const getCatalog = typeof source === 'function' ? source : source ? () => source : loadCatalog;
  const catalog = getCatalog();
  const server = new McpServer({ name: SERVER_NAME, title: `${catalog.package} design system`, version: catalog.version }, { instructions: INSTRUCTIONS });

  // ---------- Components ----------

  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description: `List every component and pattern of ${catalog.package} with category, exports and a one-line summary. Optionally filter by category.`,
      inputSchema: {
        category: z.string().optional().describe('Category id, such as data, forms or overlay.'),
        kind: z.enum(['component', 'pattern']).optional().describe('Only components or only patterns.'),
      },
      annotations: { title: 'List components', ...READ_ONLY },
    },
    ({ category, kind }) => {
      const catalog = getCatalog();
      if (category && !Object.prototype.hasOwnProperty.call(catalog.categories, category)) {
        return fail(`Unknown category "${category}". Categories: ${Object.keys(catalog.categories).join(', ')}.`);
      }
      const items = catalog.components.filter((c) => (!category || c.category === category) && (!kind || c.kind === kind));
      const byCategory = new Map<string, string[]>();
      for (const c of items) byCategory.set(c.category, [...(byCategory.get(c.category) ?? []), componentSummaryLine(catalog, c)]);
      const body = [...byCategory].map(([cat, lines]) => `## ${catalog.categories[cat] ?? cat} (\`${cat}\`)\n${lines.join('\n')}`).join('\n\n');
      return text(`${items.length} item(s) in ${catalog.package}@${catalog.version}.\n\n${body}`);
    },
  );

  server.registerTool(
    'search_components',
    {
      title: 'Search components',
      description: 'Find the right component for a need, e.g. "date range picker", "toast notification", "sortable table", "chat message". Searches names, summaries, usage guidance, props and examples (Italian and English keywords).',
      inputSchema: {
        query: z.string().min(1).describe('What you need, in a few words.'),
        limit: z.number().int().min(1).max(30).default(8),
      },
      annotations: { title: 'Search components', ...READ_ONLY },
    },
    ({ query, limit }) => {
      const catalog = getCatalog();
      const hits = searchComponents(catalog, query, limit);
      if (!hits.length) return text(`No match for "${query}". Try other keywords or list_components.`);
      return text(hits.map((h) => componentSummaryLine(catalog, h.component)).join('\n'));
    },
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get component documentation',
      description: 'Full documentation of one component or pattern: import line, when (not) to use, props with types and defaults, keyboard, accessibility, responsive behaviour, customization, common mistakes and code examples.',
      inputSchema: {
        name: z.string().min(1).describe('Component name, slug or any export name (e.g. "Button", "date-picker", "TabList").'),
        examples: z
          .enum(['first', 'all', 'none'])
          .default('first')
          .describe('Which examples to include as code: the first one (default), all, or none.'),
      },
      annotations: { title: 'Get component documentation', ...READ_ONLY },
    },
    ({ name, examples }) => {
      const catalog = getCatalog();
      const component = findComponent(catalog, name);
      if (!component) return notFoundComponent(catalog, name);
      const selection = examples === 'first' ? component.examples.slice(0, 1).map((e) => e.name) : examples;
      return text(formatComponent(catalog, component, { examples: selection }));
    },
  );

  server.registerTool(
    'get_component_example',
    {
      title: 'Get component example code',
      description: 'Copy-paste-ready TSX for one documented example of a component (with only the imports and helpers it needs).',
      inputSchema: {
        component: z.string().min(1).describe('Component name, slug or export name.'),
        example: z.string().optional().describe('Example name (e.g. "Variants"). Omit to list the available examples.'),
      },
      annotations: { title: 'Get component example code', ...READ_ONLY },
    },
    ({ component: query, example }) => {
      const catalog = getCatalog();
      const component = findComponent(catalog, query);
      if (!component) return notFoundComponent(catalog, query);
      const list = component.examples.map((e) => `- \`${e.name}\`: ${e.title}${e.description ? ` — ${e.description}` : ''}`).join('\n');
      if (!example) return text(`Examples for ${component.name}:\n${list}`);
      const found = component.examples.find((e) => normalize(e.name) === normalize(example) || normalize(e.title) === normalize(example));
      if (!found) return fail(`${component.name} has no example "${example}". Available:\n${list}`);
      return text(`### ${component.name} — ${found.title}\n${found.description ? `${found.description}\n\n` : ''}\`\`\`tsx\n${found.code}\n\`\`\``);
    },
  );

  // ---------- Patterns and page templates ----------

  server.registerTool(
    'list_patterns',
    {
      title: 'List patterns and page templates',
      description: 'Composite patterns exported by the library (site header, user menu, auth, notification center) and full-page templates from the docs showcase (landing, dashboards, list with filters, detail, complex form, settings, account, auth, error states).',
      inputSchema: {},
      annotations: { title: 'List patterns and page templates', ...READ_ONLY },
    },
    () => {
      const catalog = getCatalog();
      const patterns = catalog.components.filter((c) => c.kind === 'pattern').map((c) => componentSummaryLine(catalog, c));
      const pages = catalog.pages.map((p) => `- **${p.title}** (\`${p.slug}\`) — ${p.description}`);
      return text(`## Patterns (use get_component)\n${patterns.join('\n')}\n\n## Page templates (use get_page_template)\n${pages.join('\n')}`);
    },
  );

  server.registerTool(
    'get_page_template',
    {
      title: 'Get page template source',
      description: 'Full TSX source of a realistic page built only with library components (from the docs showcase). Use it as a starting point for whole screens.',
      inputSchema: { slug: z.string().min(1).describe('Template slug or title, as returned by list_patterns.') },
      annotations: { title: 'Get page template source', ...READ_ONLY },
    },
    ({ slug }) => {
      const catalog = getCatalog();
      const q = normalize(slug);
      const page = catalog.pages.find((p) => p.slug === q || normalize(p.title) === q || normalize(p.component) === q);
      if (!page) return fail(`Unknown template "${slug}". Available: ${catalog.pages.map((p) => p.slug).join(', ')}.`);
      const note = page.localImports.length
        ? `\n\nNote: local imports (${page.localImports.join(', ')}) are demo data/helpers of the docs site; replace them with your own data.`
        : '';
      return text(`# ${page.title}\n${page.description}\n\nSource: ${page.file}${note}\n\n\`\`\`tsx\n${page.code}\n\`\`\``);
    },
  );

  // ---------- Tokens and themes ----------

  server.registerTool(
    'get_tokens',
    {
      title: 'Get design tokens',
      description: 'Design tokens as CSS custom properties (use them as var(--dc-…)). Filter by group and/or text. Color values come from a theme preset (light and dark).',
      inputSchema: {
        group: z.string().optional().describe('Token group, such as color or space.'),
        query: z.string().optional().describe('Text filter on token name, e.g. "surface", "radius", "font.size".'),
        preset: z.string().optional().describe('Theme preset for color values.'),
      },
      annotations: { title: 'Get design tokens', ...READ_ONLY },
    },
    ({ group, query, preset }) => {
      const catalog = getCatalog();
      if (preset && !getPreset(catalog, preset)) return fail(`Unknown preset "${preset}". Presets: ${catalog.tokens.presets.map((p) => p.name).join(', ')}.`);
      const groups = tokenGroups(catalog);
      if (group && !groups.includes(group)) return fail(`Unknown group "${group}". Groups: ${groups.join(', ')}.`);
      if (!group && !query) {
        const counts = groups.map((g) => `- \`${g}\`: ${allTokens(catalog).filter((t) => t.group === g).length} tokens`);
        return text(
          `Token groups (pass group or query to see values):\n${counts.join('\n')}\n\nCSS variable name: --${catalog.tokens.prefix}-<token with dots replaced by dashes>; colors: --${catalog.tokens.prefix}-color-<role>. Breakpoints (px): ${JSON.stringify(catalog.tokens.breakpoints)}.`,
        );
      }
      let tokens = query ? searchTokens(catalog, query, preset) : allTokens(catalog, preset);
      if (group) tokens = tokens.filter((t) => t.group === group);
      if (!tokens.length) return text(`No tokens match.`);
      const isColor = tokens.every((t) => t.group === 'color');
      const rows = tokens.map((t) => (isColor ? [t.name, `var(${t.cssVar})`, t.value, t.darkValue ?? ''] : [t.name, `var(${t.cssVar})`, t.value, t.note ?? '']));
      const headers = isColor ? ['Role', 'CSS', `Light (${preset ?? catalog.tokens.defaultPreset})`, 'Dark'] : ['Token', 'CSS', 'Value', 'Variant'];
      return text(table(headers, rows));
    },
  );

  server.registerTool(
    'resolve_token',
    {
      title: 'Resolve a value to a token',
      description: 'Given a raw value (e.g. "#1a73e8", "rgb(0 0 0 / .5)", "12px", "1.5rem") find the closest design tokens; given a token name or CSS variable (e.g. "surface.raised", "--dc-space-4") return its definition.',
      inputSchema: {
        value: z.string().min(1),
        preset: z.string().optional(),
        scheme: z.enum(['light', 'dark']).default('light'),
      },
      annotations: { title: 'Resolve a value to a token', ...READ_ONLY },
    },
    ({ value, preset, scheme }) => {
      const catalog = getCatalog();
      if (preset && !getPreset(catalog, preset)) return fail(`Unknown preset "${preset}". Presets: ${catalog.tokens.presets.map((p) => p.name).join(', ')}.`);
      const exact = lookupToken(catalog, value, preset);
      if (exact.length) {
        return text(
          exact
            .map((t) => `- ${t.name} → var(${t.cssVar}) = ${t.value}${t.darkValue ? ` (dark: ${t.darkValue})` : ''}${t.note ? ` [${t.group}: ${t.note}]` : ''}`)
            .join('\n'),
        );
      }
      if (value.trim().startsWith('--') || /^var\(/.test(value.trim())) {
        const name = value.trim().replace(/^var\(\s*/, '').replace(/\s*(,[^)]*)?\)$/, '');
        if (catalog.cssVars.includes(name)) return text(`${name} is a component-level custom property defined by the library (not a public token).`);
        const hints = suggestCssVars(catalog, name);
        return fail(`${name} is not defined by the design system.${hints.length ? ` Did you mean ${hints.join(', ')}?` : ''}`);
      }
      if (parseColor(value)) {
        const matches = nearestColors(catalog, value, preset, scheme);
        return text(
          `Closest color roles in ${preset ?? catalog.tokens.defaultPreset} (${scheme}); distance < 2 ≈ identical, > 10 clearly different. Choose the role by meaning (text, surface, action, border, feedback…) so it adapts to themes and dark mode.\n\n${table(
            ['Role', 'CSS', 'Value', 'Distance'],
            matches.map((m) => [m.role, `var(${m.cssVar})`, m.value, m.distance.toFixed(1)]),
          )}`,
        );
      }
      if (lengthToPx(value) !== null) {
        const matches = nearestLengths(catalog, value);
        return text(
          `Closest size tokens to ${value} (${lengthToPx(value)}px at 16px root):\n\n${table(
            ['Token', 'CSS', 'Value', 'Δ px'],
            matches.map((m) => [m.name, `var(${m.cssVar})`, m.value, m.delta.toFixed(1)]),
          )}`,
        );
      }
      const found = searchTokens(catalog, value, preset).slice(0, 15);
      if (found.length) return text(found.map((t) => `- ${t.name} → var(${t.cssVar}) = ${t.value}`).join('\n'));
      return fail(`Cannot resolve "${value}". Pass a token name, a --dc-* variable, a color or a length.`);
    },
  );

  server.registerTool(
    'get_theme',
    {
      title: 'Get theme presets',
      description: 'Built-in theme presets (brand colors, description) and how to apply or create a theme with ThemeProvider and createTheme. Pass a preset to get its full light/dark palette.',
      inputSchema: { preset: z.string().optional() },
      annotations: { title: 'Get theme presets', ...READ_ONLY },
    },
    ({ preset }) => {
      const catalog = getCatalog();
      if (preset && !getPreset(catalog, preset)) return fail(`Unknown preset "${preset}". Presets: ${catalog.tokens.presets.map((p) => p.name).join(', ')}.`);
      const custom = catalog.setup.find((s) => s.id === 'tema-personalizzato');
      if (!preset) {
        const rows = catalog.tokens.presets.map((p) => [
          p.name === catalog.tokens.defaultPreset ? `${p.name} (default)` : p.name,
          p.label.en,
          p.brand,
          p.tertiary ?? '',
          p.description,
        ]);
        return text(
          `${table(['Preset', 'Label', 'Brand', 'Tertiary', 'Description'], rows)}\n\nLooks: ${Object.keys(catalog.tokens.look).join(', ')} (default ${catalog.tokens.defaultLook}). Densities: ${Object.keys(catalog.tokens.density).join(', ')}.\n\n## Custom theme\n${custom?.markdown ?? ''}`,
        );
      }
      const p = getPreset(catalog, preset)!;
      const rows = catalog.tokens.color.map((c) => [c.name, `var(${c.cssVar})`, p.colors.light[c.name] ?? '', p.colors.dark[c.name] ?? '']);
      return text(`# ${p.label.en} (\`${p.name}\`)\n${p.description}\n\nBrand ${p.brand}${p.tertiary ? `, tertiary ${p.tertiary}` : ''}.\n\n${table(['Role', 'CSS', 'Light', 'Dark'], rows)}`);
    },
  );

  // ---------- Setup ----------

  server.registerTool(
    'get_setup',
    {
      title: 'Get setup guide',
      description: 'How to install and wire the library: npm install, styles.css import, ThemeProvider/LocaleProvider, custom themes, expressive look, charts. Pass a topic to get one section.',
      inputSchema: {
        topic: z.string().optional().describe('Section id or keyword, or "all".'),
      },
      annotations: { title: 'Get setup guide', ...READ_ONLY },
    },
    ({ topic }) => {
      const catalog = getCatalog();
      const render = (sections: Catalog['setup']) => sections.map((s) => `## ${s.title}\n${s.markdown}`).join('\n\n');
      if (topic === 'all') return text(render(catalog.setup));
      if (!topic) {
        const essentials = catalog.setup.filter((s) => ['installazione', 'stili', 'esempio-minimo', 'punti-chiave'].includes(s.id));
        return text(`${render(essentials)}\n\nMore topics: ${catalog.setup.map((s) => s.id).join(', ')}.`);
      }
      const q = normalize(topic);
      const matches = catalog.setup.filter((s) => s.id === q || normalize(`${s.title} ${s.markdown}`).includes(q));
      if (!matches.length) return fail(`No setup section matches "${topic}". Topics: ${catalog.setup.map((s) => s.id).join(', ')}.`);
      return text(render(matches));
    },
  );

  // ---------- Validation ----------

  const diagnosticSchema = z.object({
    severity: z.enum(['error', 'warning', 'info']),
    rule: z.string(),
    message: z.string(),
    line: z.number(),
    column: z.number(),
  });

  server.registerTool(
    'validate_usage',
    {
      title: 'Validate design system usage',
      description:
        'Static check of TSX/JSX/TS or CSS that uses the design system: unknown exports and deep imports, invalid enum prop values, undocumented or missing required props, onClick instead of onPress, unknown --dc-* tokens, hard-coded colors and spacing (with the closest token), native elements that have a design system equivalent, missing styles.css. Does not type-check or run the code.',
      inputSchema: {
        code: z.string().min(1).max(500_000).describe('Source code to check.'),
        filename: z.string().optional().describe('Optional file name; the extension selects the parser (.tsx, .ts, .jsx, .css).'),
      },
      outputSchema: {
        errors: z.number(),
        warnings: z.number(),
        infos: z.number(),
        diagnostics: z.array(diagnosticSchema),
      },
      annotations: { title: 'Validate design system usage', ...READ_ONLY },
    },
    ({ code, filename }) => {
      const catalog = getCatalog();
      const diagnostics = validateUsage(catalog, code, filename);
      const count = (s: string) => diagnostics.filter((d) => d.severity === s).length;
      return {
        content: [{ type: 'text', text: formatDiagnostics(diagnostics) }],
        structuredContent: { errors: count('error'), warnings: count('warning'), infos: count('info'), diagnostics },
      };
    },
  );

  // ---------- Resources ----------

  server.registerResource(
    'component',
    new ResourceTemplate('dc-ui://components/{slug}', {
      list: () => ({
        resources: getCatalog().components.map((c) => ({
          uri: `dc-ui://components/${c.slug}`,
          name: c.name,
          description: c.summary,
          mimeType: 'text/markdown',
        })),
      }),
      complete: { slug: (value) => getCatalog().components.map((c) => c.slug).filter((s) => s.startsWith(value)) },
    }),
    { title: 'Component documentation', description: 'Documentation of one component or pattern, with all examples.', mimeType: 'text/markdown' },
    (uri, { slug }) => {
      const catalog = getCatalog();
      const component = findComponent(catalog, String(slug));
      if (!component) throw new Error(`Unknown component: ${String(slug)}`);
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: formatComponent(catalog, component, { examples: 'all' }) }] };
    },
  );

  server.registerResource(
    'setup',
    'dc-ui://setup',
    { title: 'Setup guide', description: `README of ${catalog.package}: install, styles, providers, themes.`, mimeType: 'text/markdown' },
    (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'text/markdown', text: getCatalog().setup.map((s) => `## ${s.title}\n${s.markdown}`).join('\n\n') }],
    }),
  );

  server.registerResource(
    'tokens',
    'dc-ui://tokens.json',
    { title: 'Design tokens', description: 'All public tokens with CSS variables, values and theme presets (JSON).', mimeType: 'application/json' },
    (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(getCatalog().tokens, null, 2) }] }),
  );

  server.registerResource(
    'exports',
    'dc-ui://exports.json',
    { title: 'Public exports', description: `Every named export of ${catalog.package} (value or type).`, mimeType: 'application/json' },
    (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(getCatalog().exports) }] }),
  );

  // ---------- Prompts ----------

  server.registerPrompt(
    'build-ui',
    {
      title: 'Build UI with the design system',
      description: 'Guides the assistant to build a screen or feature using only @dev-community/ui components and tokens.',
      argsSchema: { request: z.string().describe('What to build, e.g. "a settings page with notification preferences".') },
    },
    ({ request }) => {
      const catalog = getCatalog();
      return { messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Build the following with ${catalog.package}: ${request}

Process:
1. Call list_patterns and, if a page template fits, get_page_template to start from it.
2. For each UI need, call search_components, then get_component to read props and accessibility notes. Do not invent components or props.
3. Use layout components (Stack, Inline, Grid, Container) and tokens (get_tokens / resolve_token) instead of hard-coded colors, spacing or radii.
4. Import everything from '${catalog.package}' (named imports); the app must import '${catalog.package}/styles.css' once and wrap the tree in ThemeProvider (see get_setup).
5. Run validate_usage on the final code and fix every error and warning before answering.`,
          },
        },
      ] };
    },
  );

  return server;
}
