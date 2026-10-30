# @dev-community/ui

Design system React/TypeScript per siti pubblici, portali e dashboard: token, temi (light/dark/system, 8 preset, temi
personalizzati), componenti accessibili basati su React Aria e pattern pronti (header, footer, menu utente, autenticazione).

> **Licenza**: non ancora definita. La scelta spetta al proprietario del progetto e va fatta prima di qualsiasi pubblicazione.

## Requisiti

- React e React DOM `^18.3 || ^19` (peer dependencies).
- Bundler con supporto a ESM e import di file CSS (Vite, Next.js, webpack 5…).

## Installazione

```bash
npm install @dev-community/ui
# registry privato: configurare .npmrc, ad esempio
# @dev-community:registry=https://npm.example.com/
```

## Stili

Importa il foglio di stile **una sola volta**, nel punto d’ingresso dell’applicazione:

```ts
import '@dev-community/ui/styles.css';   // token + stili dei componenti (obbligatorio)
import '@dev-community/ui/reset.css';    // opzionale: reset minimo, opt-in
```

Tutte le classi e le variabili usano il prefisso `dc` (`.dc-…`, `--dc-…`). `styles.css` non contiene selettori globali
su `html`, `body` o `*`: il reset è separato e facoltativo. Tailwind non è richiesto.

Altri export: `@dev-community/ui/tokens.css` (solo variabili), `@dev-community/ui/tokens.json` (token in formato DTCG).

## Esempio minimo

```tsx
import '@dev-community/ui/styles.css';
import { ThemeProvider, LocaleProvider, Button } from '@dev-community/ui';

export function App() {
  return (
    <LocaleProvider locale="it-IT">
      <ThemeProvider defaultMode="system" defaultTheme="aurora" persistence>
        <Button variant="primary" onPress={() => console.log('ok')}>
          Salva
        </Button>
      </ThemeProvider>
    </LocaleProvider>
  );
}
```

## Tema personalizzato

```ts
import { createTheme } from '@dev-community/ui/theme'; // entry server-safe, senza React/DOM

export const acme = createTheme({
  name: 'acme',
  label: 'Acme Portal',
  extends: 'graphite',
  seeds: { brand: '#0f766e' },
  tokens: { 'radius.md': '0.5rem' },
});
// <ThemeProvider theme={acme} themes={[acme]}>…</ThemeProvider>
```

Il contrasto delle palette personalizzate **non** è garantito automaticamente: verificalo con `contrastRatio()` o con il
Theme Builder del sito di documentazione.

## Punti chiave

- `ThemeProvider` annidabili: ciascuno ha la propria modalità, palette e densità; gli overlay in portal (Dialog, Popover,
  Menu, Tooltip, Drawer, Toast) ereditano il tema del provider di origine.
- Nessun accesso a `window`, `document` o `localStorage` durante l’import. Per SSR senza flash usa `getThemeScript()`
  (compatibile con nonce CSP) oppure i cookie (`getThemePreferencesFromCookie`).
- I testi di sistema sono traducibili tramite `LocaleProvider` (`messages`); RTL tramite proprietà CSS logiche.
- I link della libreria si collegano al router dell’applicazione con `RouterProvider`.
- Ogni modulo `.tsx` compilato include la direttiva `'use client'`; `@dev-community/ui/theme` resta un modulo server.

La documentazione completa (guide, catalogo componenti, Theme Builder) è nel sito `apps/docs` del repository.
