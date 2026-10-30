import { Button, IconButton, Inline, Tooltip } from '@dev-community/ui';
import { Download, Pencil, Trash2 } from 'lucide-react';

export function Basic() {
  return (
    <Tooltip content="Esporta i dati filtrati in CSV">
      <Button variant="secondary" startIcon={<Download />}>
        Esporta
      </Button>
    </Tooltip>
  );
}

export function Placements() {
  return (
    <Inline gap={3} wrap>
      {(['top', 'bottom', 'start', 'end'] as const).map((placement) => (
        <Tooltip key={placement} content={`Posizione ${placement}`} placement={placement}>
          <Button variant="ghost">{placement}</Button>
        </Tooltip>
      ))}
    </Inline>
  );
}

export function IconToolbar() {
  return (
    <Inline gap={1}>
      <Tooltip content="Il nome accessibile resta l’etichetta del pulsante">
        <IconButton label="Modifica" icon={<Pencil />} variant="ghost" />
      </Tooltip>
      <Tooltip content="Elimina definitivamente">
        <IconButton label="Elimina" icon={<Trash2 />} variant="ghost" />
      </Tooltip>
    </Inline>
  );
}