import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Button', 'LinkButton'],
  name: 'Button',
  slug: 'button',
  category: 'actions',
  summary:
    'Avvia un’azione nella pagina corrente (salvare, inviare, aprire un dialog). LinkButton ha lo stesso aspetto ma è un vero link per la navigazione.',
  whenToUse: [
    'Azioni che modificano dati o stato: salvare, inviare un form, aprire un overlay.',
    'Una sola azione primaria per area visiva; le altre come secondary, outline o ghost.',
  ],
  whenNotToUse: [
    'Per navigare verso un’altra pagina: usa LinkButton o Link.',
    'Per uno stato on/off persistente: usa Toggle o Switch.',
    'Per sole icone senza testo: usa IconButton con un nome accessibile.',
  ],
  props: [
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: 'Enfasi visiva.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Altezza e padding; la densità del tema scala tutte le misure.' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Attivazione da mouse, touch, tastiera e screen reader.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disabilita il pulsante (attributo disabled nativo).' },
    { name: 'isPending', type: 'boolean', default: 'false', description: 'Stato di caricamento: mostra uno spinner, blocca le pressioni ma mantiene il focus e annuncia l’attesa.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Tipo nativo; usa submit nei form.' },
    { name: 'startIcon / endIcon', type: 'ReactNode', description: 'Icone decorative (aria-hidden) prima/dopo l’etichetta.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Occupa tutta la larghezza disponibile.' },
    { name: 'className', type: 'string | (state) => string', description: 'Classe aggiuntiva; può dipendere dallo stato (isHovered, isPressed, isFocusVisible…).' },
  ],
  inherits: 'Tutte le props di react-aria-components Button (onPressStart, onHoverChange, form, name, value, autoFocus…) e gli attributi DOM globali, inclusi data-* e aria-*.',
  keyboard: [
    { keys: 'Tab', action: 'Sposta il focus sul pulsante.' },
    { keys: 'Enter / Space', action: 'Attiva il pulsante.' },
  ],
  accessibility: [
    'Renderizza sempre un elemento <button> (o <a> per LinkButton): nessun div cliccabile.',
    'In stato pending il pulsante resta focalizzabile e l’attesa è annunciata dagli screen reader.',
    'Il focus da tastiera mostra un anello ad alto contrasto (data-focus-visible) anche in forced-colors.',
    'L’altezza minima rispetta il target di 24×24 CSS px (WCAG 2.5.8); in densità comoda è 40 px.',
  ],
  responsive: ['Il testo non va a capo: usa etichette brevi o fullWidth su mobile.', 'Su touch l’area minima resta adeguata anche con size="sm".'],
  customization: [
    'Colori: token action.* del tema (es. --dc-color-action-primary).',
    'Raggio: token radius.md (sovrascrivibile in createTheme tramite tokens).',
    'Selettori stabili: .dc-button-button[data-variant][data-size], stati [data-hovered], [data-pressed], [data-focus-visible], [data-disabled], [data-pending].',
  ],
  commonMistakes: [
    'Usare onClick: preferisci onPress, che gestisce touch e tastiera in modo uniforme.',
    'Dimenticare type="submit" nei form.',
    'Usare Button con un handler che fa window.location: usa LinkButton.',
  ],
  examples: [
    { name: 'Variants', title: 'Varianti' },
    { name: 'Sizes', title: 'Dimensioni' },
    { name: 'WithIcons', title: 'Con icone' },
    { name: 'States', title: 'Stati' },
    { name: 'AsyncAction', title: 'Azione asincrona', description: 'Lo stato pending è controllato dal consumer; qui l’attesa è simulata con un timer locale.' },
    { name: 'AsLink', title: 'LinkButton' },
    { name: 'FullWidth', title: 'Larghezza piena' },
  ],
  status: { implemented: true, documented: true, tests: ['components/Button/Button.test.tsx'], limits: [] },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
};
