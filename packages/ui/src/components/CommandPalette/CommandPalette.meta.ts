import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['CommandPalette', 'CommandPaletteItem'],
  name: 'CommandPalette',
  slug: 'command-palette',
  category: 'navigation',
  summary: 'Finestra di ricerca rapida di comandi e destinazioni, apribile anche con Ctrl/⌘+K.',
  whenToUse: ['Portali con molte funzioni, per utenti esperti che usano la tastiera.'],
  whenNotToUse: ['Come unico accesso a una funzione: ogni comando deve esistere anche nell’interfaccia.', 'Ricerca di contenuti con risultati remoti complessi: usa una pagina di ricerca.'],
  props: [
    { name: 'commands', type: 'CommandPaletteItem[]', required: true, description: '{ id, label, section?, keywords?, description?, icon?, shortcut?, isDisabled? }.' },
    { name: 'onAction', type: '(id, command) => void', required: true, description: 'Comando eseguito; la palette si chiude.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Apertura controllata o non controllata.' },
    { name: 'hotkey', type: 'boolean', default: 'false', description: 'Abilita Ctrl/⌘+K (listener globale opt-in, rimosso allo smontaggio).' },
    { name: 'placeholder', type: 'string', default: 'messages.commandPlaceholder', description: 'Testo del campo di ricerca.' },
    { name: 'emptyState', type: 'ReactNode', default: 'messages.noResults', description: 'Contenuto senza risultati.' },
  ],
  inherits: 'Nessun attributo HTML diretto: className si applica al dialog.',
  keyboard: [
    { keys: 'Ctrl/⌘ + K', action: 'Apre/chiude (se hotkey).' },
    { keys: 'Frecce su/giù', action: 'Evidenziano il comando (il focus resta nel campo).' },
    { keys: 'Enter', action: 'Esegue il comando evidenziato.' },
    { keys: 'Escape', action: 'Prima svuota la ricerca, poi chiude e ripristina il focus.' },
  ],
  accessibility: [
    'Dialog modale con focus iniziale sul campo, contenimento e ripristino del focus.',
    'Combobox con aria-activedescendant sull’elenco (focus virtuale).',
    'Ricerca insensibile a maiuscole e accenti; le parole chiave estendono la corrispondenza.',
  ],
  responsive: ['Larghezza massima limitata; su mobile occupa quasi tutta la viewport con elenco scorrevole.'],
  customization: ['Superficie: surface.raised con shadow-4; selettori .dc-command-palette-dialog, .dc-command-palette-search-field.'],
  commonMistakes: ['Abilitare hotkey in più istanze contemporaneamente.', 'Eseguire comandi distruttivi senza conferma (AlertDialog).'],
  examples: [{ name: 'Basic', title: 'Con sezioni e cambio tema' }],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/CommandPalette/CommandPalette.test.tsx'],
    limits: ['Filtro locale sui comandi forniti: per risultati asincroni filtra nel consumer e aggiorna commands.'],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
};
