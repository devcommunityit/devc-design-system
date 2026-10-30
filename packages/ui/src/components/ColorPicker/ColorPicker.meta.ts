import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ColorPicker', 'parseColor'],
  name: 'ColorPicker',
  slug: 'color-picker',
  category: 'forms',
  summary: 'Campo colore esadecimale con editor in popover (area saturazione/luminosità, tonalità, campioni).',
  whenToUse: ['Personalizzazione di temi, etichette o categorie.'],
  whenNotToUse: ['Scelta tra pochi colori predefiniti: usa RadioGroup o ToggleGroup con campioni e nomi.'],
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Anatomia di campo standard.' },
    { name: 'value / defaultValue / onChange', type: 'string | Color · (color: Color) => void', default: "'#000000'", description: 'Colore controllato o non controllato; usa parseColor per creare valori.' },
    { name: 'swatches', type: 'string[]', description: 'Campioni predefiniti nel popover.' },
    { name: 'name', type: 'string', description: 'Valore esadecimale inviato con il form.' },
    { name: 'isDisabled / isReadOnly / isRequired / isInvalid', type: 'boolean', description: 'Stati; in sola lettura il popover non si apre.' },
    { name: 'popoverProps', type: 'PopoverSurfaceProps', description: 'Posizionamento e classi del popover.' },
  ],
  keyboard: [
    { keys: 'Tab', action: 'Pulsante del campione, poi campo esadecimale.' },
    { keys: 'Frecce (area)', action: 'Saturazione e luminosità.' },
    { keys: 'Frecce (tonalità)', action: 'Cambia la tonalità.' },
    { keys: 'Frecce (campioni)', action: 'Sceglie un campione; Esc chiude e ripristina il focus.' },
  ],
  accessibility: [
    'Area e slider annunciano il nome del colore (es. “blu vivace”), non solo i valori numerici.',
    'Il campo esadecimale resta l’alternativa testuale completa.',
    'In forced-colors i campioni mantengono il colore reale.',
  ],
  responsive: ['Popover a larghezza fissa contenuta nel viewport; l’area supporta il tocco.'],
  customization: ['className e style sul campo; popoverProps.className sul popover.'],
  commonMistakes: ['Assumere che un colore scelto sia accessibile: verifica il contrasto (il Theme Builder lo mostra).'],
  examples: [
    { name: 'Basic', title: 'Base' },
    { name: 'Controlled', title: 'Controllato con campioni' },
    { name: 'States', title: 'Stati' },
  ],
  status: { implemented: true, documented: true, tests: ['components/ColorPicker/ColorPicker.test.tsx'], limits: ['Nessun canale alpha nell’editor.'] },
};