import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['SponsorWall', 'SponsorWallProps', 'Sponsor'],
  name: 'SponsorWall',
  slug: 'sponsor-wall',
  category: 'community',
  summary: 'Elenco semantico di sponsor con marchi e collegamenti facoltativi.',
  whenToUse: ['Dare visibilità a partner e sponsor di una community o di un evento.'],
  whenNotToUse: ['Per un confronto di piani o prezzi usa PricingTable.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome accessibile della sezione.' },
    { name: 'sponsors', type: 'readonly Sponsor[]', required: true, description: 'Sponsor con nome, marchio e collegamento opzionale.' },
    { name: 'heading', type: 'ReactNode', description: 'Titolo facoltativo.' },
  ],
  keyboard: [{ keys: 'Tab', action: 'Raggiunge i link degli sponsor che hanno href.' }],
  accessibility: ['I marchi sono decorativi quando il nome visibile dello sponsor è presente.'],
  responsive: ['Gli elementi si dispongono in una griglia che si adatta al contenitore.'],
  customization: ['Usa CSS module e token --dc-*; il logo è uno slot ReactNode.'],
  commonMistakes: ['Fornire un nome comprensibile anche quando il logo è solo grafico.'],
  examples: [{ name: 'Basic', title: 'Sponsor' }],
  status: { implemented: true, documented: true, tests: ['components/SponsorWall/SponsorWall.test.tsx'], limits: ['I loghi devono essere forniti dal consumer.'] },
};
