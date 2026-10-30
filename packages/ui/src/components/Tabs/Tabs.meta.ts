import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
  name: 'Tabs',
  slug: 'tabs',
  category: 'navigation',
  summary: 'Alterna pannelli correlati nello stesso contesto senza cambiare pagina.',
  whenToUse: [
    'Viste alternative dello stesso oggetto (panoramica, attività, impostazioni).',
    'Contenuti paralleli che l’utente non deve confrontare contemporaneamente.',
  ],
  whenNotToUse: [
    'Navigazione tra pagine con URL diversi: usa NavigationMenu o link.',
    'Passaggi sequenziali: usa Stepper.',
    'Filtri o scelta di vista: usa ToggleGroup.',
  ],
  props: [
    { name: 'selectedKey / defaultSelectedKey', type: 'Key', description: 'Tab selezionata (controllata / iniziale).' },
    { name: 'onSelectionChange', type: '(key: Key) => void', description: 'Cambio di tab.' },
    { name: 'variant', type: "'line' | 'pill'", default: "'line'", description: 'Indicatore sottolineato o segmento pieno.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Disposizione della TabList.' },
    { name: 'keyboardActivation', type: "'automatic' | 'manual'", default: "'automatic'", description: 'Manual: le frecce spostano solo il focus, Enter/Space attivano.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Le tab occupano tutta la larghezza.' },
    { name: 'Tab: icon / badge', type: 'ReactNode', description: 'Icona decorativa e contenuto finale (es. Badge).' },
    { name: 'Tab: isDisabled', type: 'boolean', description: 'Tab non selezionabile, saltata dalle frecce.' },
  ],
  inherits: 'Props di react-aria-components Tabs, TabList, Tab, TabPanel.',
  keyboard: [
    { keys: 'Tab', action: 'Entra nella TabList sulla tab selezionata, poi passa al pannello.' },
    { keys: 'Frecce sinistra/destra (su/giù se verticale)', action: 'Tab precedente/successiva; in RTL la direzione è invertita.' },
    { keys: 'Home / End', action: 'Prima / ultima tab.' },
    { keys: 'Enter / Space', action: 'Attiva la tab (in modalità manual).' },
  ],
  accessibility: [
    'Pattern APG Tabs: tablist, tab con aria-selected, tabpanel con aria-labelledby.',
    'Serve aria-label sulla TabList se non c’è un titolo visibile.',
    'Il pannello è focalizzabile solo se non contiene elementi interattivi.',
  ],
  responsive: ['La TabList scorre orizzontalmente con overflow locale: nessuno scroll globale.', 'Su mobile preferisci la variante line con etichette brevi.'],
  customization: ['Indicatore: colore text.link; pill: surface.muted e surface.raised.', 'Selettori: .dc-tabs-tab[data-selected], [data-focus-visible], [data-disabled].'],
  commonMistakes: ['Usare le Tabs come navigazione di pagina con URL: usa link con aria-current.', 'Mancata corrispondenza tra id di Tab e TabPanel.'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'PillWithIcons', title: 'Pill con icone e badge' },
    { name: 'Controlled', title: 'Controllato con attivazione manuale' },
    { name: 'Vertical', title: 'Verticale' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Tabs/Tabs.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
};
