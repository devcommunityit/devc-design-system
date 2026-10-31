import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: [
    'RichTextEditor',
    'RichTextEditorProps',
    'RichTextEditorValue',
    'RichTextEditorVariant',
    'RichTextContent',
    'RichTextContentProps',
    'isSafeRichTextUrl',
    'RichTextHeadingLevel',
    'RichTextImageUploadResult',
    'RichTextEditorFeatures',
    'RichTextFeature',
    'RichTextEditorInstance',
    'RichTextJSON',
  ],
  name: 'RichTextEditor',
  slug: 'rich-text-editor',
  category: 'editor',
  entry: 'editor',
  summary:
    'Editor WYSIWYG per il contenuto delle pagine basato su Tiptap: toolbar classica oppure modalità a blocchi in stile Notion con menu “/”, bubble menu e maniglia dei blocchi. Distribuito dall’entry separato @dev-community/ui/editor; RichTextContent mostra l’HTML salvato con la stessa tipografia.',
  whenToUse: [
    'Scrivere articoli, pagine, descrizioni di eventi o post con titoli, liste, tabelle, immagini e link.',
    'Commenti o note con formattazione leggera (disattiva le funzionalità non necessarie con `features`).',
    'Mostrare in sola lettura contenuto già salvato con RichTextContent.',
  ],
  whenNotToUse: [
    'Testo semplice o multilinea senza formattazione: usa TextArea.',
    'Codice sorgente: usa un editor di codice dedicato.',
    'Email HTML: usa EmailBuilder, che produce markup compatibile con i client di posta.',
    'Bundle critici: l’editor carica Tiptap/ProseMirror (importalo solo nelle pagine che servono, eventualmente con lazy()).',
  ],
  props: [
    {
      name: 'variant',
      type: "'toolbar' | 'blocks'",
      default: "'toolbar'",
      description:
        'Toolbar fissa (sticky) sopra il testo, oppure editor a blocchi con menu “/”, bubble menu sulla selezione e maniglia dei blocchi.',
    },
    {
      name: 'value / defaultValue',
      type: 'string | RichTextJSON',
      description:
        'Contenuto controlled o iniziale, come HTML o JSON Tiptap. In modalità controlled il contenuto viene sostituito solo quando il valore esterno differisce davvero: il cursore non si resetta a ogni battitura.',
    },
    {
      name: 'onChange',
      type: '(value: { html: string; json: RichTextJSON; text: string }) => void',
      description: 'Riceve HTML (stringa vuota se l’editor è vuoto), JSON e testo semplice a ogni modifica.',
    },
    {
      name: 'label / aria-label / aria-labelledby',
      type: 'ReactNode / string / string',
      description: 'Nome accessibile dell’area modificabile. Senza label né aria-label viene usato il testo localizzato “Editor di testo”.',
    },
    {
      name: 'description / errorMessage',
      type: 'ReactNode',
      description: 'Testi di aiuto ed errore, collegati con aria-describedby come negli altri campi.',
    },
    {
      name: 'isInvalid / isRequired / isDisabled / isReadOnly',
      type: 'boolean',
      default: 'false',
      description:
        'Stati del campo, riflessi in aria-invalid, aria-required, aria-disabled e aria-readonly. In sola lettura le toolbar non vengono mostrate.',
    },
    { name: 'necessityIndicator', type: "'icon' | 'label' | 'none'", description: 'Indicatore di campo obbligatorio, come in TextField.' },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Testo mostrato quando l’editor è vuoto. Nella variante blocks i paragrafi vuoti mostrano il suggerimento “/”.',
    },
    {
      name: 'features',
      type: 'Partial<Record<RichTextFeature, boolean>>',
      default: 'tutte attive',
      description:
        "Attiva/disattiva gruppi: 'headings', 'lists', 'taskList', 'blockquote', 'codeBlock', 'link', 'image', 'table', 'align', 'highlight', 'horizontalRule'. Grassetto, corsivo, sottolineato, barrato e codice inline sono sempre disponibili.",
    },
    {
      name: 'headingLevels',
      type: 'Array<1 | 2 | 3 | 4 | 5 | 6>',
      default: '[1, 2, 3]',
      description: 'Livelli di titolo disponibili in toolbar, menu “/” e scorciatoie.',
    },
    {
      name: 'characterLimit',
      type: 'number',
      description: 'Limite di caratteri applicato all’input; mostra i caratteri rimanenti e li annuncia in modo cortese vicino al limite.',
    },
    {
      name: 'showCount',
      type: "boolean | 'words' | 'characters'",
      default: 'false',
      description: "Contatore live sotto l’area. `true` equivale a 'characters'.",
    },
    {
      name: 'onImageUpload',
      type: '(file: File) => Promise<string | { src: string; alt?: string }>',
      description:
        'Abilita incolla/trascina di immagini e il pulsante di caricamento nel dialogo immagine. Senza, il dialogo chiede solo URL e testo alternativo.',
    },
    {
      name: 'onImageUploadError',
      type: '(error: unknown, file: File) => void',
      description: 'Notifica gli errori di caricamento (incolla, trascina o dialogo).',
    },
    {
      name: 'minHeight / maxHeight',
      type: 'number | string',
      default: '8rem / nessuno',
      description: 'Altezza dell’area di scrittura; oltre maxHeight il contenuto scorre e la toolbar resta visibile.',
    },
    { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Sposta il focus nell’editor al montaggio.' },
    {
      name: 'onEditorReady',
      type: '(editor: RichTextEditorInstance) => void',
      description:
        'Via di fuga verso l’istanza Tiptap (comandi, eventi, estensioni personalizzate). Viene richiamato anche se l’editor viene ricreato.',
    },
    { name: 'onFocus / onBlur', type: '(event: FocusEvent) => void', description: 'Focus e blur dell’area modificabile.' },
    { name: 'name', type: 'string', description: 'Aggiunge un input hidden con l’HTML corrente per l’invio con form nativi.' },
    {
      name: 'id / className',
      type: 'string',
      description: 'id dell’area modificabile; classe sul contenitore esterno (ref al contenitore).',
    },
    {
      name: 'RichTextContent html',
      type: 'string',
      description: 'HTML da mostrare con la tipografia dell’editor. Viene inserito così com’è: deve essere attendibile o già sanitizzato.',
    },
    {
      name: 'RichTextContent json',
      type: 'RichTextJSON',
      description:
        'Alternativa sicura: il JSON viene convertito con lo schema dell’editor (generateHTML), quindi elementi e attributi non previsti vengono scartati. Rendering solo lato client.',
    },
    {
      name: 'RichTextContent sanitize',
      type: '(html: string) => string',
      description: 'Funzione di sanitizzazione (es. DOMPurify) applicata a `html` prima del rendering.',
    },
    { name: 'RichTextContent as', type: "'div' | 'article' | 'section'", default: "'div'", description: 'Elemento contenitore.' },
  ],
  inherits:
    'RichTextContent accetta anche gli attributi HTML del contenitore (className, style, id, aria-*). isSafeRichTextUrl(url, kind?) espone la validazione degli URL usata da link e immagini.',
  keyboard: [
    { keys: 'Mod+B / Mod+I / Mod+U', action: 'Grassetto, corsivo, sottolineato (Mod = Cmd su macOS, Ctrl altrove).' },
    { keys: 'Mod+Maiusc+S / Mod+E / Mod+Maiusc+H', action: 'Barrato, codice inline, evidenziato.' },
    { keys: 'Mod+K', action: 'Apre il popover del link (URL, apri in nuova scheda, rimuovi).' },
    { keys: 'Mod+Alt+0 / Mod+Alt+1…6', action: 'Paragrafo / titolo del livello indicato (se abilitato).' },
    { keys: 'Mod+Maiusc+7 / 8 / 9', action: 'Elenco numerato, puntato, checklist.' },
    { keys: 'Mod+Maiusc+B / Mod+Alt+C', action: 'Citazione / blocco di codice.' },
    { keys: 'Mod+Maiusc+L / E / R / J', action: 'Allinea all’inizio, al centro, alla fine, giustifica (logico: rispetta RTL).' },
    { keys: 'Mod+Z / Mod+Maiusc+Z', action: 'Annulla / ripeti.' },
    {
      keys: 'Tab / Maiusc+Tab',
      action: 'Nelle liste: aumenta/diminuisce il rientro; nelle tabelle: cella successiva/precedente. Altrove Tab esce dall’editor.',
    },
    {
      keys: 'Alt+F10',
      action:
        'Sposta il focus nella toolbar (variant toolbar), nel bubble menu se c’è una selezione, altrimenti apre il menu azioni del blocco corrente.',
    },
    {
      keys: 'Frecce / Home / Fine (toolbar)',
      action: 'Navigazione con roving focus tra i controlli; Esc torna al testo mantenendo la selezione.',
    },
    { keys: '/', action: 'Variant blocks: apre il menu di inserimento blocchi; continua a scrivere per filtrare.' },
    {
      keys: 'Freccia su/giù, Home/Fine, Invio o Tab, Esc (menu “/”)',
      action: 'Sposta l’opzione attiva, inserisce il blocco, chiude il menu.',
    },
    { keys: 'Mod+Alt+Freccia su / giù', action: 'Sposta il blocco corrente sopra/sotto (alternativa al trascinamento).' },
  ],
  accessibility: [
    'L’area modificabile ha role="textbox", aria-multiline="true", è etichettata dalla label e descritta da descrizione, errore e contatore; espone aria-invalid, aria-required, aria-readonly e aria-disabled.',
    'Le toolbar usano Toolbar della libreria (roving focus); i pulsanti di formato sono ToggleButton con aria-pressed che riflette i mark attivi; ogni controllo ha tooltip con la scorciatoia.',
    'Il menu “/” è un listbox: l’editor espone aria-expanded, aria-controls e aria-activedescendant e una regione live annuncia l’opzione attiva e lo stato “Nessun risultato”.',
    'Ogni azione col puntatore ha un’alternativa da tastiera: menu del blocco con Alt+F10, spostamento con Mod+Alt+frecce, link con Mod+K.',
    'Le immagini hanno sempre un campo per il testo alternativo; i link accettano solo http(s), mailto, tel e URL relativi e quelli in nuova scheda ricevono rel="noopener noreferrer".',
    'Le caselle delle checklist hanno un nome accessibile localizzato.',
    'Rispetta prefers-reduced-motion e forced-colors (bordi e focus restano visibili).',
  ],
  responsive: [
    'La toolbar va a capo sugli schermi stretti; i controlli hanno target di almeno 32px; il bubble menu scorre orizzontalmente se non entra.',
    'Bubble menu e menu “/” sono posizionati con floating-ui e restano dentro il viewport (flip/shift e altezza massima).',
    'Immagini e tabelle si adattano alla larghezza; le tabelle larghe scorrono orizzontalmente.',
    'Solo proprietà logiche: layout, allineamenti e maniglia dei blocchi funzionano in RTL.',
  ],
  customization: [
    'Token semantici per superficie, bordi, testo, codice (font mono), evidenziazione e focus; il tema scuro funziona automaticamente.',
    'minHeight/maxHeight controllano l’area di scrittura; className si applica al contenitore esterno.',
    'onEditorReady dà accesso all’istanza Tiptap per comandi o integrazioni (es. salvataggio automatico).',
    'RichTextContent condivide il CSS tipografico dell’editor: il contenuto salvato appare identico.',
  ],
  commonMistakes: [
    'Passare a RichTextContent `html` non attendibile senza `sanitize`: preferisci `json` o una sanitizzazione lato server.',
    'Rigenerare `value` da `html` a ogni render in modalità controlled con trasformazioni (es. trim): l’editor riceve un valore diverso e sostituisce il contenuto.',
    'Considerare `characterLimit` una validazione: va ripetuta lato server.',
    'Importare l’editor da @dev-community/ui: usa @dev-community/ui/editor.',
    'Lasciare vuoto il testo alternativo di immagini informative.',
  ],
  examples: [
    { name: 'Classic', title: 'Toolbar classica' },
    {
      name: 'Blocks',
      title: 'Editor a blocchi in stile Notion',
      description:
        'Digita “/” per inserire blocchi, seleziona testo per il bubble menu, usa la maniglia o Alt+F10 per le azioni del blocco.',
    },
    { name: 'Controlled', title: 'Valore controllato con HTML live' },
    { name: 'CharacterLimit', title: 'Limite di caratteri e contatore' },
    { name: 'ReadOnlyContent', title: 'Sola lettura e RichTextContent' },
    {
      name: 'ImageUpload',
      title: 'Caricamento immagini simulato',
      description: 'Incolla, trascina o carica un file: l’upload è simulato con un data URL.',
    },
    { name: 'Minimal', title: 'Box commenti con funzionalità ridotte' },
  ],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
  status: {
    implemented: true,
    documented: true,
    tests: ['components/RichTextEditor/RichTextEditor.test.tsx'],
    limits: [
      'Nessun sanitizzatore incluso: `RichTextContent html` è inserito così com’è; usa `json` o `sanitize`.',
      '`RichTextContent json` viene renderizzato solo lato client (in SSR il contenitore è vuoto fino all’idratazione).',
      'Il trascinamento della maniglia usa il drag nativo HTML5: non funziona con il touch; usa il menu del blocco o Mod+Alt+frecce.',
      'Gli allineamenti left/right incollati da altre fonti vengono ignorati (sono supportati solo start/center/end/justify).',
      'Nessuna collaborazione in tempo reale, commenti, menzioni o cronologia delle versioni.',
      'Le tabelle non sono ridimensionabili con il mouse; righe e colonne si gestiscono dal menu tabella.',
    ],
  },
};
