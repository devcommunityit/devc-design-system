import { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { Avatar, Button, IconButton, IndicatorBadge, Inline, Stack } from '@dev-community/ui';

export function Basic() {
  return (
    <Inline gap={6} align="center">
      <IndicatorBadge count={3} label="3 notifiche non lette">
        <IconButton label="Notifiche" icon={<Bell />} variant="secondary" />
      </IndicatorBadge>
      <IndicatorBadge count={128} tone="brand" label="128 messaggi non letti">
        <IconButton label="Messaggi" icon={<Mail />} variant="secondary" />
      </IndicatorBadge>
      <IndicatorBadge dot tone="success" placement="bottom-end" overlap="circular" label="Online">
        <Avatar name="Giulia Bianchi" />
      </IndicatorBadge>
    </Inline>
  );
}

/** Placements, overlap and tones on avatars and icons. */
export function PlacementsAndTones() {
  return (
    <Stack gap={4}>
      <Inline gap={6} align="center">
        {(['top-end', 'bottom-end', 'top-start', 'bottom-start'] as const).map((placement) => (
          <IndicatorBadge key={placement} count={5} placement={placement} overlap="circular" tone="brand" label={`5 menzioni (${placement})`}>
            <Avatar name="Marco Rossi" size="lg" />
          </IndicatorBadge>
        ))}
      </Inline>
      <Inline gap={6} align="center">
        {(['danger', 'brand', 'success', 'warning', 'neutral'] as const).map((tone) => (
          <IndicatorBadge key={tone} count={12} tone={tone} label={`12 risposte nel forum (${tone})`}>
            <MessageSquare aria-hidden="true" size={28} />
          </IndicatorBadge>
        ))}
      </Inline>
    </Stack>
  );
}

/** Controlled count: "99+" overflow, hidden at zero unless showZero, pulse on new items. */
export function LiveCount() {
  const [count, setCount] = useState(98);
  return (
    <Inline gap={4} align="center">
      <IndicatorBadge count={count} pulse={count > 0} label={count === 1 ? '1 notifica non letta' : `${count} notifiche non lette`}>
        <IconButton label="Notifiche" icon={<Bell />} variant="secondary" />
      </IndicatorBadge>
      <Button size="sm" variant="secondary" onPress={() => setCount((c) => c + 1)}>
        Nuova notifica
      </Button>
      <Button size="sm" variant="ghost" onPress={() => setCount(0)}>
        Segna tutto come letto
      </Button>
    </Inline>
  );
}
