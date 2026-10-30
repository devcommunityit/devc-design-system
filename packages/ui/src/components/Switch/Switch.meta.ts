import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Switch'],
  name: 'Switch',
  slug: 'switch',
  category: 'forms',
  summary: 'Interruttore on/off per impostazioni che hanno effetto immediato, con descrizione opzionale ed etichetta prima o dopo il binario.',
  whenToUse: ['Preferenze applicate subito (notifiche, modalità).', 'Liste di impostazioni.'],
  whenNotToUse: ['Scelte da confermare con un pulsante “Salva”: usa Checkbox.', 'Più di due stati: usa RadioGroup o ToggleGroup.'],
  props: [
    { name: 'children', type: 'ReactNode', description: 'Etichetta.' },
    { name: 'isSelected / defaultSelected', type: 'boolean', description: 'Stato controllato o non controllato.' },
    { name: 'onChange', type: '(isSelected: boolean) => void', description: 'Riceve il nuovo stato.' },
    { name: 'description', type: 'ReactNode', description: 'Testo di aiuto collegato.' },
    { name: 'labelPosition', type: "'start' | 'end'", default: "'end'", description: 'start: etichetta a sinistra (destra in RTL) e interruttore allineato in fondo, per liste di impostazioni.' },
    { name: 'isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'Stati del controllo.' },
    { name: 'name / value', type: 'string', description: 'Invio nel form (come una checkbox).' },
  ],
  inherits: 'Props di react-aria-components SwitchField.',
  keyboard: [{ keys: 'Spazio', action: 'Attiva o disattiva.' }, { keys: 'Tab', action: 'Sposta il focus.' }],
  accessibility: ['role="switch" su input nativo; lo stato è annunciato come attivo/disattivo.', 'La posizione del cursore e il riempimento indicano lo stato, oltre al colore; in forced-colors usa colori di sistema.', 'Animazione disattivata con prefers-reduced-motion.'],
  responsive: ['Con labelPosition="start" l’etichetta lunga va a capo senza spostare l’interruttore.'],
  customization: ['Colori da color.action.primary e color.border.strong; dimensioni dal token density.'],
  commonMistakes: ['Richiedere un “Salva” dopo uno Switch: confonde, usa Checkbox.', 'Etichette che descrivono lo stato (“Attivo”) invece della funzione (“Notifiche”).'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Controlled', title: 'Controllato' },
    { name: 'SettingsList', title: 'Lista impostazioni' },
    { name: 'States', title: 'Stati' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Switch/Switch.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
};