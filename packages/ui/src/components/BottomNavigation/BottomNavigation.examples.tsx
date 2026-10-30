import { Bell, CalendarCheck, History, Home, LayoutGrid, LifeBuoy, Package, Search, ShoppingCart, Store, User } from 'lucide-react';
import { useState } from 'react';
import { BottomNavigation, Button, Inline, Stack, Text, type BottomNavigationItem } from '@dev-community/ui';

const items: BottomNavigationItem[] = [
  { id: 'home', label: 'Home', icon: <Home /> },
  { id: 'search', label: 'Cerca', icon: <Search /> },
  { id: 'alerts', label: 'Notifiche', icon: <Bell />, badge: '3', badgeLabel: '3 non lette' },
  { id: 'profile', label: 'Profilo', icon: <User /> },
];

export function Basic() {
  const [value, setValue] = useState('home');
  return (
    <Stack gap={3}>
      <Text variant="body-sm" tone="secondary">
        Sezione attiva: {items.find((i) => i.id === value)?.label}
      </Text>
      <BottomNavigation items={items} value={value} onChange={setValue} position="static" hideFrom="never" aria-label="Sezioni app" />
    </Stack>
  );
}

const shopItems: BottomNavigationItem[] = [
  { id: 'shop-home', label: 'Vetrina', icon: <Store />, href: '#vetrina' },
  { id: 'shop-categories', label: 'Categorie', icon: <LayoutGrid />, href: '#categorie' },
  { id: 'shop-cart', label: 'Carrello', icon: <ShoppingCart />, href: '#carrello', badge: '2', badgeLabel: '2 articoli' },
  { id: 'shop-orders', label: 'Ordini', icon: <Package />, href: '#ordini' },
  { id: 'shop-account', label: 'Account', icon: <User />, href: '#account', badge: '99+', badgeLabel: 'oltre 99 messaggi' },
];

export function UncontrolledLinks() {
  const [history, setHistory] = useState<string[]>([]);
  return (
    <Stack gap={3}>
      <BottomNavigation
        items={shopItems}
        defaultValue="shop-categories"
        onChange={(id) => {
          const label = shopItems.find((i) => i.id === id)?.label ?? id;
          setHistory((prev) => [label, ...prev].slice(0, 3));
        }}
        position="static"
        hideFrom="never"
        aria-label="Negozio"
      />
      <Text variant="body-sm" tone="secondary">
        Ultime destinazioni: {history.length ? history.join(', ') : 'nessuna'}
      </Text>
    </Stack>
  );
}

const bookingItems: BottomNavigationItem[] = [
  { id: 'active', label: 'Prenotazioni attive', icon: <CalendarCheck /> },
  { id: 'history', label: 'Storico delle prenotazioni', icon: <History /> },
  { id: 'help', label: 'Assistenza clienti', icon: <LifeBuoy /> },
];

export function LongLabels() {
  const [value, setValue] = useState('active');
  return (
    <Stack gap={3}>
      <Inline gap={2} wrap>
        <Button size="sm" variant="outline" isDisabled={value === 'history'} onPress={() => setValue('history')}>
          Vai allo storico
        </Button>
        <Button size="sm" variant="outline" isDisabled={value === 'help'} onPress={() => setValue('help')}>
          Apri l’assistenza
        </Button>
      </Inline>
      <div style={{ maxInlineSize: '22rem' }}>
        <BottomNavigation items={bookingItems} value={value} onChange={setValue} position="static" hideFrom="never" aria-label="Prenotazioni" />
      </div>
      <Text variant="body-sm" tone="secondary">
        Sezione attiva: {bookingItems.find((i) => i.id === value)?.label}
      </Text>
    </Stack>
  );
}