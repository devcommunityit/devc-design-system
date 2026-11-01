import {
  Archive,
  ArchiveRestore,
  Copy,
  CreditCard,
  Download,
  FilePlus,
  FileText,
  LayoutDashboard,
  Moon,
  Receipt,
  Search,
  Settings,
  Sun,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button, CommandPalette, Stack, Text, useTheme, type CommandPaletteItem } from '@devcommunityit/ui';

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

const workspaceCommands: CommandPaletteItem[] = [
  { id: 'go-dashboard', label: 'Vai alla dashboard', section: 'Navigazione', icon: <LayoutDashboard />, shortcut: 'G D' },
  { id: 'go-customers', label: 'Vai ai clienti', section: 'Navigazione', icon: <Users />, shortcut: 'G C', keywords: ['customers', 'anagrafica'] },
  { id: 'go-invoices', label: 'Vai alle fatture', section: 'Navigazione', icon: <Receipt />, shortcut: 'G F', keywords: ['invoices'] },
  { id: 'new-customer', label: 'Nuovo cliente', section: 'Crea', icon: <UserPlus />, shortcut: 'Ctrl+Alt+C' },
  { id: 'new-invoice', label: 'Nuova fattura', section: 'Crea', icon: <FilePlus />, shortcut: 'Ctrl+Alt+F' },
  { id: 'export', label: 'Esporta dati', section: 'Strumenti', icon: <Download />, description: 'CSV o Excel della vista corrente', keywords: ['export', 'excel'] },
];

const RECENT_PREFIX = 'recent-';

export function RecentCommands() {
  const [isOpen, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const recentCommands = recent.flatMap((id) => {
    const command = workspaceCommands.find((c) => c.id === id);
    return command ? [{ ...command, id: `${RECENT_PREFIX}${id}`, section: 'Recenti' }] : [];
  });
  const recentLabels = recentCommands.map((c) => c.label);
  return (
    <Stack gap={3} align="start">
      <Button variant="outline" startIcon={<Search />} onPress={() => setOpen(true)}>
        Cerca comandi
      </Button>
      <Text variant="body-sm" tone="secondary">
        Recenti: {recentLabels.length ? recentLabels.join(', ') : 'nessuno'}
      </Text>
      <CommandPalette
        commands={[...recentCommands, ...workspaceCommands]}
        isOpen={isOpen}
        onOpenChange={setOpen}
        placeholder="Cerca per nome o parola chiave…"
        onAction={(id) => {
          const baseId = id.startsWith(RECENT_PREFIX) ? id.slice(RECENT_PREFIX.length) : id;
          setRecent((prev) => [baseId, ...prev.filter((r) => r !== baseId)].slice(0, 3));
        }}
      />
    </Stack>
  );
}

export function ControlledStates() {
  const [isOpen, setOpen] = useState(false);
  const [archived, setArchived] = useState(false);
  const [copies, setCopies] = useState(0);
  const commands: CommandPaletteItem[] = [
    { id: 'archive', label: 'Archivia progetto', icon: <Archive />, isDisabled: archived },
    { id: 'restore', label: 'Ripristina progetto', icon: <ArchiveRestore />, isDisabled: !archived },
    { id: 'duplicate', label: 'Duplica progetto', icon: <Copy />, description: 'Crea una copia con le stesse impostazioni' },
    { id: 'billing', label: 'Fatturazione', icon: <CreditCard />, description: 'Richiede il ruolo Amministratore', isDisabled: true },
  ];
  return (
    <Stack gap={3} align="start">
      <Button variant="outline" onPress={() => setOpen(true)}>
        Comandi progetto
      </Button>
      <Text variant="body-sm" tone="secondary">
        Palette {isOpen ? 'aperta' : 'chiusa'} · Progetto Alfa {archived ? 'archiviato' : 'attivo'} · copie create: {copies}
      </Text>
      <CommandPalette
        aria-label="Comandi progetto"
        commands={commands}
        isOpen={isOpen}
        onOpenChange={setOpen}
        emptyState="Nessun comando trovato. Prova con “archivia” o “duplica”."
        onAction={(id) => {
          if (id === 'archive') setArchived(true);
          if (id === 'restore') setArchived(false);
          if (id === 'duplicate') setCopies((n) => n + 1);
        }}
      />
    </Stack>
  );
}