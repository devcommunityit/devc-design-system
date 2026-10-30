# Changelog

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto adotta il
[Semantic Versioning](https://semver.org/lang/it/).

## [0.1.0] — non pubblicata

Prima versione.

### Aggiunto

- Interfacce AI: `PromptComposer`, `ChatMessage`, `PromptSuggestions`, `SourceList`, `ResponseFeedback`, senza backend o client AI impliciti.
- Gestione siti: `PublishStatus`, `BulkActionBar`, `SeoPreview`, con azioni e persistenza delegate al consumer.
  Nuovi messaggi di sistema nei sette bundle, categorie AI/Gestione siti, esempi condivisi con Storybook e guida con demo locale dichiarata.
- Token primitivi e semantici con un'unica fonte (`src/tokens/source`), generati in CSS custom properties, TypeScript e DTCG.
- Motore dei temi: `createTheme`, `validateTheme`, `parseThemeJson` / `themeToJson` (schema versionato, `schemaVersion: 1`),
  `themeToCss`, preset `aurora`, `lagoon`, `ember`, `graphite`, `ocean`, `forest`, `berry`, `saffron`, `nebula`, modalità light/dark/system, densità comfortable/compact.
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
  npmjs.com finché la licenza resta `UNLICENSED`.

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
