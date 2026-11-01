import { NotificationPreferences } from '@devcommunityit/ui';

export function Channels() {
  return <NotificationPreferences aria-label="Notifiche" categories={[{ id: 'news', label: 'Novità' }, { id: 'mentions', label: 'Menzioni' }]}
    channels={[{ id: 'email', label: 'Email' }, { id: 'push', label: 'Push' }]} defaultValue={{ email: ['mentions'] }} />;
}
