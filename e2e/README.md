# Test end-to-end

Test browser Playwright della build di produzione della documentazione. La
configurazione principale usa Chromium, locale `it-IT`, animazioni ridotte e un
server statico Vite Preview. I test coprono flussi di navigazione, componenti,
temi, overlay, accessibilità automatizzata e layout responsive.

## Esecuzione

Dalla root del repository:

```bash
npx playwright install chromium
npm run build:docs
npm run test:e2e
```

Per eseguire un singolo file:

```bash
npx playwright test e2e/flows.spec.ts
```

Playwright avvia automaticamente `npm run preview -w @devcommunityit/docs` sulla
porta `4173`. Per evitare test contro una build obsoleta, ricompila la docs dopo
aver modificato l'app o la libreria.

## GitHub Pages

La suite separata `e2e-pages/` verifica la build statica sotto il base path,
i deep link, la pagina 404 e Storybook:

```bash
npm run build:pages -- --base /design-system/
npm run test:e2e:pages
```

La build e il server Pages usano lo stesso base path. Per i dettagli sulla
configurazione e sui workflow, consulta il
[README principale](../README.md).

## Interpretare i risultati

- Un test fallito conserva la trace Playwright per l'analisi.
- La suite usa un guard per individuare errori e warning in console.
- Axe verifica automaticamente una parte delle regole di accessibilità, ma
  non dimostra conformità WCAG né sostituisce verifiche manuali con tastiera e
  tecnologie assistive.
- Il test d'integrazione del pacchetto compilato in un consumer isolato è
  distinto da questi test browser: esegui `npm run verify:package` dalla root.
