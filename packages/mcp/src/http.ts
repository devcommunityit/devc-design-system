#!/usr/bin/env node
import { startHttpServer } from './http-server.js';

const port = Number(process.env.PORT ?? 3333);
const host = process.env.HOST ?? '127.0.0.1';
const allowedHosts = process.env.MCP_ALLOWED_HOSTS?.split(',').map((h) => h.trim()).filter(Boolean);

const { url } = await startHttpServer({ port, host, allowedHosts });
console.error(`dev-community-ui MCP server (Streamable HTTP) listening on ${url}`);
