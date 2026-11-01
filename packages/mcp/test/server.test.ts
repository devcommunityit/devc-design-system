import { randomUUID } from 'node:crypto';
import { existsSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from '../src/server.js';
import { startHttpServer } from '../src/http-server.js';
import { createCatalogLoader, loadCatalog } from '../src/catalog.js';

type TextResult = { content: Array<{ type: string; text?: string }>; isError?: boolean; structuredContent?: Record<string, unknown> };
const textOf = (result: unknown) => ((result as TextResult).content[0]?.text ?? '') as string;

describe('MCP server (in memory)', () => {
  const client = new Client({ name: 'test', version: '0.0.0' });

  beforeAll(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await createServer().connect(serverTransport);
    await client.connect(clientTransport);
  });
  afterAll(() => client.close());

  it('advertises tools, resources and prompts', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      'get_component',
      'get_component_example',
      'get_page_template',
      'get_setup',
      'get_theme',
      'get_tokens',
      'list_components',
      'list_patterns',
      'resolve_token',
      'search_components',
      'validate_usage',
    ]);
    expect(tools.every((t) => t.annotations?.readOnlyHint)).toBe(true);
    expect(client.getInstructions()).toContain('validate_usage');

    const { resources } = await client.listResources();
    expect(resources.some((r) => r.uri === 'dc-ui://components/button')).toBe(true);
    expect(resources.some((r) => r.uri === 'dc-ui://setup')).toBe(true);
    const { prompts } = await client.listPrompts();
    expect(prompts.map((p) => p.name)).toContain('build-ui');
  });

  it('documents a component', async () => {
    const result = await client.callTool({ name: 'get_component', arguments: { name: 'Button' } });
    const text = textOf(result);
    expect(text).toContain("import { Button, LinkButton } from '@dev-community/ui';");
    expect(text).toContain('| `variant` |');
    expect(text).toContain('```tsx');
  });

  it('returns helpful errors for unknown names', async () => {
    const result = (await client.callTool({ name: 'get_component', arguments: { name: 'Buttn' } })) as TextResult;
    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain('Button');
  });

  it('lists, searches and returns examples', async () => {
    expect(textOf(await client.callTool({ name: 'list_components', arguments: { category: 'charts' } }))).toContain('BarChart');
    expect(textOf(await client.callTool({ name: 'search_components', arguments: { query: 'notifiche toast' } }))).toContain('Toast');
    const example = textOf(await client.callTool({ name: 'get_component_example', arguments: { component: 'button', example: 'Variants' } }));
    expect(example).toContain('export function Variants');
  });

  it('serves patterns, page templates, tokens, themes and setup', async () => {
    expect(textOf(await client.callTool({ name: 'list_patterns', arguments: {} }))).toContain('dashboard');
    expect(textOf(await client.callTool({ name: 'get_page_template', arguments: { slug: 'dashboard' } }))).toContain("from '@dev-community/ui'");
    expect(textOf(await client.callTool({ name: 'get_tokens', arguments: { group: 'space' } }))).toContain('var(--dc-space-4)');
    expect(textOf(await client.callTool({ name: 'resolve_token', arguments: { value: '1rem' } }))).toContain('space.4');
    expect(textOf(await client.callTool({ name: 'get_theme', arguments: {} }))).toContain('createTheme');
    expect(textOf(await client.callTool({ name: 'get_theme', arguments: { preset: 'ocean' } }))).toContain('text.primary');
    expect(textOf(await client.callTool({ name: 'get_setup', arguments: {} }))).toContain('styles.css');
  });

  it('lists readable page templates and resolves them by slug, title and component', async () => {
    const listing = textOf(await client.callTool({ name: 'list_patterns', arguments: {} }));
    expect(listing).not.toContain('[object Object]');
    for (const page of loadCatalog().pages) {
      expect(listing).toContain(`**${page.title}** (\`${page.slug}\`) — ${page.description}`);
      for (const slug of [page.slug, page.title.toUpperCase(), page.component]) {
        const result = await client.callTool({ name: 'get_page_template', arguments: { slug } }) as TextResult;
        expect(result.isError).not.toBe(true);
        expect(textOf(result)).toContain(`# ${page.title}\n${page.description}`);
        expect(textOf(result)).toContain(page.code);
      }
    }
    const unknown = await client.callTool({ name: 'get_page_template', arguments: { slug: 'unknown-template' } }) as TextResult;
    expect(unknown.isError).toBe(true);
    expect(textOf(unknown)).toContain('Unknown template "unknown-template"');
  });

  it('validates code with structured output', async () => {
    const result = (await client.callTool({
      name: 'validate_usage',
      arguments: { code: `import { Buton } from '@dev-community/ui';`, filename: 'a.tsx' },
    })) as TextResult;
    expect(result.structuredContent).toMatchObject({ errors: 1 });
    expect(textOf(result)).toContain('unknown-export');
  });

  it('reads component resources and renders the prompt', async () => {
    const resource = await client.readResource({ uri: 'dc-ui://components/date-picker' });
    expect(resource.contents[0]).toMatchObject({ mimeType: 'text/markdown' });
    const prompt = await client.getPrompt({ name: 'build-ui', arguments: { request: 'una pagina impostazioni' } });
    expect(JSON.stringify(prompt.messages)).toContain('validate_usage');
  });

  it('reloads a changed catalog for existing connections while preserving injected snapshots', async () => {
    const file = join(tmpdir(), `dc-ui-catalog-${randomUUID()}.json`);
    const replacement = `${file}.replacement`;
    const initial = loadCatalog();
    const dynamicClient = new Client({ name: 'dynamic', version: '0.0.0' });
    const fixedClient = new Client({ name: 'fixed', version: '0.0.0' });
    try {
      writeFileSync(file, JSON.stringify(initial));
      const loader = createCatalogLoader(pathToFileURL(file));
      expect(loader()).toBe(loader());
      const [dynamicTransport, dynamicServerTransport] = InMemoryTransport.createLinkedPair();
      const [fixedTransport, fixedServerTransport] = InMemoryTransport.createLinkedPair();
      await createServer(loader).connect(dynamicServerTransport);
      await dynamicClient.connect(dynamicTransport);
      await createServer(initial).connect(fixedServerTransport);
      await fixedClient.connect(fixedTransport);

      const added = {
        ...initial.components[0]!, name: 'RuntimeCatalogTest', slug: 'runtime-catalog-test',
        category: 'runtime-test', exports: ['RuntimeCatalogTest'],
      };
      const changed = {
        ...initial,
        categories: { ...initial.categories, 'runtime-test': 'Runtime' },
        components: [...initial.components, added],
        exports: [...initial.exports, { name: 'RuntimeCatalogTest', kind: 'value' as const }],
      };
      writeFileSync(replacement, JSON.stringify(changed));
      renameSync(replacement, file);
      expect(textOf(await dynamicClient.callTool({ name: 'get_component', arguments: { name: 'RuntimeCatalogTest' } }))).toContain('# RuntimeCatalogTest');
      expect(textOf(await dynamicClient.callTool({ name: 'list_components', arguments: { category: 'runtime-test' } }))).toContain('RuntimeCatalogTest');
      expect((await dynamicClient.listResources()).resources.some((item) => item.uri === 'dc-ui://components/runtime-catalog-test')).toBe(true);
      const validation = await dynamicClient.callTool({
        name: 'validate_usage', arguments: { code: "import { RuntimeCatalogTest } from '@dev-community/ui';", filename: 'example.tsx' },
      }) as TextResult;
      expect(validation.structuredContent).toMatchObject({ errors: 0 });
      expect((await fixedClient.callTool({ name: 'get_component', arguments: { name: 'RuntimeCatalogTest' } }) as TextResult).isError).toBe(true);
    } finally {
      await dynamicClient.close();
      await fixedClient.close();
      if (existsSync(replacement)) unlinkSync(replacement);
      if (existsSync(file)) unlinkSync(file);
    }
  });
});

describe('MCP server (Streamable HTTP)', () => {
  let http: Awaited<ReturnType<typeof startHttpServer>>;
  beforeAll(async () => {
    http = await startHttpServer({ port: 0 });
  });
  afterAll(() => http.close());

  it('serves MCP over HTTP', async () => {
    const client = new Client({ name: 'test-http', version: '0.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(http.url)));
    const result = await client.callTool({ name: 'get_component', arguments: { name: 'toast' } });
    expect(textOf(result)).toContain('# Toast');
    await client.close();
  });

  it('exposes a health check and rejects foreign hosts and non-POST requests', async () => {
    const base = http.url.replace(/\/mcp$/, '');
    expect(await (await fetch(`${base}/healthz`)).json()).toMatchObject({ status: 'ok' });
    expect((await fetch(http.url)).status).toBe(405);
    const rebindingStatus = await new Promise<number | undefined>((resolve, reject) => {
      const req = request(http.url, { method: 'POST', headers: { host: 'evil.example', 'content-type': 'application/json' } }, (res) => {
        res.resume();
        resolve(res.statusCode);
      });
      req.on('error', reject);
      req.end('{}');
    });
    expect(rebindingStatus).toBe(403);
  });
});
