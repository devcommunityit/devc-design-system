# Sito di documentazione

Applicazione Vite/React del design system. Include documentazione navigabile,
catalogo dei componenti, Theme Builder e showcase interattiva. Il sito importa
`@dev-community/ui` come pacchetto, non dai sorgenti della libreria.

## Avvio e build

Dalla directory principale del repository:

```bash
npm install
npm run dev
npm run build:docs
npm run preview -w @dev-community/docs
```

Il server di sviluppo è disponibile su `http://localhost:5173`; la preview della
build è su `http://localhost:4173`.

Per una build GitHub Pages con base path:

```bash
npm run build:pages -- --base /design-system/
npm run preview:pages -- --base /design-system/
```

La build statica genera deep link, `404.html` e Storybook sotto
`/design-system/storybook/`. Se usi un base path diverso, passalo anche ai test
Pages tramite la variabile `PAGES_BASE`. La pubblicazione è gestita dal workflow Pages
alla radice del repository; questo README non avvia deploy.

## Contenuti

- **Guide**: quick start, installazione, integrazione nei portali, fondamenta
  visive, token, temi, accessibilità, localizzazione/RTL, SSR e Next.js,
  personalizzazione, Figma, troubleshooting, contributi e changelog.
- **Catalogo componenti e pattern**: le descrizioni e gli esempi provengono dai
  metadati dei componenti in `packages/ui`, condivisi con Storybook.
- **Theme Builder**: crea e modifica temi, controlla il contrasto, visualizza
  l'anteprima e importa/esporta JSON o CSS.
- **Showcase**: pagine dimostrative con dati locali deterministici; i flussi di
  autenticazione sono simulazioni e non forniscono un backend.

I testi delle guide sono in italiano. La preferenza lingua della libreria cambia
i messaggi dei componenti; i bundle disponibili e i loro limiti sono descritti
nella guida **Localizzazione e RTL** del sito.

## Struttura

```text
src/
  components/       shell e componenti riutilizzabili della documentazione
  content/          route, metadati e cataloghi
  guides/           guide
  pages/            pagine del catalogo e indice
  showcase/         pagine dimostrative
  theme-builder/    editor visuale dei temi
```

Le route e le pagine statiche sono generate dalla configurazione in `src/` e
dallo script `scripts/build-pages.mjs`. Per aggiornare un esempio di componente,
modifica i metadati o gli esempi nella libreria invece di creare una seconda
fonte divergente nella documentazione.

## Verifiche

Dalla root:

```bash
npm run typecheck -w @dev-community/docs
npm run build:docs
npx playwright test
npm run build:pages -- --base /design-system/
npm run test:e2e:pages
```

La suite Playwright principale richiede la build della documentazione; la suite
Pages usa `/design-system/` per impostazione predefinita e verifica il sito
compilato sotto un sottopercorso. Per tutti
i controlli del repository, consulta il [README principale](../../README.md).
