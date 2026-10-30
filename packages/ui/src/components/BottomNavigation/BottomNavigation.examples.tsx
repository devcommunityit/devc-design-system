import { Bell, Home, Search, User } from 'lucide-react';
import { useState } from 'react';
import { BottomNavigation, Stack, Text, type BottomNavigationItem } from '@dev-community/ui';

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
