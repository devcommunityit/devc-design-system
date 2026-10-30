import { FileText, Moon, Settings, Sun, Users } from 'lucide-react';
import { useState } from 'react';
import { Button, CommandPalette, Stack, Text, useTheme, type CommandPaletteItem } from '@dev-community/ui';

export function Basic() {
  const [isOpen, setOpen] = useState(false);
  const [last, setLast] = useState('nessuno');
  const { setMode } = useTheme();
  const commands: CommandPaletteItem[] = [
    { id: 'new-invoice', label: 'Nuova fattura', section: 'Azioni', icon: <FileText />, shortcut: 'N' },
    { id: 'invite', label: 'Invita membro', section: 'Azioni', icon: <Users />, keywords: ['team', 'utente'] },
    { id: 'light', label: 'Tema chiaro', section: 'Aspetto', icon: <Sun /> },
    { id: 'dark', label: 'Tema scuro', section: 'Aspetto', icon: <Moon /> },
    { id: 'settings', label: 'Impostazioni', section: 'Navigazione', icon: <Settings />, description: 'Profilo, notifiche, sicurezza' },
  ];
  return (
    <Stack gap={3} align="start">
      <Button variant="outline" onPress={() => setOpen(true)}>
        Apri comandi (Ctrl+K)
      </Button>
      <Text variant="body-sm" tone="secondary">
        Ultimo comando: {last}
      </Text>
      <CommandPalette
        commands={commands}
        isOpen={isOpen}
        onOpenChange={setOpen}
        hotkey
        placeholder="Cerca un comando…"
        onAction={(id, command) => {
          if (id === 'light' || id === 'dark') setMode(id);
          setLast(command.label);
        }}
      />
    </Stack>
  );
}
