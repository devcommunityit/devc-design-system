import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PromptSuggestions'],
  name: 'PromptSuggestions',
  slug: 'prompt-suggestions',
  category: 'ai',
  summary: 'Gruppo di suggerimenti azionabili, con etichetta breve e prompt separato, senza invio automatico.',
  whenToUse: ['Aiutare a iniziare una conversazione.', 'Riempire un composer con richieste contestuali.'],
  whenNotToUse: ['Selezioni persistenti: usa ToggleGroup.', 'Navigazione: usa link o NavList.'],
  props: [
    { name: 'items', type: 'readonly PromptSuggestion[]', required: true, description: 'Ogni elemento ha id univoco, label, prompt e icon opzionale.' },
    { name: 'onAction', type: '(item: PromptSuggestion) => void', required: true, description: 'Il consumer decide se compilare un campo o avviare un’azione.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disabilita tutti i pulsanti.' },
  ],
  inherits: 'Attributi HTML del gruppo, aria-label, className, style e ref HTMLDivElement.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge ogni suggerimento.' }, { keys: 'Invio / Spazio', action: 'Attiva il suggerimento.' }],
  accessibility: ['Pulsanti reali con nomi testuali; icone decorative.', 'Nome di gruppo localizzato e sostituibile con aria-label.'],
  responsive: ['I suggerimenti vanno a capo; nessuno scorrimento orizzontale obbligatorio.'],
  customization: ['Gli elementi possono includere un’icona originale fornita dal consumer.'],
  commonMistakes: ['Usare id duplicati.', 'Inviare automaticamente richieste senza rendere evidente tale comportamento.'],
  examples: [
    { name: 'Basic', title: 'Richieste suggerite' },
    { name: 'FillComposer', title: 'Compilazione del composer' },
    { name: 'Disabled', title: 'Stato disabilitato' },
  ],
  status: { implemented: true, documented: true, tests: ['components/PromptSuggestions/PromptSuggestions.test.tsx'], limits: ['Nessuna generazione o ranking dei suggerimenti.'] },
};
