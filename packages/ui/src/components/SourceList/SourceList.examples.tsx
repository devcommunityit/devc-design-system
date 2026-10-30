import { ChatMessage, SourceList } from '@dev-community/ui';

const sources = [
  { id: 'tokens', title: 'Design token', href: '/guide/token', description: 'Sorgente unica e ruoli semantici.' },
  { id: 'themes', title: 'Guida ai temi', href: '/guide/temi', description: 'Palette, modalità e provider annidati.' },
];

export function Basic() {
  return <SourceList label="Documentazione di riferimento" sources={sources} />;
}

export function CustomLabel() {
  return <SourceList label="Approfondimenti verificati dal consumer" sources={[{ id: 'a11y', title: 'Accessibilità', href: '/guide/accessibilita', description: 'I link non costituiscono una verifica automatica dell’attendibilità.' }]} />;
}

export function InMessage() {
  return <ChatMessage footer={<SourceList label="Fonti della risposta dimostrativa" sources={sources} />}>I token semantici permettono ai componenti di seguire il tema attivo senza colori hard-coded.</ChatMessage>;
}
