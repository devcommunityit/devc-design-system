import { Copy, Download, MoreVertical, Pencil, Share2, Trash2 } from 'lucide-react';
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
} from '@dev-community/ui';

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
