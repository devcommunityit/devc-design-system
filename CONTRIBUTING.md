# Contribuire

La guida completa è la pagina **Guida ai contributi** del sito di documentazione (`npm run dev`, poi `/guide/contribuire`).
Questi sono i punti essenziali.

1. `npm install`, poi `npx playwright install chromium` per i test e2e.
2. Componenti in `packages/ui/src/components/<Nome>/`: `<Nome>.tsx`, `<Nome>.module.css`, test, storie ed esempi,
   più un file `<Nome>.meta.ts` con lo stato reale per la matrice del catalogo.
3. Solo token semantici nei CSS Module, proprietà logiche, testi di sistema da `useMessages` e nessun `any`.
4. I token si modificano solo nella fonte DTCG. Poi rigenera gli output con `npm run tokens`.
5. Prima di aprire una modifica esegui `npm run verify`. Non disattivare controlli e non aggiungere esclusioni ad axe
   senza motivarle in `e2e/fixtures.ts` e nella guida Accessibilità.
6. Aggiorna `packages/ui/CHANGELOG.md` e segui la politica di versionamento descritta nella pagina *Changelog e migrazioni*.
