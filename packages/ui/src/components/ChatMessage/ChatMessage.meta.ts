import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['ChatMessage'],
  name: 'ChatMessage',
  slug: 'chat-message',
  category: 'ai',
  summary: 'Messaggio di conversazione per utente, assistente o sistema, con autore, stato, contenuto e azioni componibili.',
  whenToUse: ['Conversazioni AI o assistenza.', 'Mostrare contenuti parziali mantenendoli disponibili dopo un errore.'],
  whenNotToUse: ['Renderizzare HTML di un modello senza validazione.', 'Sostituire la logica di trasporto o la cronologia della conversazione.'],
  props: [
    { name: 'speaker', type: "'user' | 'assistant' | 'system'", default: "'assistant'", description: 'Identità semantica e variante visiva. I nomi predefiniti sono localizzati.' },
    { name: 'author', type: 'ReactNode', description: 'Nome visibile personalizzato.' },
    { name: 'avatar', type: 'ReactNode', description: 'Avatar decorativo; il nome resta nel testo.' },
    { name: 'status', type: "'complete' | 'streaming' | 'error'", default: "'complete'", description: 'Stato fornito dal consumer; non avvia generazioni.' },
    { name: 'statusText', type: 'ReactNode', description: 'Testo di stato o errore; default localizzato.' },
    { name: 'footer', type: 'ReactNode', description: 'Fonti, feedback, copia o azioni del consumer.' },
    { name: 'children', type: 'ReactNode', description: 'Testo o componenti React sicuri; nessun parser Markdown incluso.' },
  ],
  inherits: 'Attributi HTML di article, aria-label, className, style e ref HTMLElement.',
  keyboard: [{ keys: 'Tab', action: 'Raggiunge eventuali azioni e link del footer.' }],
  accessibility: ['Il contenuto streaming è aria-busy, non una live region che annuncia ogni token.', 'Lo stato usa role=status; gli errori role=alert.', 'Non aggiunge focus o scroll automatici.'],
  responsive: ['Testi lunghi e newline vanno a capo nel contenitore.'],
  customization: ['data-speaker e data-status distinguono varianti e stati.', 'Token di superficie e colore seguono anche provider annidati.'],
  commonMistakes: ['Inserire output non attendibile con dangerouslySetInnerHTML.', 'Considerare l’etichetta assistant una garanzia di accuratezza.'],
  examples: [
    { name: 'Basic', title: 'Conversazione' },
    { name: 'Streaming', title: 'Frammenti aggiunti localmente' },
    { name: 'ErrorState', title: 'Errore e recupero locale' },
  ],
  status: { implemented: true, documented: true, tests: ['components/ChatMessage/ChatMessage.test.tsx'], limits: ['Nessun Markdown, trasporto streaming, archivio o virtualizzazione.', 'Il consumer definisce la strategia di annuncio della risposta completata e di scroll.'] },
};
