# Changelog

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto adotta il
[Semantic Versioning](https://semver.org/lang/it/).

## [Non rilasciato]

### Modificato

- Scope npm rinominato da `@dev-community/ui` a `@devcommunityit/ui` per pubblicare su GitHub Packages nel repository `devcommunityit/devc-design-system`. Aggiornare gli import e la configurazione `.npmrc` nei progetti consumer.

### Aggiunto

- `VenueMap` (entry `@devcommunityit/ui/widgets`): mappa della sede con embed OpenStreetMap caricato solo dopo il consenso dell’utente, segnaposto statico, indirizzo e link alle indicazioni (OpenStreetMap, Google Maps, Apple Maps). Helper `venueMapEmbedUrl` e `venueMapLinks`.
- `VenueFloorPlan` (entry `@devcommunityit/ui/widgets`): piantina SVG interattiva con aree selezionabili per tipo (sala, palco, stand, ristoro, servizi, ingresso…), piani multipli, marker "Sei qui", aree evidenziate, legenda, pannello dettagli e navigazione spaziale da tastiera.
- Messaggi `venueMap*` e `floorPlan*` in tutte le lingue supportate.

### Modificato

- **Licenza MIT** (© 2026 Dev Community) per tutto il repository: file `LICENSE` nella radice, in `packages/ui` e in
  `packages/mcp` (incluso nei pacchetti pubblicati tramite `files`), campo `"license": "MIT"` nei `package.json`. Il
  controllo `prepublishOnly` ora consente la pubblicazione anche sui registry pubblici.
- **Sito di documentazione bilingue (italiano e inglese)**: lingua iniziale presa dal browser (inglese se non è né italiano né inglese), selettore IT/EN nell'header, scelta salvata nel browser e
  link condivisibili con `?lang=en`. Sono tradotti interfaccia, guide, fondamenta e i metadati di tutti i componenti
  (overlay JSON in `apps/docs/src/i18n/en/components`, verificati con `npm run i18n:check -w @devcommunityit/docs`).
  Gli esempi dal vivo e i template mantengono i contenuti dimostrativi in italiano.
- **Navigazione della documentazione riorganizzata** in cinque aree (Inizia, Fondamenta, Componenti, Pattern, Guide)
  con schede nell'header e sidebar contestuale: categorie raggruppate (Base, Dati e visualizzazione, Prodotto) e
  comprimibili con il numero di pagine, filtro dei componenti e selettore d'area nel menu mobile.

## [0.1.0] — non pubblicata

Prima versione.

### Aggiunto

- Budget di dimensione del bundle con `size-limit` (`packages/ui/.size-limit.json`, script `npm run size`) verificato in
  CI dopo la build: ThemeProvider + Button, set dashboard, entry principale completa, entry `editor`, entry `patterns`,
  entry `widgets`, `styles.css` e `tokens.css`, misurati minificati e gzip, con React escluso.
- Entry point separato `@devcommunityit/ui/patterns` per i pattern di pagina della community
  (`CommunityEventOperations`, `CommunityMembershipAccount`, `CommunityEngagementHub`, `CommunityOrganizerOperations`):
  non fanno parte dell'entry principale, che resta entro il budget di 400 KB gzip.
- Entry point separato `@devcommunityit/ui/widgets` per i widget interattivi più pesanti (`KanbanBoard`, `ImageCropper`,
  `OnboardingTour`, `DiffViewer` con `diffLines`, `FileBrowser`, `SplitPane`), anch'essi fuori dall'entry principale.
- `LocaleProvider` include solo i messaggi italiani e inglesi (`getCoreMessages`); spagnolo, francese, tedesco,
  portoghese e arabo sono opt-in (`messagesEs`, `builtInMessages`, `getDefaultMessages`) e vanno passati con `messages`.
  Così un'app minima risparmia circa 90 KB di sorgente minificata.
- I colori dei preset arrivano al runtime in forma compatta (`PRESET_COLORS_PACKED`) e `createTheme`/`getPreset` li
  decodificano su richiesta. `PRESET_COLORS` resta esportato da `@devcommunityit/ui/theme`. ThemeProvider + Button passa
  da 52,6 a circa 32 KB gzip.
- Storybook: la toolbar della lingua offre italiano, inglese, spagnolo, francese, tedesco, portoghese e arabo (RTL), con
  i messaggi corrispondenti.
- Workflow GitHub Actions `CI` (lint, typecheck, test, verifica del pacchetto, e2e, tarball come artifact) e `Release`
  (pubblicazione su GitHub Packages e GitHub Release con tarball e checksum, da tag `ui-v*`/`mcp-v*` o avvio manuale con
  incremento semver). `publishConfig.registry` impostato su GitHub Packages; `release:pack` accetta `--package mcp`.
- Grafici: `GaugeChart`, `RadarChart`, `HeatmapChart`, `FunnelChart`, `RadialBarChart`, `ScatterChart`, con navigazione da
  tastiera, tabella dati (dove applicabile), supporto `prefers-reduced-motion` e `forced-colors`.
- Prop `appearance` (`'auto' | 'flat' | 'vivid'`, tipo `ChartAppearance`) per tutti i grafici: `vivid` usa gradienti tra
  `--dc-color-data-N` e `--dc-color-accent-default`, forme arrotondate e bagliori; `auto` diventa `vivid` nel look `expressive`.
- Card per dashboard: `GoalCard`, `RankingCard`, `ComparisonCard`, `ActivityCard`; `KpiCard` con prop `variant`
  (`default`, `vivid`, `tinted`). Nuovi messaggi `chartTarget`, `chartConversion`, `chartSeries`, `goalRemaining`, `goalReached`.
- Categoria `community` per siti di community di sviluppatori: `EventCard`, `ArticleCard` (con `ReactionBar`), `PostList`
  (con `PostListItem` e `VoteButton`), `DiscussionList`, `Leaderboard`, `ProfileCard`, `LearningPathCard`, `NewsletterCard`,
  `CtaPanel`, `SectionHeader` e le primitive `DateBadge`, `LiveIndicator`, `AnnouncementPill`, `GradientText`.
- Etichette e badge per siti web: `StageLabel` (Alpha, Beta, Preview, Demo, Sperimentale, Deprecato, In arrivo; chip o banner
  chiudibile), `Ribbon` (corner, bookmark, banner), `IndicatorBadge` (contatore o punto su icone e avatar), `AchievementBadge`
  e `AchievementBadgeGroup` (livelli bronzo/argento/oro/platino, stato bloccato con progresso).
- Social: `SocialLinks` (varianti icon, pill, list; helper `socialNetworks` e `getSocialNetwork`) e `ShareButtons`
  (Web Share API nativa, copia link e URL di condivisione via `getShareUrl`). Icone generiche: nessun logo o colore di marca.
- Entry point separato `@devcommunityit/ui/editor` (basato su Tiptap 3, dipendenze `@tiptap/*` esterne nel bundle e mai
  raggiungibili dall'entry principale): `RichTextEditor` per contenuti di pagina, in modalità `toolbar` (barra classica) o
  `blocks` (menu “/”, bubble menu e azioni sul blocco), con `RichTextContent` per il rendering; `EmailBuilder` a blocchi
  (titolo, testo, pulsante, immagine, divisore, spaziatore, colonne, social, footer) con anteprima desktop/mobile e
  `renderEmailHtml` per esportare HTML compatibile con i client di posta. Categoria `editor` nel catalogo, campo `entry`
  nei metadati e supporto ai subpath nel server MCP. Nuovi messaggi `editor*` e `email*` nei sette bundle.
- 17 nuovi preset di tema (26 in totale): 8 a tinta unica (`ruby`, `tangerine`, `mint`, `sky`, `violet`, `cocoa`, `olive`,
  `lavender`, con seme terziario uguale al brand e gradienti expressive monocromatici) e 9 a gradiente bicolore (`sunset`,
  `borealis`, `citrus`, `candy`, `tropical`, `dusk`, `flame`, `glacier`, `orchid`). Tutti superano le coppie di contrasto in
  chiaro e scuro. Nuovo campo `PRESET_META[name].kind` (`'solid' | 'gradient' | 'auto'`, tipo `PresetKind`); la serie 2 dei
  grafici (`color.data.2`) usa una palette dedicata che ruota la tonalità quando il terziario coincide con il brand.
- `Skeleton` con prop `animation` (`'pulse' | 'wave' | 'none'`) e `radius`; nuovo `SkeletonGroup` (`aria-busy`, annuncio
  di caricamento e sostituzione con il contenuto reale) e preset `SkeletonText`, `SkeletonAvatar`, `SkeletonCard`,
  `SkeletonList`, `SkeletonTable`, `SkeletonKpi`, `SkeletonChart` (bar, line, area, donut), `SkeletonForm` e `SkeletonPage`.
- `CodeBlock` con prop `variant` (`'default' | 'window'`, tipo `CodeBlockVariant`) per la cornice a finestra con titolo.
- Nuovi messaggi nei sette bundle per eventi, lettura, reazioni, voti, newsletter, live, fasi di rilascio, condivisione e
  traguardi (`eventSeats`, `readingTime`, `votes`, `stageBeta`, `shareOn`, `achievementEarned`, …).
- Interfacce AI: `PromptComposer`, `ChatMessage`, `PromptSuggestions`, `SourceList`, `ResponseFeedback`, senza backend o client AI impliciti.
- Gestione siti: `PublishStatus`, `BulkActionBar`, `SeoPreview`, con azioni e persistenza delegate al consumer.
  Nuovi messaggi di sistema nei sette bundle, categorie AI/Gestione siti, esempi condivisi con Storybook e guida con demo locale dichiarata.
- Token primitivi e semantici con un'unica fonte (`src/tokens/source`), generati in CSS custom properties, TypeScript e DTCG.
- Motore dei temi: `createTheme`, `validateTheme`, `parseThemeJson` / `themeToJson` (schema versionato, `schemaVersion: 1`),
  `themeToCss`, 26 preset (`aurora`, `lagoon`, `ember`, `graphite`, `ocean`, `forest`, `berry`, `saffron`, `nebula`, `ruby`, `tangerine`, `mint`, `sky`, `violet`, `cocoa`, `olive`, `lavender`, `sunset`, `borealis`, `citrus`, `candy`, `tropical`, `dusk`, `flame`, `glacier`, `orchid`), modalità light/dark/system, densità comfortable/compact.
- `ThemeProvider` con provider annidabili, persistenza configurabile (localStorage, cookie o adattatore personalizzato)
  e script anti-flash per SSR compatibile con CSP.
- Stile (`look`) indipendente da palette e densità: `standard` (predefinito) ed `expressive` ispirato a Material 3,
  con controlli a pillola, contenitori più arrotondati e riempimenti bicolore. Nuove prop `look` / `defaultLook` /
  `onLookChange` di `ThemeProvider`, `useTheme().look` / `setLook`, chiave di persistenza `look`, attributo
  `data-dc-look` e opzione `getThemeScript({ defaultLook })`. Token `--dc-look-*` e `--dc-gradient-*` (disattivati con
  `forced-colors`), esportazioni `LOOK_TOKENS`, `LOOK_NAMES`, `DEFAULT_LOOK`, `GRADIENT_TOKENS`.
- Palette terziaria (seme `seeds.tertiary`, altrimenti brand ruotato di 60°) e ruoli `color.accent.default`,
  `accent.foreground`, `accent.container`, `accent.container-foreground`, inclusi nel gate di contrasto.
- `Heading` con prop `gradient` (testo bicolore, solo se supportato) e `Card` con variante `accent` (cornice a gradiente).
- `LocaleProvider` con messaggi sostituibili e supporto RTL. Bundle inclusi: `messagesIt`, `messagesEn`, `messagesEs`,
  `messagesFr`, `messagesDe`, `messagesPt` (uso brasiliano) e `messagesAr` (RTL), raccolti in `builtInMessages` e scelti da
  `getDefaultMessages` in base alla lingua della locale (fallback inglese). Le traduzioni es/fr/de/pt/ar sono prime versioni da
  far rivedere a madrelingua. I plurali usano `Intl.PluralRules`.
- Errori di validazione dei temi localizzabili: `ThemeIssue.params` (dati strutturati) e `formatThemeIssue(issue, messages)`
  con la nuova chiave `messages.themeIssue`; `ThemeIssue.message` resta in inglese per log e sviluppatori.
- `getInitials(name, locale?)` e `Avatar` usano la locale del provider per le maiuscole (es. `i` → `İ` in turco).
- Grafici SVG senza dipendenze (categoria `charts`): `Sparkline`, `LineChart` (linea/area), `BarChart` (verticale/
  orizzontale, affiancato/impilato), `DonutChart` e `ChartLegend`. Navigazione da tastiera tra i punti con annuncio
  `aria-live`, tabella dati accessibile, tratteggi e marcatori per non affidarsi al solo colore. Nuovi ruoli colore
  categoriali `color.data.1`…`color.data.6` (`--dc-color-data-N`) generati dal brand con HCT e inclusi nel gate di
  contrasto (3:1 su `surface.default`).
- Componenti per dashboard (categoria `dashboard`): `HeroCard`, `PromoBanner` (banner interamente cliccabile, link o
  pulsante), `KpiCard` (con sparkline) e `QuickAction`. `NavList` per menu verticali/orizzontali con o senza icone,
  gruppi espandibili e rail compattabile. Nuove chiavi in `messages`: `chartData`, `showChartData`, `hideChartData`,
  `chartCategory`, `chartValue`, `chartTotal`, `chartKeyboardHint`, `chartSummary`, `expandNavigation`, `collapseNavigation`.
- Componenti di layout, tipografia, azioni, navigazione, form, selettori di date, dati, feedback e overlay.
- Pattern: `SiteHeader` (con navigazione mobile), `UserMenu` (menu dell'utente autenticato), `AuthLayout`, `LoginForm`, `SignUpForm`, `PasswordResetForm`; `Footer` con colonne e variante compatta.
- Componenti aggiuntivi: `Toolbar` (con `ToolbarGroup` e `ToolbarSeparator`), `SplitButton`, `CopyButton` con l'hook
  `useCopyToClipboard` (usato anche da `CodeBlock`), `Meter`, `PinInput`, `Rating`, `TreeView`/`TreeViewItem`,
  `SortableList` (trascinamento più pulsanti Sposta su/giù), `RelativeTime` (`Intl.RelativeTimeFormat`) e il pattern
  `NotificationCenter`. Nuove chiavi in `messages`: `copyFailed`, `moreActions`, `pinDigit`, `ratingValue`, `moveUp`,
  `moveDown`, `itemMoved`, `notificationsUnread`, `markAllRead`, `markAsRead`, `unread`, `noNotifications`.
- Distribuzione: le dichiarazioni `.d.ts` usano specificatori `.js` espliciti e non importano CSS, quindi sono risolvibili
  con `moduleResolution` `node16`/`nodenext` oltre che `bundler`; `npm run lint:package` (publint + arethetypeswrong),
  `npm run release:pack` (tarball con checksum in `releases/`) e controllo `prepublishOnly` che blocca la pubblicazione su
  npmjs.com se la licenza non è dichiarata (`UNLICENSED`).

- **Selettori di data e ora**: nuovo `DateTimePicker` (un solo campo e un solo popover con calendario, elenco orari a passo `timeStep`, `isTimeUnavailable`, pulsanti “Adesso”/“Fatto”, fuso preservato con `ZonedDateTime`) e nuovo `TimePicker` (campo orario con elenco di slot, `step`, limiti, `isClearable`). `DatePicker` e `DateRangePicker` ottengono scorciatoie (`presets`, anche `'default'`), `isClearable` e selettori di mese/anno (`showMonthYearPicker`, disponibile anche su `Calendar`/`RangeCalendar`). Nuove chiavi i18n (`today`, `now`, `done`, `chooseTime`, `timeSlots`, …) in tutte le lingue; esportati anche `now` e `parseDateTime`.
- **Stati di caricamento**: prop `isLoading` su KpiCard, ProfileCard, ArticleCard, EventCard, PostList, DiscussionList, Leaderboard (con `loadingRows`): mostrano uno skeleton della stessa forma con `aria-busy` e testo «Caricamento…» non live, mantenendo className/style. Nuovi preset `SkeletonProfile`, `SkeletonComment` (thread/feed con risposte) e `SkeletonKanban`. Nuova guida «Stati di caricamento».

### Note

- Le etichette di `Button`, `LinkButton`, `IconButton` e `Toggle` restano su una riga finché c'è spazio e vanno a capo invece di
  uscire dal contenitore (testo ingrandito, contenitori stretti); i gruppi segmentati (`ButtonGroup`/`ToggleGroup` con `attached`)
  vanno a capo solo se non c'è spazio.
- L'header di `AppShell` dispone le azioni su una seconda riga quando non entrano accanto al marchio.
- Dialog, Drawer, AlertDialog, CommandPalette, Tooltip, Popover e la regione dei Toast impostano `dir` e `lang` del
  `LocaleProvider` più vicino: un `LocaleProvider` interno al `ThemeProvider` viene rispettato anche nei portal.
- `Form` ricalcola la validazione nativa dopo il rendering di React a ogni modifica, così gli errori mostrati
  si aggiornano senza un secondo invio.
- Le classi interne generate dai CSS Modules non fanno parte dell'API pubblica; usare `className`, `style`,
  gli attributi `data-*` documentati e i token.
