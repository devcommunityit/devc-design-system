import { Archive, Copy, Download, FilePen, FolderOpen, MoreVertical, Pencil, Send, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  DropdownMenu,
  IconButton,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  Stack,
  SubmenuTrigger,
  Text,
  type Selection,
} from '@devcommunityit/ui';

export function Basic() {
  const [last, setLast] = useState<string>('nessuna');
  return (
    <Stack gap={3} align="start">
      <DropdownMenu>
        <Button variant="outline">Azioni</Button>
        <Menu aria-label="Azioni documento" onAction={(key) => setLast(String(key))}>
          <MenuItem id="edit" icon={<Pencil />} shortcut="Ctrl+E">
            Modifica
          </MenuItem>
          <MenuItem id="duplicate" icon={<Copy />} description="Crea una copia nella stessa cartella">
            Duplica
          </MenuItem>
          <SubmenuTrigger>
            <MenuItem id="share" icon={<Share2 />}>
              Condividi
            </MenuItem>
            <Menu aria-label="Condividi" onAction={(key) => setLast(String(key))}>
              <MenuItem id="share-link">Copia link</MenuItem>
              <MenuItem id="share-email">Invia via email</MenuItem>
            </Menu>
          </SubmenuTrigger>
          <MenuSeparator />
          <MenuItem id="delete" icon={<Trash2 />} tone="danger">
            Elimina
          </MenuItem>
        </Menu>
      </DropdownMenu>
      <Text variant="body-sm" tone="secondary">
        Ultima azione: {last}
      </Text>
    </Stack>
  );
}

export function IconTrigger() {
  const [downloads, setDownloads] = useState(0);
  return (
    <Stack gap={3} align="start">
      <DropdownMenu>
        <IconButton label="Altre azioni" variant="ghost" icon={<MoreVertical />} />
        <Menu placement="bottom end" onAction={() => setDownloads((n) => n + 1)}>
          <MenuItem id="pdf" icon={<Download />}>
            Scarica PDF
          </MenuItem>
          <MenuItem id="csv" icon={<Download />}>
            Scarica CSV
          </MenuItem>
        </Menu>
      </DropdownMenu>
      <Text variant="body-sm" tone="secondary">
        Download richiesti: {downloads}
      </Text>
    </Stack>
  );
}

export function Selectable() {
  const [density, setDensity] = useState<Selection>(new Set(['comfortable']));
  const [columns, setColumns] = useState<Selection>(new Set(['name', 'status']));
  return (
    <DropdownMenu>
      <Button variant="outline">Vista</Button>
      <Menu aria-label="Opzioni vista">
        <MenuSection title="Densità" selectionMode="single" selectedKeys={density} onSelectionChange={setDensity}>
          <MenuItem id="comfortable">Comoda</MenuItem>
          <MenuItem id="compact">Compatta</MenuItem>
        </MenuSection>
        <MenuSection title="Colonne" selectionMode="multiple" selectedKeys={columns} onSelectionChange={setColumns}>
          <MenuItem id="name">Nome</MenuItem>
          <MenuItem id="status">Stato</MenuItem>
          <MenuItem id="owner">Responsabile</MenuItem>
        </MenuSection>
      </Menu>
    </DropdownMenu>
  );
}

const statuses = [
  { id: 'draft', label: 'Bozza', action: 'Riporta in bozza', icon: <FilePen /> },
  { id: 'published', label: 'Pubblicato', action: 'Pubblica', icon: <Send /> },
  { id: 'archived', label: 'Archiviato', action: 'Archivia', icon: <Archive /> },
];

export function Controlled() {
  const [isOpen, setOpen] = useState(false);
  const [status, setStatus] = useState('draft');
  const currentLabel = statuses.find((s) => s.id === status)?.label;
  return (
    <Stack gap={3} align="start">
      <DropdownMenu isOpen={isOpen} onOpenChange={setOpen}>
        <Button variant="outline">Stato: {currentLabel}</Button>
        <Menu
          aria-label="Cambia stato"
          disabledKeys={[status]}
          onAction={(key) => {
            const next = statuses.find((s) => s.id === key);
            if (next) setStatus(next.id);
          }}
        >
          {statuses.map((s) => (
            <MenuItem key={s.id} id={s.id} icon={s.icon}>
              {s.action}
            </MenuItem>
          ))}
        </Menu>
      </DropdownMenu>
      <Text variant="body-sm" tone="secondary">
        Menu {isOpen ? 'aperto' : 'chiuso'} · l’azione corrispondente allo stato attuale è disabilitata.
      </Text>
    </Stack>
  );
}

const projects = [
  { id: 'p-1', label: 'Portale clienti', description: 'Aggiornato ieri' },
  { id: 'p-2', label: 'Migrazione del gestionale di magazzino verso la nuova piattaforma cloud', description: 'Aggiornato 3 giorni fa' },
  { id: 'p-3', label: 'App mobile prenotazioni' },
  { id: 'p-4', label: 'Rinnovo sito istituzionale con nuova identità visiva e accessibilità AA' },
  { id: 'p-5', label: 'Integrazione fatturazione elettronica SDI' },
  { id: 'p-6', label: 'Dashboard direzionale' },
  { id: 'p-7', label: 'Intranet aziendale' },
  { id: 'p-8', label: 'Campagna newsletter primavera' },
  { id: 'p-9', label: 'Analisi dei tempi di consegna regionali per il secondo trimestre' },
  { id: 'p-10', label: 'Sistema ticket di assistenza' },
];

export function LongList() {
  const [selected, setSelected] = useState<Selection>(new Set(['p-3']));
  const current = selected === 'all' ? undefined : projects.find((p) => selected.has(p.id));
  return (
    <Stack gap={3} align="start" style={{ maxInlineSize: '24rem' }}>
      <DropdownMenu>
        <Button variant="outline" startIcon={<FolderOpen />}>
          Cambia progetto
        </Button>
        <Menu aria-label="Progetti" selectionMode="single" disallowEmptySelection selectedKeys={selected} onSelectionChange={setSelected}>
          {projects.map((p) => (
            <MenuItem key={p.id} id={p.id} description={p.description}>
              {p.label}
            </MenuItem>
          ))}
        </Menu>
      </DropdownMenu>
      <Text variant="body-sm" tone="secondary">
        Progetto attivo: {current?.label ?? 'nessuno'}
      </Text>
    </Stack>
  );
}