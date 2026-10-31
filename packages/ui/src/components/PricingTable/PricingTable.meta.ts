import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PricingTable', 'PricingTableProps', 'PricingPlan', 'PricingFeature'],
  name: 'PricingTable',
  slug: 'pricing-table',
  category: 'community',
  summary: 'Tabella semantica per confrontare piani e funzionalità con selezione opzionale.',
  whenToUse: ['Confrontare prezzi e funzionalità di piani o livelli di servizio.', 'Offrire una scelta controllata del piano e ricevere l’id selezionato dal chiamante.'],
  whenNotToUse: ['Mostrare metriche o dati non correlati a piani: usa una tabella dati dedicata.', 'Costruire un flusso di checkout: la scelta è notificata al chiamante, non avvia transazioni.'],
  props: [
    { name: 'caption', type: 'ReactNode', required: true, description: 'Didascalia accessibile della tabella.' },
    { name: 'plans', type: 'PricingPlan[]', required: true, description: 'Piani da mostrare in colonna, ciascuno con id, nome e prezzo.' },
    { name: 'features', type: 'PricingFeature[]', required: true, description: 'Righe di confronto; ogni riga associa i valori agli id dei piani.' },
    { name: 'selectedPlanId', type: 'string', description: 'Id del piano selezionato, controllato dal chiamante.' },
    { name: 'onSelectPlan', type: '(planId: string) => void', description: 'Callback invocata premendo il pulsante di un piano.' },
    { name: 'selectLabel', type: 'ReactNode', description: 'Etichetta visibile dei pulsanti di selezione; per default segue LocaleProvider.' },
    { name: 'featureColumnLabel', type: 'ReactNode', description: 'Intestazione della colonna delle funzionalità; per default segue LocaleProvider.' },
    { name: 'includedLabel', type: 'string', description: 'Nome accessibile per un valore booleano positivo; per default segue LocaleProvider.' },
    { name: 'notIncludedLabel', type: 'string', description: 'Nome accessibile per un valore booleano negativo; per default segue LocaleProvider.' },
  ],
  inherits: 'Attributi HTML di <div>; ref inoltrato al contenitore scrollabile.',
  keyboard: [
    { keys: 'Tab', action: 'Raggiunge i pulsanti di selezione nell’ordine dei piani.' },
    { keys: 'Enter / Space', action: 'Attiva la selezione del piano focalizzato.' },
  ],
  accessibility: [
    'Usa una tabella HTML con caption, intestazioni di colonna e intestazioni di riga.',
    'La selezione usa pulsanti nativi e aria-pressed; lo stato selezionato è controllato da selectedPlanId.',
    'I valori booleani hanno etichette accessibili personalizzabili, oltre ai simboli visivi.',
  ],
  responsive: ['La tabella mantiene colonne leggibili e scorre orizzontalmente nei contenitori stretti.'],
  customization: ['`className` sul contenitore; colori, superfici, bordi e spaziature usano i token `--dc-*`.'],
  commonMistakes: [
    'Usare la stessa chiave `id` per più piani o dimenticare le chiavi dei piani nei valori delle funzionalità.',
    'Aspettarsi che il componente cambi la selezione: aggiorna selectedPlanId nel chiamante dopo onSelectPlan.',
    'Passare importi monetari numerici aspettandosi una formattazione automatica: price è contenuto presentazionale fornito dal chiamante.',
  ],
  examples: [{ name: 'Basic', title: 'Confronto piani', description: 'Prezzi, valori delle funzionalità e selezione controllata.' }],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/PricingTable/PricingTable.test.tsx'],
    limits: ['Non formatta prezzi o gestisce checkout; i contenuti e il flusso di acquisto appartengono all’app.'],
  },
};
