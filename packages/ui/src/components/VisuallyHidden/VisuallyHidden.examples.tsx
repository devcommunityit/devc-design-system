import { IconButton, Inline, Text, VisuallyHidden } from '@dev-community/ui';
import { Bell } from 'lucide-react';

export function Basic() {
  return (
    <Inline gap={2} align="center">
      <IconButton label="Notifiche" icon={<Bell />} variant="ghost" />
      <Text>
        3<VisuallyHidden> notifiche non lette</VisuallyHidden>
      </Text>
    </Inline>
  );
}

export function SkipLink() {
  return (
    <VisuallyHidden isFocusable>
      <a href="#contenuto">Vai al contenuto</a>
    </VisuallyHidden>
  );
}