# Design token e Figma

> **Stato reale:** nessun file Figma è stato creato. Nell'ambiente di sviluppo non era disponibile alcuno strumento
> autorizzato con capacità di scrittura su Figma. Questa cartella contiene token esportati e specifiche: **non è una
> libreria Figma nativa** e non esiste sincronizzazione bidirezionale tra codice e Figma.

## Contenuto

| Percorso | Contenuto | Generato da |
| --- | --- | --- |
| `tokens.dtcg.json` | Tutti i token in formato [W3C Design Tokens (DTCG)](https://www.designtokens.org/tr/drafts/format/): `base`, `density`, `palette`, `color` (ruoli per preset × schema) | `npm run tokens` |
| `tokens-studio/` | Gli stessi token divisi in set per [Tokens Studio for Figma](https://tokens.studio/): `base`, `density/*`, `palette/*`, `scheme/*`, più `$themes.json` e `$metadata.json` | `npm run tokens` |
| `components.md` | Specifiche di componenti, varianti, proprietà e stati da costruire in Figma | scritto a mano, allineato alle props React |

I file JSON sono **output generati** da `packages/ui/tokens/*` tramite `packages/ui/scripts/build-tokens.mjs`. Non
modificarli a mano: cambia la sorgente e rigenera con `npm run tokens`.

## Struttura dei set (Tokens Studio)

| Set | Contiene | Esempio |
| --- | --- | --- |
| `base` | Tipografia, spaziature, raggi, bordi, ombre, motion, z-index, contenitori | `space.4` = `1rem` |
| `density/comfortable`, `density/compact` | Altezze e padding dei controlli | `density.control-height-md` = `2.5rem` / `2.125rem` |
| `palette/aurora`, `lagoon`, `ember`, `graphite` | Palette tonali (0–100) di brand, neutral, neutral-variant e feedback | `palette.brand.40` |
| `scheme/light`, `scheme/dark` | Ruoli semantici come **alias** delle palette | `color.text.primary` = `{palette.neutral.10}` |

`$themes.json` definisce 16 temi (4 preset × 2 schemi × 2 densità), ad esempio `aurora / dark / compact`. In ogni tema
la palette è marcata `source` (risolve gli alias, non diventa variabile), mentre `base`, `density` e `scheme` sono
`enabled`.

## Importazione con Tokens Studio

1. Installa il plugin Tokens Studio for Figma in un **nuovo file** (non sovrascrivere librerie esistenti).
2. Scegli una sorgente: sincronizzazione Git (puntando a `design/figma/tokens-studio`, modalità multi-file) oppure
   caricamento manuale dei file JSON.
3. Verifica che l'ordine dei set corrisponda a `$metadata.json`.
4. Apri **Themes** e controlla che i 16 temi siano presenti.
5. Usa **Export to Figma → Variables** (o "Create variables") selezionando i temi: Tokens Studio crea collezioni e
   modalità. Una configurazione tipica:
   - collezione `Scheme` con modalità `light` / `dark` per i ruoli `color.*`;
   - collezione `Palette` con una modalità per preset (aurora, lagoon, ember, graphite);
   - collezione `Density` con `comfortable` / `compact`;
   - `base` come collezione a modalità singola.
6. Crea gli stili tipografici dai token `typography.*` (dimensione, interlinea, peso, spaziatura).
7. Crea gli effect style per `shadow.1`–`shadow.4`.

La mappatura esatta tra temi Tokens Studio e collezioni/modalità di Figma dipende dalla versione e dal piano del plugin:
verifica il risultato prima di pubblicare la libreria del team.

### Alternativa senza plugin

Il file `tokens.dtcg.json` usa il formato DTCG (`$type`, `$value`, alias `{gruppo.token}`) e può essere letto da altri
importatori DTCG o da script basati sulla Figma Variables REST API (richiede un piano Enterprise per la scrittura). Non è
incluso alcuno script di questo tipo.

## Mapping dei nomi

Un unico nome per token, con la stessa gerarchia in codice e in design:

| Token (DTCG / Figma) | CSS custom property | TypeScript |
| --- | --- | --- |
| `color.text.primary` | `--dc-color-text-primary` | `colorVar('text.primary')` |
| `color.surface.default` | `--dc-color-surface-default` | `colorVar('surface.default')` |
| `color.action.primary` | `--dc-color-action-primary` | `colorVar('action.primary')` |
| `color.border.subtle` | `--dc-color-border-subtle` | `colorVar('border.subtle')` |
| `color.feedback.danger` | `--dc-color-feedback-danger` | `colorVar('feedback.danger')` |
| `space.4` | `--dc-space-4` | `tokenVar('space.4')` |
| `radius.md` | `--dc-radius-md` | `tokenVar('radius.md')` |
| `typography.body-md.size` | `--dc-typography-body-md-size` | `tokenVar('typography.body-md.size')` |
| `density.control-height-md` | `--dc-density-control-height-md` | `tokenVar('density.control-height-md')` |

Regola: `--dc-` + percorso con i punti sostituiti da trattini. In Figma i gruppi diventano cartelle delle variabili
(`color/text/primary`).

Le palette tonali (`palette.*`) sono primitive: in Figma servono solo come sorgente degli alias. I componenti devono
usare esclusivamente i ruoli semantici (`color.*`), come nel codice.

## Cosa resta da costruire manualmente in Figma

- Componenti e component set con varianti, proprietà e Auto Layout secondo [`components.md`](./components.md).
- Stati interattivi (hover, pressed, focus): nel codice sono overlay calcolati (`color-mix` con i token `state.*`);
  in Figma vanno resi come varianti con un layer di overlay alla stessa opacità.
- Icone: la libreria usa [Lucide](https://lucide.dev/) (licenza ISC); in Figma si può usare il plugin o il kit Lucide.
- Esempi di pagina desktop e mobile, partendo dai template della showcase (`/showcase` nel sito di documentazione).
- Pubblicazione come libreria del team.

## Aggiornamenti

Dopo una modifica ai token: `npm run tokens`, commit dei JSON rigenerati, poi in Tokens Studio "Pull from Git" e
aggiornamento delle variabili. Le modifiche fatte in Figma **non** tornano nel codice: la sorgente resta
`packages/ui/tokens`.
