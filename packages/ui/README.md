# @dev-community/ui

Design system React/TypeScript per siti pubblici, portali e dashboard: token, temi (light/dark/system, 9 preset, temi
personalizzati), componenti accessibili basati su React Aria e pattern pronti (header, footer, menu utente, autenticazione).

> **Licenza**: non ancora definita (`"license": "UNLICENSED"`, nessun diritto concesso). La scelta spetta al proprietario del
> progetto; `prepublishOnly` blocca la pubblicazione su npmjs.com finché la licenza non viene scelta.

## Requisiti

- React e React DOM `^18.3 || ^19` (peer dependencies).
- Bundler con supporto a ESM e import di file CSS (verificato con Vite; Next.js documentato).
- Pacchetto solo ESM; tipi validi con `moduleResolution` `bundler`, `node16` e `nodenext`.

## Installazione

Da tarball (distribuzione interna, nessun registry):

``bash
# nel repository del design system: build + publint + attw + tarball con checksum
npm run release:pack
# nel progetto consumer
npm install ../design-system/releases/dev-community-ui-0.1.0.tgz
``

Da registry privato (GitHub Packages, Azure Artifacts, Verdaccio…), con `.npmrc` nel progetto consumer:

``ini
@dev-community:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
``

``bash
npm install @dev-community/ui
``

Per pubblicare su un registry privato impostare `publishConfig.registry` in questo `package.json`, poi
`npm version <patch|minor|major> -w @dev-community/ui` e `npm publish -w @dev-community/ui`. Il token non va mai committato.

## Stili

Importa il foglio di stile **una sola volta**, nel punto d’ingresso dell’applicazione:

``ts
import '@dev-community/ui/styles.css';   // token + stili dei componenti (obbligatorio)
import '@dev-community/ui/reset.css';    // opzionale: reset minimo, opt-in
``

Tutte le classi e le variabili usano il prefisso `dc` (`.dc-…`, `--dc-…`). `styles.css` non contiene selettori globali
su `html`, `body` o `*`: il reset è separato e facoltativo. Tailwind non è richiesto.

Altri export: `@dev-community/ui/tokens.css` (solo variabili), `@dev-community/ui/tokens.json` (token in formato DTCG).

## Esempio minimo

``tsx
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
``

## Tema personalizzato

``ts
import { createTheme } from '@dev-community/ui/theme'; // entry server-safe, senza React/DOM

export const acme = createTheme({
  name: 'acme',
  label: 'Acme Portal',
  extends: 'graphite',
  seeds: { brand: '#0f766e' },
  tokens: { 'radius.md': '0.5rem' },
});
// <ThemeProvider theme={acme} themes={[acme]}>…</ThemeProvider>
``

Il contrasto delle palette personalizzate **non** è garantito automaticamente: verificalo con `contrastRatio()` o con il
Theme Builder del sito di documentazione.

## Stile espressivo (Material 3 / Gemini)

Lo stile (`look`) è indipendente da palette e densità. `standard` è il predefinito; `expressive` usa controlli a
pillola, contenitori più arrotondati e riempimenti bicolore brand → terziario sulle azioni primarie e sugli stati
selezionati. Il preset `nebula` offre un accoppiamento blu → magenta in stile Gemini.

```tsx
<ThemeProvider defaultTheme="nebula" defaultLook="expressive">
  <Heading level={1} gradient>Titolo bicolore</Heading>
  <Card variant="accent">Cornice con gradiente</Card>
</ThemeProvider>
```

Con `forced-colors` i gradienti sono disattivati; nei browser senza interpolazione `in oklch` resta il colore pieno.
Lo stile si persiste come le altre preferenze (`persistence={{ keys: ['look'] }}`) e `getThemeScript({ defaultLook })`
lo applica prima del primo paint.

## Punti chiave

- `ThemeProvider` annidabili: ciascuno ha la propria modalità, palette, densità e stile; gli overlay in portal (Dialog, Popover,
  Menu, Tooltip, Drawer, Toast) ereditano il tema del provider di origine.
- Nessun accesso a `window`, `document` o `localStorage` durante l’import. Per SSR senza flash usa `getThemeScript()`
  (compatibile con nonce CSP) oppure i cookie (`getThemePreferencesFromCookie`).
- I testi di sistema sono traducibili tramite `LocaleProvider` (`messages`), con bundle inclusi per it, en, es, fr, de, pt
  (Brasile) e ar; RTL tramite proprietà CSS logiche.
- I link della libreria si collegano al router dell’applicazione con `RouterProvider`.
- Ogni modulo `.tsx` compilato include la direttiva `'use client'`; `@dev-community/ui/theme` resta un modulo server.

La documentazione completa (guide, catalogo componenti, Theme Builder) è nel sito `apps/docs` del repository.
