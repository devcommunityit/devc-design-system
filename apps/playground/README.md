# Consumer playground

Consumer React/TypeScript separato per verificare l'integrazione con il
pacchetto **compilato** `@devcommunityit/ui`. Vite risolve la dipendenza da
`node_modules`; la configurazione non contiene alias ai sorgenti della
libreria. Il playground non fa parte dei workspace npm della root.

## Preparare il tarball

Dalla root del repository, crea la build e il pacchetto:

```bash
npm run build:lib
npm pack -w @devcommunityit/ui --pack-destination apps/playground/vendor
```

Poi installa il tarball nel consumer usando il nome/versione generati da npm
pack (nell'esempio corrente `0.1.0`):

```powershell
cd apps\playground
npm install .\vendor\devcommunityit-ui-0.1.0.tgz
npm run dev
```

Apri l'indirizzo stampato da Vite, normalmente `http://localhost:5173`.
Quando cambia la versione del pacchetto, usa il nome effettivo del tarball e
aggiorna la dipendenza `file:` in `package.json` e il lockfile del playground.
Il file `.tgz` è un artefatto generato e non va usato come sostituto dei sorgenti
né pubblicato accidentalmente.

## Cosa verificare

La pagina mostra esempi reali delle integrazioni principali:

- import degli stili pubblici del pacchetto;
- provider di tema, lingua e notifiche;
- cambio light/dark/system e provider di tema annidato;
- componenti di form e azioni;
- overlay in portal con il tema del provider di origine;
- interazioni locali di login, menu account e notifiche.

Il login è deliberatamente simulato: non autentica utenti e non invia richieste.
Nessuna funzionalità richiede un backend.

## Comandi

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

`typecheck` e `build` verificano il consumer indipendente. La verifica
automatica completa del tarball, inclusi installazione temporanea, risoluzione
degli export, tipi, stili e interazioni browser, è disponibile dalla root:

```bash
npm run verify:package
```

Per l'API completa, i peer dependency, l'import CSS e i temi, consulta il
[README del pacchetto UI](../../packages/ui/README.md). Per le istruzioni
generali consulta il [README principale](../../README.md).
