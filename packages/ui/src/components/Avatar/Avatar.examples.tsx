import { Avatar, AvatarGroup, Inline, Text } from '@devcommunityit/ui';

export function Basic() {
  return (
    <Inline gap={3} align="center">
      <Avatar name="Giulia Bianchi" />
      <Avatar name="Marco Esposito" shape="square" />
      <Avatar name="Immagine non disponibile" src="data:image/png;base64,AA==" /* immagine non decodificabile: mostra le iniziali senza richieste di rete */ />
    </Inline>
  );
}

export function Sizes() {
  return (
    <Inline gap={3} align="center">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} name="Sara Conti" size={size} />
      ))}
    </Inline>
  );
}

export function Group() {
  return (
    <AvatarGroup aria-label="Membri del team" max={4}>
      {['Anna Rossi', 'Luca Verdi', 'Sara Neri', 'Paolo Gallo', 'Elena Riva', 'Davide Fontana'].map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  );
}

export function WithName() {
  return (
    <Inline gap={2} align="center">
      <Avatar name="Chiara Moretti" isDecorative />
      <Text weight="medium">Chiara Moretti</Text>
    </Inline>
  );
}