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
6. Aggiorna `packages/ui/CHANGELOG.md` (sezione `## [Non rilasciato]`) e segui la politica di versionamento descritta
   nella pagina *Changelog e migrazioni*.
7. I rilasci si fanno con il workflow **Release** (*Actions → Release → Run workflow*, oppure un tag `ui-v<versione>` /
   `mcp-v<versione>`): pubblica su GitHub Packages e crea la GitHub Release con il tarball. Il workflow **CI** gira su
   ogni pull request e allega i tarball come artifact per provarli in un progetto React.
8. Il sito di documentazione è in italiano e inglese. Dopo aver aggiunto o modificato un `*.meta.ts` esegui
   `npm run i18n:extract -w @devcommunityit/docs`, traduci i campi nuovi in `apps/docs/src/i18n/en/components/` e verifica
   con `npm run i18n:check -w @devcommunityit/docs`. Le guide inglesi sono in `apps/docs/src/guides/en/`.

## Licenza

Il progetto è distribuito con licenza [MIT](LICENSE). Contribuendo accetti che il tuo codice sia rilasciato con la stessa
licenza. Non aggiungere dipendenze con licenze incompatibili senza discuterne prima.
