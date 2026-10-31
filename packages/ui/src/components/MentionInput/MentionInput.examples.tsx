import { MentionInput, MentionTextarea } from '@dev-community/ui';

const people = [{ id: 'sara', label: 'Sara Leone', handle: 'sara' }, { id: 'luca', label: 'Luca Bianchi', handle: 'luca' }];

export function DiscussionComment() {
  return <MentionInput label="Scrivi un commento" placeholder="Digita @ per menzionare una persona" suggestions={people} />;
}

export function MultilineHashtags() {
  return <MentionTextarea label="Messaggio" placeholder="Usa @ per le persone e # per gli argomenti" suggestions={people} hashtagSuggestions={[{ id: 'react', label: 'React', handle: 'react' }]} rows={4} />;
}
