import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link2, Redo2, Underline, Undo2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  IconButton,
  Stack,
  Text,
  Toggle,
  ToggleGroup,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@dev-community/ui';

/** Text editor toolbar: one tab stop, arrows move between every control across groups. */
export function Editor() {
  const [history, setHistory] = useState<string[]>([]);
  const [format, setFormat] = useState<ReadonlySet<string>>(new Set(['grassetto']));
  const log = (entry: string) => setHistory((h) => [entry, ...h].slice(0, 3));
  const toggle = (key: string, on: boolean) =>
    setFormat((prev) => {
      const next = new Set(prev);
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });
  const active = [...format].join(', ') || 'nessuno';
  return (
    <Stack gap={3}>
      <Toolbar aria-label="Formattazione testo">
        <ToolbarGroup aria-label="Cronologia">
          <IconButton variant="ghost" label="Annulla" icon={<Undo2 />} onPress={() => log('Annulla')} />
          <IconButton variant="ghost" label="Ripeti" icon={<Redo2 />} onPress={() => log('Ripeti')} />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup aria-label="Stile">
          <Toggle variant="ghost" icon={<Bold />} aria-label="Grassetto" isSelected={format.has('grassetto')} onChange={(on) => toggle('grassetto', on)} />
          <Toggle variant="ghost" icon={<Italic />} aria-label="Corsivo" isSelected={format.has('corsivo')} onChange={(on) => toggle('corsivo', on)} />
          <Toggle variant="ghost" icon={<Underline />} aria-label="Sottolineato" isSelected={format.has('sottolineato')} onChange={(on) => toggle('sottolineato', on)} />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToggleGroup aria-label="Allineamento" defaultSelectedKeys={['start']} disallowEmptySelection attached={false}>
          <Toggle id="start" variant="ghost" icon={<AlignLeft />} aria-label="Allinea all’inizio" />
          <Toggle id="center" variant="ghost" icon={<AlignCenter />} aria-label="Centra" />
          <Toggle id="end" variant="ghost" icon={<AlignRight />} aria-label="Allinea alla fine" />
        </ToggleGroup>
        <ToolbarSeparator />
        <Button variant="ghost" startIcon={<Link2 />} onPress={() => log('Inserisci link')}>
          Link
        </Button>
      </Toolbar>
      <Text variant="body-sm" tone="secondary">
        Stile attivo: {active}. Ultime azioni: {history.length ? history.join(' · ') : 'nessuna'}
      </Text>
    </Stack>
  );
}

/** Vertical toolbar for a map or canvas: ↑/↓ move, the separator becomes horizontal. */
export function Vertical() {
  const [zoom, setZoom] = useState(100);
  return (
    <Stack gap={3} align="start">
      <Toolbar aria-label="Zoom mappa" orientation="vertical">
        <IconButton variant="ghost" label="Zoom in" icon={<ZoomIn />} isDisabled={zoom >= 200} onPress={() => setZoom((z) => Math.min(200, z + 25))} />
        <ToolbarSeparator />
        <IconButton variant="ghost" label="Zoom out" icon={<ZoomOut />} isDisabled={zoom <= 50} onPress={() => setZoom((z) => Math.max(50, z - 25))} />
      </Toolbar>
      <Text variant="body-sm" tone="secondary">Zoom: {zoom}%</Text>
    </Stack>
  );
}

/** Plain variant with text buttons, e.g. above a table (English labels). */
export function Plain() {
  const [last, setLast] = useState('none');
  return (
    <Stack gap={3}>
      <Toolbar aria-label="Table actions" variant="plain">
        <Button variant="outline" size="sm" onPress={() => setLast('Export')}>Export</Button>
        <Button variant="outline" size="sm" onPress={() => setLast('Print')}>Print</Button>
        <Button variant="outline" size="sm" isDisabled>Archive</Button>
      </Toolbar>
      <Text variant="body-sm" tone="secondary">Last action: {last}</Text>
    </Stack>
  );
}
