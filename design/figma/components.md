# Specifiche dei componenti per Figma

Specifiche per costruire in Figma i component set corrispondenti ai componenti React di `@dev-community/ui`.
Le varianti elencate sono quelle **reali** delle props React (verificate sui tipi in `packages/ui/src`); i nomi delle
proprietà Figma coincidono con i nomi delle props.

> Nessun componente Figma è stato creato: questo documento è una specifica da realizzare manualmente
> (vedi [README.md](./README.md)).

## Convenzioni

- **Variabili:** usare solo ruoli semantici (`color/*`), `space/*`, `radius/*`, `density/*`, mai palette tonali.
- **Auto Layout:** tutti i componenti usano Auto Layout; padding e gap legati a variabili `space/*` e `density/*`.
- **Proprietà Figma:**
  - *Variant* per enum (`variant`, `size`, `tone`, `state`);
  - *Boolean* per elementi opzionali (`startIcon`, `description`);
  - *Text* per etichette;
  - *Instance swap* per icone.
- **Stato** (`state`): `default`, `hover`, `pressed`, `focus-visible`, `disabled`; dove pertinente anche `invalid`,
  `selected`, `readonly`, `loading`.
- **Hover e pressed:** overlay del colore del contenuto al `state/hover` (8%) e `state/pressed` (12%).
- **Focus visibile:**
  - anello di 2px `color/focus/ring` con offset 2px;
  - va sempre disegnato come variante `focus-visible`, non come effetto opzionale.
- **Disabled:** testo `color/text/disabled`, sfondo `color/action/disabled`. WCAG 1.4.3 esenta i controlli inattivi
  dal contrasto minimo, ma il controllo deve restare riconoscibile.
- **Densità:** non è una variante dei componenti. Si ottiene cambiando la modalità della collezione `Density`
  (`comfortable` 40px / `compact` 34px per i controlli `md`).
- **Target minimi:** 24×24px (WCAG 2.5.8). I controlli `sm` in densità compatta misurano 28px.
- **RTL:** progettare con padding logici. Le icone direzionali (frecce, chevron) vanno specchiate.

## Azioni

| Componente | Proprietà | Valori | Note |
| --- | --- | --- | --- |
| Button | `variant` | primary, secondary, outline, ghost, danger | |
| | `size` | sm, md, lg | Altezza = `density/control-height-*` |
| | `state` | default, hover, pressed, focus-visible, disabled, loading | `loading`: spinner centrato, etichetta trasparente ma presente |
| | `startIcon`, `endIcon` | boolean + instance swap | Icone 16/20px |
| | `fullWidth` | boolean | |
| IconButton | `variant`, `size`, `state` | come Button | Quadrato; nome accessibile obbligatorio (annotarlo nel componente) |
| ButtonGroup | `orientation` | horizontal, vertical | Bordi adiacenti uniti, raggio solo agli estremi |
| Toggle | `variant` | outline, ghost | |
| | `size` | sm, md, lg | |
| | `selected` | boolean | |
| ToggleGroup | `selectionMode` | single, multiple | Composto di Toggle |
| Toolbar | `orientation` | horizontal, vertical | `variant` plain, surface; gruppi + separatore perpendicolare |
| SplitButton | `variant`, `size` | come Button (senza ghost) | Button + IconButton chevron uniti; `open` boolean con Menu |
| CopyButton | `status` | idle, copied, error | Icona copia/spunta/croce + testo; `iconOnly` boolean |

## Form

Tutti i campi condividono l'anatomia **Field**, costruita in Auto Layout verticale con gap `space/1-5`:

- label;
- indicatore richiesto (testuale, non solo colore);
- controllo;
- descrizione;
- messaggio di errore.

| Componente | Proprietà | Valori |
| --- | --- | --- |
| TextField / Input | `state` | default, hover, focus-visible, invalid, disabled, readonly |
| | `description`, `errorMessage`, `required` | boolean |
| | `startIcon` | boolean + instance swap |
| Textarea | come TextField | altezza variabile |
| PasswordInput | come TextField + `revealed` | boolean (icona occhio) |
| SearchInput | come TextField + `hasValue` | boolean (pulsante cancella) |
| NumberInput | come TextField | pulsanti +/− con target ≥ 24px |
| NativeSelect, Select | come TextField + `open` | boolean (popover con ListBox) |
| Combobox | come Select + `loading`, `empty` | boolean |
| MultiSelect | come Combobox + `chips` | 0, alcuni, overflow |
| Checkbox | `checked` | false, true, indeterminate |
| | `state` | default, hover, focus-visible, invalid, disabled |
| RadioGroup / Radio | `selected` | boolean; `orientation` horizontal, vertical |
| Switch | `selected` | boolean; `state` come Checkbox |
| Slider / RangeSlider | `thumbs` | 1, 2; `state` default, focus-visible, disabled |
| DatePicker, DateRangePicker | `state` come TextField + `open` | segmenti data ≥ 24px di larghezza |
| TimeInput | `hourCycle` | 12, 24 |
| FileUpload | `dragging` | boolean; elenco file con `status` pending, uploading, success, error |
| ColorPicker | `open` | boolean |
| PinInput | `length` 4, 6; `size` sm, md, lg | cella: empty, filled, focus, invalid, disabled; `mask` boolean |
| Rating | `size` sm, md, lg | stella piena/vuota (forma, non solo colore); `preview`, `readonly`, `disabled` |

## Navigazione

| Componente | Proprietà | Valori |
| --- | --- | --- |
| Tabs | `variant` | line, pill |
| | `orientation` | horizontal, vertical |
| | Tab `state` | default, hover, focus-visible, selected, disabled |
| Breadcrumb | `items` | 2–5, con collasso |
| Pagination | `size` | sm, md |
| | item `kind` | page, step, ellipsis; `current` boolean |
| NavigationMenu | `orientation` | horizontal, vertical; item `current` boolean |
| DropdownMenu / Menu | item | default, focus, disabled; `tone` default, danger; con sezione, separatore, sottomenu |
| Stepper | `orientation` | horizontal, vertical; step: complete, current, upcoming |
| BottomNavigation | item | 3–5, `current` boolean |
| CommandPalette | stato | vuoto, risultati, nessun risultato |

## Contenuti e dati

| Componente | Proprietà | Valori |
| --- | --- | --- |
| Card | `variant` | outlined, elevated, filled; `hasLink` boolean (corrisponde a `CardLink`: link nativo esteso a tutta la card); slot media/header/footer |
| Badge | `tone` | neutral, brand, info, success, warning, danger |
| | `variant` | soft, solid, outline |
| | `size` | sm, md |
| Tag (Chip) | `size` | sm, md; `removable`, `selected`, `disabled` boolean |
| Avatar | `size` | xs, sm, md, lg, xl |
| | `shape` | circle, square |
| | `content` | image, initials |
| AvatarGroup | `max` | contatore “+N” |
| Tooltip | `placement` | top, bottom, start, end |
| Popover | `placement` | con/senza freccia |
| Accordion | `variant` | default, plain; item `expanded` boolean |
| Table | `density` | da collezione Density; riga `selected`, `disabled` |
| DataTable | stato | dati, loading, errore, nessun dato, nessun risultato; toolbar filtri; paginazione |
| DescriptionList | `layout` | stacked, inline, grid; `dividers` boolean |
| Timeline | item `tone` | neutral, info, success, warning, danger |
| Statistic | `size` | sm, md, lg; trend su/giù (icona + testo, non solo colore) |
| Calendar | giorno | default, today, selected, range-start/middle/end, disabled, unavailable, focus-visible |
| TreeView | `size` | sm, md; riga: level 1–3, expanded/collapsed/leaf, selected, disabled, con/senza checkbox |
| SortableList | riga | default, focus-visible, dragging; indicatore di rilascio; pulsanti Sposta su/giù |
| RelativeTime | — | testo inline; nessun componente Figma dedicato (usa stile `body-sm`) |

## Feedback

| Componente | Proprietà | Valori |
| --- | --- | --- |
| Alert | `tone` | info, success, warning, danger |
| | `variant` | soft, outline |
| | `dismissible` | boolean |
| Banner | `tone` | come Alert; a tutta larghezza |
| Toast | `tone` | come Alert; con azione e chiusura |
| | `placement` | top-start, top-center, top-end, bottom-start, bottom-center, bottom-end |
| Progress | `tone` | brand, success, warning, danger |
| | `size` | sm, md, lg |
| | `indeterminate` | boolean |
| CircularProgress | `size`, `tone` | come Progress |
| Spinner | `size` | sm, md, lg |
| Skeleton | `shape` | text, rect, circle |
| EmptyState | `size` | sm, md, lg; con/senza azione |
| Meter | `tone` | brand, success, warning, danger; `size` sm, md, lg; con descrizione |

## Overlay

| Componente | Proprietà | Valori |
| --- | --- | --- |
| Dialog | `size` | sm, md, lg, xl, fullscreen |
| | `tone` | default, danger |
| | layout | contenuto lungo con scroll interno |
| AlertDialog | `tone` | default, danger |
| Drawer / Sheet | `placement` | start, end, bottom |

Scrim: `color/overlay/scrim`. Elevazione: `shadow/3` per Dialog e Drawer, `shadow/2` per Popover, Menu e Tooltip.

## Layout e tipografia

| Componente | Proprietà | Valori |
| --- | --- | --- |
| Container | `size` | sm, md, lg, xl, 2xl, prose, full |
| Stack / Inline / Grid | `gap` | 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 (`space/*`) |
| Divider | `orientation` | horizontal, vertical |
| AppShell | `variant` | default, compact; desktop con Sidebar, mobile con Drawer |
| Heading | `size` | display, headline-lg/md/sm, title-lg/md/sm |
| Text | `tone` | primary, secondary, muted, link, danger, success, warning |
| Link | `variant` | inline, standalone |

Gli stili tipografici Figma corrispondono ai ruoli `typography/*` (13 ruoli: display, headline ×3, title ×3,
body ×3, label ×3).

## Pattern

| Pattern | Composizione | Varianti consigliate |
| --- | --- | --- |
| SiteHeader | Header + NavigationMenu (desktop) + IconButton menu + Drawer (mobile) | `viewport` desktop, mobile; `menuOpen` boolean; con/senza UserMenu |
| Footer | Container + gruppi di Link + note legali | desktop (colonne), mobile (impilato) |
| UserMenu | Trigger (Avatar + nome + chevron) + Menu con blocco identità e “Esci” | `showName` always, wide, never; `open` boolean |
| AuthLayout | Pannello centrato con brand, titolo, contenuto, footer | desktop, mobile |
| LoginForm / SignUpForm / PasswordResetForm | Field + Button + Link | `state` default, submitting, error; reset: richiesta, confermata |
| NotificationCenter | IconButton campanella + badge conteggio + Popover con elenco | `unread` 0, alcuni, 99+; `open` boolean; vuoto |

## Esempi di pagina

Da costruire con istanze dei componenti, in frame **desktop 1440px** e **mobile 375px**:

- landing;
- dashboard;
- elenco con DataTable;
- dettaglio;
- form;
- impostazioni;
- account;
- login;
- 404.

Il riferimento per contenuti e composizione è la showcase del sito di documentazione (`/showcase/*`).
