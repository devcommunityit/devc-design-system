import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Ribbon', 'RibbonProps', 'RibbonTone', 'RibbonVariant', 'RibbonPosition'],
  name: 'Ribbon',
  slug: 'ribbon',
  category: 'community',
  summary:
    'Nastro sovrapposto all’angolo di card o immagini (“Beta”, “Nuovo”, “-20%”, “Sold out”): avvolge il contenuto in un contenitore posizionato e sovrappone un’etichetta breve a fascia diagonale, segnalibro o bandierina.',
  whenToUse: [
    'Evidenziare una card in una griglia (evento sold out, corso nuovo, sconto).',
    'Marcare un’anteprima o un’immagine con uno stato breve e molto visibile.',
  ],
  whenNotToUse: [
    'Etichette in linea nel testo o accanto a un titolo: usa Badge o StageLabel.',
    'Conteggi o pallini su avatar e icone: usa IndicatorBadge.',
    'Informazioni lunghe o essenziali per capire la card: mettile nel contenuto, il nastro tronca i testi lunghi.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Testo breve del nastro; è testo reale, letto prima del contenuto.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Contenuto su cui si sovrappone il nastro (card, immagine…).' },
    { name: 'variant', type: "'corner' | 'bookmark' | 'banner'", default: "'corner'", description: 'Fascia diagonale nell’angolo, segnalibro verticale con coda a V o bandierina che sporge dal bordo.' },
    { name: 'position', type: "'top-start' | 'top-end'", default: "'top-end' ('top-start' per banner)", description: 'Angolo logico: si specchia automaticamente in RTL.' },
    { name: 'tone', type: "'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral'", default: "'brand'", description: 'Colore; brand usa il gradiente accent.' },
  ],
  inherits: 'Attributi HTML di <div> (il contenitore).',
  keyboard: [],
  accessibility: [
    'Il testo del nastro non è nascosto: viene prima del contenuto nel DOM, quindi lo screen reader lo legge per primo.',
    'Il nastro non intercetta i click (pointer-events: none): link e pulsanti sotto restano utilizzabili.',
    'Non affidare al solo nastro informazioni essenziali (es. “Sold out”): ripetile vicino all’azione, ad es. disabilitando il pulsante con un testo esplicito.',
    'In forced-colors il nastro usa un bordo di sistema al posto di sfondo e gradiente; in stampa mantiene colori e bordo.',
  ],
  responsive: [
    'Il contenitore occupa la larghezza del contenuto; corner e bookmark sono ritagliati nei bordi arrotondati.',
    'La variante corner tronca con ellissi i testi oltre ~10 caratteri: preferisci etichette brevi.',
  ],
  customization: [
    'Token: --dc-gradient-accent (brand), --dc-color-accent-default, colori feedback e --dc-color-surface-inverse per gli altri toni, --dc-look-radius-container per il ritaglio.',
    'Il contenitore usa overflow: hidden e border-radius pari a --dc-look-radius-container (sovrascrivibili via className/style); la variante banner usa overflow visibile perché sporge dal bordo.',
    'Selettori stabili: .dc-ribbon-ribbon[data-variant][data-position][data-tone], .dc-ribbon-label, .dc-ribbon-text.',
  ],
  commonMistakes: [
    'Usare testi lunghi (“Iscrizioni chiuse il 12 marzo”): il nastro è pensato per una o due parole.',
    'Avvolgere un elemento con margini esterni: il ritaglio segue il contenitore, non la card.',
    'Usare la variante banner in un contenitore con overflow nascosto: la bandierina viene tagliata.',
  ],
  examples: [
    { name: 'Variants', title: 'Varianti', description: 'corner, bookmark e banner su card della community.' },
    { name: 'TonesAndPositions', title: 'Toni e posizioni', description: 'Tutti i toni, alternando top-start e top-end.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['components/Ribbon/Ribbon.test.tsx'],
    limits: ['La variante banner sporge di --dc-space-2 oltre il bordo: lascia spazio intorno al contenitore.'],
  },
};
