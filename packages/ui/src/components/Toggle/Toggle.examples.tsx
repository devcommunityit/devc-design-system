import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Star, Underline } from 'lucide-react';
import { useState } from 'react';
import { Inline, Stack, Text, Toggle, ToggleGroup, type Selection } from '@dev-community/ui';

export function Uncontrolled() {
  return (
    <Toggle icon={<Star />} defaultSelected>
      Preferito
    </Toggle>
  );
}

export function Controlled() {
  const [on, setOn] = useState(false);
  return (
    <Inline gap={3} align="center">
      <Toggle isSelected={on} onChange={setOn} icon={<Bold />} aria-label="Grassetto" />
      <Text variant="body-sm" tone="secondary">Grassetto: {on ? 'attivo' : 'non attivo'}</Text>
    </Inline>
  );
}

export function SingleGroup() {
  const [selected, setSelected] = useState<Selection>(new Set(['start']));
  const value = [...(selected === 'all' ? [] : selected)][0] ?? 'nessuno';
  return (
    <Stack gap={3}>
      <ToggleGroup aria-label="Allineamento" selectedKeys={selected} onSelectionChange={setSelected} disallowEmptySelection>
        <Toggle id="start" icon={<AlignLeft />} aria-label="Inizio" />
        <Toggle id="center" icon={<AlignCenter />} aria-label="Centro" />
        <Toggle id="end" icon={<AlignRight />} aria-label="Fine" />
      </ToggleGroup>
      <Text variant="body-sm" tone="secondary">Allineamento: {String(value)}</Text>
    </Stack>
  );
}

export function MultipleGroup() {
  return (
    <ToggleGroup aria-label="Formattazione" selectionMode="multiple" defaultSelectedKeys={['italic']}>
      <Toggle id="bold" icon={<Bold />} aria-label="Grassetto" />
      <Toggle id="italic" icon={<Italic />} aria-label="Corsivo" />
      <Toggle id="underline" icon={<Underline />} aria-label="Sottolineato" />
    </ToggleGroup>
  );
}

export function TextGroup() {
  return (
    <ToggleGroup aria-label="Periodo" defaultSelectedKeys={['week']}>
      <Toggle id="day">Giorno</Toggle>
      <Toggle id="week">Settimana</Toggle>
      <Toggle id="month">Mese</Toggle>
      <Toggle id="year" isDisabled>Anno</Toggle>
    </ToggleGroup>
  );
}