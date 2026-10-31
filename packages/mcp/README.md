# @dev-community/ui-mcp

Server [Model Context Protocol](https://modelcontextprotocol.io) per il design system `@dev-community/ui`. Dà agli
assistenti AI (GitHub Copilot, Claude, Cursor…) il catalogo dei componenti, gli esempi, i token, i temi, la guida di
setup e i template di pagina, più un validatore che controlla il codice generato.

Tutti i dati sono generati in fase di build dai sorgenti del repository: file `*.meta.ts` ed `*.examples.tsx`, export
pubblici di `packages/ui/src/index.ts`, token generati, `packages/ui/README.md` e pagine dello showcase della
documentazione. Il server non può quindi divergere dalla libreria: se un esempio manca o un export documentato non
esiste, `npm run data` fallisce.

## Strumenti

Tutti gli strumenti sono di sola lettura.

| Strumento | Argomenti | A cosa serve |
| --- | --- | --- |
| `list_components` | `category?`, `kind?` | Elenco di componenti e pattern per categoria |
| `search_components` | `query`, `limit?` | Ricerca per nome, descrizione, export e props |
| `get_component` | `name` | Documentazione completa: import, props, accessibilità, esempi disponibili |
| `get_component_example` | `component`, `example?` | Codice TSX di un esempio reale ed eseguibile |
| `list_patterns` | — | Pattern composti e template di pagina |
| `get_page_template` | `slug` | Sorgente di una pagina completa dello showcase |
| `get_tokens` | `group?`, `query?`, `preset?` | Token con variabile CSS e valore |
| `resolve_token` | `value`, `preset?`, `scheme?` | Da un valore grezzo (`#0f62fe`, `16px`) ai token più vicini |
| `get_theme` | `preset?` | Preset di tema, palette light/dark, `ThemeProvider` e `createTheme` |
| `get_setup` | `topic?` | Installazione, stili, esempio minimo, tema personalizzato… |
| `validate_usage` | `code`, `filename?` | Lint del codice (TSX/TS/CSS) rispetto al design system |

`validate_usage` restituisce anche `structuredContent` (`errors`, `warnings`, `infos`, `diagnostics`). Le regole:

- **errori**: `unknown-export`, `invalid-import`, `invalid-prop-value`, `missing-required-prop`, `unknown-token`;
- **avvisi**: `prefer-onpress`, `hardcoded-color` (con il ruolo di colore più vicino);
- **suggerimenti**: `unknown-prop`, `hardcoded-spacing`, `prefer-component`, `missing-styles`.

## Risorse e prompt

- `dc-ui://components/{slug}`: documentazione di un componente, con elenco e completamento.
- `dc-ui://setup`: guida di setup completa.
- `dc-ui://tokens.json`: token e preset.
- `dc-ui://exports.json`: export pubblici del pacchetto, valori e tipi.
- Prompt `build-ui` (argomento `request`): guida l'assistente a costruire una schermata usando solo componenti e
  token della libreria, con validazione finale.

## Avvio

Dalla radice del repository:

```bash
npm run mcp        # compila e avvia su stdio
npm run mcp:http   # compila e avvia su HTTP: http://127.0.0.1:3333/mcp
```

Oppure, dentro `packages/mcp`: `npm run build`, poi `npm start` o `npm run start:http`. `npm run inspect` apre
[MCP Inspector](https://github.com/modelcontextprotocol/inspector).

### Trasporto HTTP

Streamable HTTP senza sessioni: ogni `POST /mcp` crea un server nuovo. `GET /healthz` risponde con lo stato.

| Variabile | Predefinito | Note |
| --- | --- | --- |
| `PORT` | `3333` | |
| `HOST` | `127.0.0.1` | Usa `0.0.0.0` solo dietro un proxy |
| `MCP_ALLOWED_HOSTS` | loopback | Host consentiti, separati da virgola (protezione da DNS rebinding) |

Le richieste con un `Host` o un `Origin` non consentito ricevono `403`. Il corpo è limitato a 4 MB. Il server non ha
autenticazione: per esporlo in rete mettilo dietro un reverse proxy che la gestisca.

## Configurazione dei client

**VS Code** (già presente in `.vscode/mcp.json` per questo repository, dopo `npm run build:mcp`):

```json
{
  "servers": {
    "dev-community-ui": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/packages/mcp/dist/stdio.js"]
    }
  }
}
```

**Pacchetto installato** (VS Code, Claude Desktop e altri client stdio):

```json
{
  "mcpServers": {
    "dev-community-ui": { "command": "npx", "args": ["-y", "-p", "@dev-community/ui-mcp", "dc-ui-mcp"] }
  }
}
```

Per HTTP con il pacchetto installato: `npx -p @dev-community/ui-mcp dc-ui-mcp-http`.

**HTTP**: `{ "type": "http", "url": "http://127.0.0.1:3333/mcp" }`.

## Uso programmatico

```ts
import { createServer, loadCatalog, validateUsage } from '@dev-community/ui-mcp';

const catalog = loadCatalog();
const result = validateUsage(catalog, code, 'Page.tsx');
```

## Sviluppo

```bash
npm run data        # rigenera data/catalog.json dai sorgenti (non versionato)
npm test            # rigenera i dati ed esegue i test
npm run typecheck
npm run build       # dati + dist/
```

Il server rilegge automaticamente il catalogo quando `npm run data` lo aggiorna, anche nelle connessioni già aperte.
Un catalogo passato esplicitamente a `createServer(catalog)` o al server HTTP resta invece uno snapshot fisso.
Dopo aver aggiornato il codice del server, ricompila e riavvia una volta il processo MCP già in esecuzione.

I test validano tutti gli esempi e i template di pagina reali: una modifica alla libreria che rende il validatore
troppo severo, o un esempio non conforme, fa fallire la suite.

## Pubblicazione

Il pacchetto viene pubblicato su GitHub Packages dal workflow `Release` (*Actions → Release → Run workflow* con
`package: mcp`, oppure un tag `mcp-v<versione>`), che allega anche il tarball alla GitHub Release. Per usarlo con
`npx` serve lo stesso `.npmrc` della libreria (`@dev-community:registry=https://npm.pkg.github.com/` più un token con
`read:packages`). Il pacchetto include `dist`, `data`, il CHANGELOG e questo README; `prepublishOnly` esegue il
controllo licenza/registry e `npm run build`. La versione dei dati corrisponde alla versione di `@dev-community/ui`
al momento della build: pubblica il server MCP insieme alla libreria. La licenza è MIT, come per
`@dev-community/ui` (vedi `LICENSE`).
