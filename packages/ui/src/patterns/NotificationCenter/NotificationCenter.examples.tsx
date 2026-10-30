import { CalendarClock, FileCheck2, MessageSquare, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Button, Header, LocaleProvider, NotificationCenter, Stack, Text, type NotificationItem } from '@dev-community/ui';

// Fixed reference instant: relative times stay deterministic.
const NOW = '2024-06-12T10:00:00+02:00';

const initial: NotificationItem[] = [
  { id: 'n1', title: 'Fattura FT-2024-0187 approvata', description: 'Approvata da Marco Rossi', date: '2024-06-12T09:52:00+02:00', icon: <FileCheck2 /> },
  { id: 'n2', title: 'Nuovo commento su “Piano Q3”', description: 'Sara: «Ok per me, procediamo.»', date: '2024-06-12T08:15:00+02:00', icon: <MessageSquare /> },
  { id: 'n3', title: 'Accesso da un nuovo dispositivo', description: 'Firefox su Windows, Milano', date: '2024-06-11T21:40:00+02:00', icon: <ShieldAlert /> },
  { id: 'n4', title: 'Manutenzione programmata', description: 'Sabato 15 giugno, 22:00–23:00', date: '2024-06-10T09:00:00+02:00', read: true, icon: <CalendarClock /> },
];

const older: NotificationItem[] = [
  { id: 'n5', title: 'Backup settimanale completato', date: '2024-06-08T03:00:00+02:00', read: true },
  { id: 'n6', title: 'Report mensile disponibile', date: '2024-06-01T08:00:00+02:00', read: true },
];

/** Header integration with local state: marking as read updates the badge and the trigger name. */
export function InHeader() {
  const [items, setItems] = useState(initial);
  const [loadedOlder, setLoadedOlder] = useState(false);
  return (
    <Stack gap={3}>
      <div style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-lg)', overflow: 'hidden' }}>
        <Header
          sticky={false}
          brand={<Text as="span" weight="bold">Acme Portal</Text>}
          actions={
            <NotificationCenter
              items={items}
              now={NOW}
              onMarkRead={(id) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)))}
              onMarkAllRead={() => setItems((list) => list.map((n) => ({ ...n, read: true })))}
              footer={
                loadedOlder ? undefined : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setItems((list) => [...list, ...older]);
                      setLoadedOlder(true);
                    }}
                  >
                    Carica notifiche precedenti
                  </Button>
                )
              }
            />
          }
        />
      </div>
      <Text variant="body-sm" tone="secondary">
        Non lette: {items.filter((n) => !n.read).length}. Simulazione locale: la consegna (polling, websocket) spetta al portale.
      </Text>
      <Button variant="outline" size="sm" onPress={() => setItems(initial)}>
        Ripristina demo
      </Button>
    </Stack>
  );
}

/** English messages (LocaleProvider) and the default empty state. */
export function EmptyEnglish() {
  return (
    <LocaleProvider locale="en-US">
      <NotificationCenter items={[]} title="Inbox" />
    </LocaleProvider>
  );
}

/** Read-only list (no mark-as-read callbacks) with more than 99 unread items: the badge shows "99+". */
export function ManyUnread() {
  const many: NotificationItem[] = Array.from({ length: 120 }, (_, i) => ({
    id: `m${i}`,
    title: `Ordine #${4200 - i} ricevuto`,
    date: new Date(Date.parse(NOW) - i * 37 * 60_000).toISOString(),
  }));
  return <NotificationCenter items={many} now={NOW} />;
}
