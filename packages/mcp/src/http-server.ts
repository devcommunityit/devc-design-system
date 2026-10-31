import { createServer as createHttpServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { type Catalog, loadCatalog } from './catalog.js';
import { createServer } from './server.js';

export interface HttpServerOptions {
  port?: number;
  host?: string;
  /** Accepted Host header names. Defaults to loopback names when bound to a loopback address. */
  allowedHosts?: string[];
  path?: string;
  catalog?: Catalog;
}

const LOOPBACK = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const MAX_BODY = 4 * 1024 * 1024;

function jsonRpcError(res: ServerResponse, status: number, message: string, code = -32000) {
  res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify({ jsonrpc: '2.0', error: { code, message }, id: null }));
}

function hostname(header: string | undefined): string | undefined {
  if (!header) return undefined;
  try {
    return new URL(`http://${header}`).hostname;
  } catch {
    return undefined;
  }
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY) throw new Error('Request body too large');
    chunks.push(chunk as Buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

/**
 * Stateless Streamable HTTP endpoint (POST {path}); a fresh MCP server per request.
 * Host/Origin checks protect a loopback-bound server from DNS rebinding.
 */
export async function startHttpServer(options: HttpServerOptions = {}): Promise<{ server: Server; url: string; close: () => Promise<void> }> {
  const host = options.host ?? '127.0.0.1';
  const path = options.path ?? '/mcp';
  const allowed = options.allowedHosts?.length
    ? new Set(options.allowedHosts.map((h) => h.toLowerCase()))
    : LOOPBACK.has(host)
      ? LOOPBACK
      : null;

  const server = createHttpServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const requestHost = hostname(req.headers.host)?.toLowerCase();
    if (allowed && (!requestHost || !allowed.has(requestHost))) return jsonRpcError(res, 403, 'Host not allowed');
    const origin = req.headers.origin;
    if (origin && allowed && !allowed.has(hostname(origin.replace(/^[a-z]+:\/\//i, ''))?.toLowerCase() ?? '')) {
      return jsonRpcError(res, 403, 'Origin not allowed');
    }

    if (url.pathname === '/healthz') {
      try {
        const catalog = options.catalog ?? loadCatalog();
        res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ status: 'ok', package: catalog.package, version: catalog.version }));
      } catch (error) {
        console.error('MCP catalog failed to load', error);
        jsonRpcError(res, 500, 'Internal server error', -32603);
      }
      return;
    }
    if (url.pathname !== path) return jsonRpcError(res, 404, 'Not found');
    if (req.method !== 'POST') {
      res.setHeader('allow', 'POST');
      return jsonRpcError(res, 405, 'Method not allowed: this server is stateless, use POST');
    }

    let body: unknown;
    try {
      body = await readJson(req);
    } catch (error) {
      return jsonRpcError(res, 400, error instanceof Error ? error.message : 'Invalid body', -32700);
    }

    try {
      const mcp = createServer(options.catalog);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on('close', () => {
        void transport.close();
        void mcp.close();
      });
      await mcp.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (error) {
      console.error('MCP request failed', error);
      if (!res.headersSent) jsonRpcError(res, 500, 'Internal server error', -32603);
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port ?? 3333, host, () => resolve());
  });
  const address = server.address() as AddressInfo;
  const displayHost = address.family === 'IPv6' ? `[${address.address}]` : address.address;
  return {
    server,
    url: `http://${displayHost}:${address.port}${path}`,
    close: () => new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve()))),
  };
}
