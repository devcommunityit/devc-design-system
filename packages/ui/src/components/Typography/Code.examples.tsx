import { Code, Kbd, Text } from '@devcommunityit/ui';

export function InlineCode() {
  return (
    <Text>
      Esegui <Code>npm install @devcommunityit/ui</Code> nella cartella del progetto.
    </Text>
  );
}

export function Shortcut() {
  return (
    <Text>
      Apri la palette comandi con <Kbd keys={['Ctrl', 'K']} /> oppure chiudi con <Kbd>Esc</Kbd>.
    </Text>
  );
}