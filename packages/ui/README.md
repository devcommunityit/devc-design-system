# @devcommunityit/ui

Design system React/TypeScript per siti pubblici, portali e dashboard: token, temi (light/dark/system, 26 preset tra tinta unica e gradiente bicolore, temi
personalizzati), componenti accessibili basati su React Aria e pattern pronti (header, footer, menu utente, autenticazione).

> **Licenza**: [MIT](LICENSE), © 2026 Dev Community. Puoi usare, modificare e ridistribuire la libreria anche in progetti
> commerciali, mantenendo l'avviso di copyright e il testo della licenza.

## Interfacce AI e gestione siti

- AI: `PromptComposer`, `ChatMessage`, `PromptSuggestions`, `SourceList`, `ResponseFeedback`, `AIToolCall`.
- Gestione contenuti: `PublishStatus`, `BulkActionBar`, `SeoPreview`.

Sono componenti UI senza client AI o richieste di rete implicite. Usa `onSend`, `onStop`, `onAction` e `onChange`
per collegare servizi e persistenza del consumer. I messaggi di sistema sono localizzati nei sette bundle esistenti.
`ChatMessage` rende testo o ReactNode, senza inserire HTML o interpretare Markdown. `PublishStatus` non pubblica contenuti
e `SeoPreview` non modifica metadati né garantisce ranking nei motori di ricerca.

Il sito documenta le API e offre esempi condivisi con Storybook e una guida **AI e gestione contenuti**.

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
npm install ../design-system/releases/devcommunityit-ui-0.1.0.tgz
``

Da GitHub Packages (pubblicato dal workflow `Release`), con `.npmrc` nel progetto consumer e un token con
permesso `read:packages`:

```ini
@devcommunityit:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

```bash
npm install @devcommunityit/ui          # ultima stabile
npm install @devcommunityit/ui@next     # anteprima (prerelease)
```

Ogni GitHub Release allega anche il tarball con checksum, installabile senza registry con
`npm install ./devcommunityit-ui-<versione>.tgz`.

Per rilasciare: *Actions → Release → Run workflow* (pacchetto + incremento semver), oppure aggiorna `version` e
invia un tag `ui-v<versione>`. Dettagli nella guida *Installazione* del sito. Il token non va mai committato.

## Stili

Importa il foglio di stile **una sola volta**, nel punto d’ingresso dell’applicazione:

``ts
import '@devcommunityit/ui/styles.css';   // token + stili dei componenti (obbligatorio)
import '@devcommunityit/ui/reset.css';    // opzionale: reset minimo, opt-in
``

Tutte le classi e le variabili usano il prefisso `dc` (`.dc-…`, `--dc-…`). `styles.css` non contiene selettori globali
su `html`, `body` o `*`: il reset è separato e facoltativo. Tailwind non è richiesto.

Altri export: `@devcommunityit/ui/tokens.css` (solo variabili), `@devcommunityit/ui/tokens.json` (token in formato DTCG).

## Esempio minimo

``tsx
import '@devcommunityit/ui/styles.css';
import { ThemeProvider, LocaleProvider, Button } from '@devcommunityit/ui';

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
import { createTheme } from '@devcommunityit/ui/theme'; // entry server-safe, senza React/DOM

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

## Grafici e dashboard

```tsx
import { BarChart, KpiCard, NavList } from '@devcommunityit/ui';

<KpiCard label="Ordini" value={1312} trend={{ direction: 'up', value: '+4%' }} sparkline={[1180, 1220, 1250, 1290, 1312]} />
<BarChart
  title="Ordini per trimestre"
  categories={['T1', 'T2', 'T3', 'T4']}
  series={[{ id: 'nord', label: 'Nord', data: [120, 140, 135, 160] }]}
  layout="stacked"
/>
```

- Grafici SVG senza dipendenze: `Sparkline`, `LineChart` (linea/area), `BarChart` (verticale/orizzontale, affiancato/impilato),
  `DonutChart`, `ChartLegend`. Colori dai ruoli `--dc-color-data-1…6`, più tratteggi e marcatori per serie; navigazione da
  tastiera con annuncio `aria-live` e tabella dati accessibile. Niente zoom, assi temporali o curve.
- Dashboard: `HeroCard`, `PromoBanner` (l'intera superficie è un link o un pulsante), `KpiCard`, `QuickAction`.
- `NavList`: menu verticale od orizzontale, con o senza icone, gruppi espandibili e rail compattabile con tooltip.

## Nuovi componenti per contenuti e workflow

- `FilterBar` compone filtri controllati e viste salvate; la persistenza e l'applicazione delle viste restano al consumer.
- `KanbanBoard` supporta drag & drop tra colonne, riordino interno e pulsanti alternativi. Con `showStatusSelect`
  ogni card offre anche un selettore di stato. La colonna di appartenenza è lo stato della card: salva `onColumnsChange`
  nel consumer; `onCardMove` identifica la card e le posizioni effettivamente coinvolte. Il template
  `/showcase/kanban` mostra un workflow completo con cinque colonne e riepilogo attività.
- `FileManager` presenta file selezionabili e azioni fornite dal consumer; `FileBrowser` aggiunge cartelle, breadcrumb
  e anteprime. Nessuno dei due esegue upload o richieste di rete proprie.
- `MentionInput` e `MentionTextarea` suggeriscono menzioni `@handle` e, se configurati, hashtag da liste locali.
- `SplitPane` ridimensiona due pannelli con puntatore o tastiera.
- `Agenda`, `EventCalendar` e `PricingTable` coprono agenda, calendario giorno/settimana/mese e confronto dei piani.
  Il calendario usa `CalendarDate` e considera inclusiva la data finale di un evento.
- `FormWizard` gestisce passaggi, validazione anche asincrona e conclusione; i valori dei campi restano al consumer,
  perché il contenuto dei passaggi non attivi viene smontato.
- `CommentThread` mostra commenti annidati con risposte e reazioni; `DiffViewer` confronta testi riga per riga in
  vista unificata o affiancata, con un limite esplicito alla dimensione del confronto.
- `ImageGallery` apre un visualizzatore navigabile da tastiera; `ImageCropper` seleziona un rettangolo con puntatore
  o campi numerici e restituisce un Blob. Per immagini remote il server deve consentire la lettura del canvas via CORS;
  `crossOrigin` usa `anonymous` per impostazione iniziale e le credenziali solo su richiesta.
- `OnboardingTour` evidenzia elementi esistenti e guida tra passaggi opzionali; la persistenza del progresso resta
  all'applicazione.
- `PermissionMatrix`, `NotificationPreferences` e `PrivacyPreferences` raccolgono scelte senza salvarle implicitamente.
  Le preferenze privacy facoltative partono disattivate: l'applicazione gestisce informativa, consenso e persistenza.
  `PermissionMatrix` è solo un'interfaccia: i controlli di autorizzazione devono essere applicati sul server.
- `AIToolCall` rende visibili stato, dettagli e approvazione umana per un'operazione dell'assistente; non esegue tool.

`ArticleCard` accetta una copertina immagine con testo alternativo esplicito, oltre al contenuto personalizzato `cover`:

```tsx
<ArticleCard
  title="Progettare componenti accessibili"
  image={{ src: '/images/accessibility.jpg', alt: 'Interfaccia mostrata su un portatile' }}
/>
```

## Editor WYSIWYG

```tsx
import { RichTextEditor, EmailBuilder, renderEmailHtml } from '@devcommunityit/ui/editor';

<RichTextEditor label="Articolo" variant="blocks" onChange={({ html }) => save(html)} />
<EmailBuilder aria-label="Newsletter" onExport={(html) => send(html)} />
```

- Gli editor vivono nell'entry `@devcommunityit/ui/editor`: Tiptap viene caricato solo da chi lo importa.
- `RichTextEditor`: modalità `toolbar` (barra classica) o `blocks` (stile Notion, con menu “/”). L'HTML salvato va
  sanificato lato server prima di mostrarlo con `RichTextContent`.
- `EmailBuilder`: documento JSON a blocchi, anteprima desktop/mobile e `renderEmailHtml(doc)` per HTML a tabelle con stili
  inline, compatibile con i principali client di posta.

## Pattern di pagina della community

```tsx
import { CommunityEventOperations, CommunityEngagementHub } from '@devcommunityit/ui/patterns';
```

- `CommunityEventOperations`, `CommunityMembershipAccount`, `CommunityEngagementHub` e `CommunityOrganizerOperations`
  vivono nell'entry `@devcommunityit/ui/patterns`, così le app che non li usano non li includono nel bundle.

## Widget interattivi

```tsx
import { KanbanBoard, ImageCropper, SplitPane } from '@devcommunityit/ui/widgets';
```

- `KanbanBoard`, `ImageCropper`, `OnboardingTour`, `DiffViewer` (con `diffLines`), `FileBrowser` e `SplitPane` vivono
  nell'entry `@devcommunityit/ui/widgets`, separata dall'entry principale per contenerne il peso.

## Punti chiave

- `ThemeProvider` annidabili: ciascuno ha la propria modalità, palette, densità e stile; gli overlay in portal (Dialog, Popover,
  Menu, Tooltip, Drawer, Toast) ereditano il tema del provider di origine.
- Nessun accesso a `window`, `document` o `localStorage` durante l’import. Per SSR senza flash usa `getThemeScript()`
  (compatibile con nonce CSP) oppure i cookie (`getThemePreferencesFromCookie`).
- I testi di sistema sono traducibili tramite `LocaleProvider` (`messages`), con bundle inclusi per it, en, es, fr, de, pt
  (Brasile) e ar; RTL tramite proprietà CSS logiche.
- I link della libreria si collegano al router dell’applicazione con `RouterProvider`.
- Ogni modulo `.tsx` compilato include la direttiva `'use client'`; `@devcommunityit/ui/theme` resta un modulo server.

La documentazione completa (guide, catalogo componenti, Theme Builder) è nel sito `apps/docs` del repository.
