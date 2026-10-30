# Changelog

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto adotta il
[Semantic Versioning](https://semver.org/lang/it/).

## [0.1.0] — non pubblicata

Prima versione.

### Aggiunto

- Token primitivi e semantici con un'unica fonte (`src/tokens/source`), generati in CSS custom properties, TypeScript e DTCG.
- Motore dei temi: `createTheme`, `validateTheme`, `parseThemeJson` / `themeToJson` (schema versionato, `schemaVersion: 1`),
  `themeToCss`, preset `aurora`, `lagoon`, `ember`, `graphite`, `ocean`, `forest`, `berry`, `saffron`, modalità light/dark/system, densità comfortable/compact.
- `ThemeProvider` con provider annidabili, persistenza configurabile (localStorage, cookie o adattatore personalizzato)
  e script anti-flash per SSR compatibile con CSP.
- `LocaleProvider` con messaggi italiani e inglesi sostituibili e supporto RTL.
- Componenti di layout, tipografia, azioni, navigazione, form, selettori di date, dati, feedback e overlay.
- Pattern: `SiteHeader` (con navigazione mobile), `UserMenu` (menu dell'utente autenticato), `AuthLayout`, `LoginForm`, `SignUpForm`, `PasswordResetForm`; `Footer` con colonne e variante compatta.
- Componenti aggiuntivi: `Toolbar` (con `ToolbarGroup` e `ToolbarSeparator`), `SplitButton`, `CopyButton` con l'hook
  `useCopyToClipboard` (usato anche da `CodeBlock`), `Meter`, `PinInput`, `Rating`, `TreeView`/`TreeViewItem`,
  `SortableList` (trascinamento più pulsanti Sposta su/giù), `RelativeTime` (`Intl.RelativeTimeFormat`) e il pattern
  `NotificationCenter`. Nuove chiavi in `messages`: `copyFailed`, `moreActions`, `pinDigit`, `ratingValue`, `moveUp`,
  `moveDown`, `itemMoved`, `notificationsUnread`, `markAllRead`, `markAsRead`, `unread`, `noNotifications`.

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
