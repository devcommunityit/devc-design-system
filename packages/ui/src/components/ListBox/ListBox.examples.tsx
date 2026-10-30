import { useState } from 'react';
import { ListBox, ListBoxItem, ListBoxSection, Stack, Text, type Selection } from '@dev-community/ui';

export function Basic() {
  return (
    <ListBox aria-label="Vista" selectionMode="single" defaultSelectedKeys={['list']}>
      <ListBoxItem id="list">Elenco</ListBoxItem>
      <ListBoxItem id="grid">Griglia</ListBoxItem>
      <ListBoxItem id="calendar">Calendario</ListBoxItem>
    </ListBox>
  );
}

export function MultipleControlled() {
  const [selected, setSelected] = useState<Selection>(new Set(['email']));
  const count = selected === 'all' ? 3 : selected.size;
  return (
    <Stack gap={2}>
      <ListBox aria-label="Canali di notifica" selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected}>
        <ListBoxItem id="email" description="Riepilogo giornaliero">
          Email
        </ListBoxItem>
        <ListBoxItem id="push" description="Solo eventi urgenti">
          Notifiche push
        </ListBoxItem>
        <ListBoxItem id="sms" description="Non disponibile nel tuo piano" isDisabled>
          SMS
        </ListBoxItem>
      </ListBox>
      <Text variant="body-sm" tone="secondary">
        Canali attivi: {count}
      </Text>
    </Stack>
  );
}

export function Sections() {
  return (
    <ListBox aria-label="Ufficio" selectionMode="single">
      <ListBoxSection title="Nord">
        <ListBoxItem id="mi">Milano</ListBoxItem>
        <ListBoxItem id="to">Torino</ListBoxItem>
      </ListBoxSection>
      <ListBoxSection title="Sud">
        <ListBoxItem id="na">Napoli</ListBoxItem>
        <ListBoxItem id="ba">Bari</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  );
}

export function Empty() {
  return <ListBox aria-label="Risultati" items={[] as { id: string }[]}>{(item) => <ListBoxItem id={item.id}>{item.id}</ListBoxItem>}</ListBox>;
}