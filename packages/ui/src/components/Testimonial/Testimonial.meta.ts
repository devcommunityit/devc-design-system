import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['Testimonial', 'TestimonialProps'],
  name: 'Testimonial',
  slug: 'testimonial',
  category: 'community',
  summary: 'Citazione semantica attribuita a una persona.',
  whenToUse: ['Mostrare una testimonianza o una citazione con autore e ruolo.'],
  whenNotToUse: ['Per una biografia o una scheda completa usa ProfileCard.'],
  props: [
    { name: 'quote', type: 'ReactNode', required: true, description: 'Testo o contenuto citato.' },
    { name: 'author', type: 'string', required: true, description: 'Nome dell’autore.' },
    { name: 'role', type: 'ReactNode', description: 'Ruolo o organizzazione.' },
    { name: 'avatarSrc', type: 'string', description: 'Immagine facoltativa dell’autore.' },
    { name: 'cite', type: 'string', description: 'URL della fonte della citazione.' },
  ],
  keyboard: [{ keys: '—', action: 'Componente non interattivo.' }],
  accessibility: ['La citazione usa blockquote e l’attribuzione è la didascalia della figura.', 'L’avatar è decorativo perché il nome è visibile.'],
  responsive: ['Il testo va a capo senza richiedere larghezze minime.'],
  customization: ['Testo, superfici e spaziature derivano da token --dc-*.'],
  commonMistakes: ['Non usare la citazione per contenuti che non sono effettivamente attribuiti.'],
  examples: [{ name: 'Basic', title: 'Testimonianza' }],
  status: { implemented: true, documented: true, tests: ['components/Testimonial/Testimonial.test.tsx'], limits: ['Non verifica né formatta la fonte citata.'] },
};
