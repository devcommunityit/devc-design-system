import { Code, Kbd, Text } from '@dev-community/ui';

export function InlineCode() {
  return (
    <Text>
      Esegui <Code>npm install @dev-community/ui</Code> nella cartella del progetto.
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