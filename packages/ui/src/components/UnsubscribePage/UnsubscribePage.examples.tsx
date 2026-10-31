import { UnsubscribePage } from './UnsubscribePage';

export function Basic() {
  return (
    <UnsubscribePage
      title="Email preferences"
      description="Choose which updates you want to receive."
      categories={[
        { id: 'product', label: 'Product updates' },
        { id: 'events', label: 'Community events' },
      ]}
      channels={[{ id: 'email', label: 'Email' }, { id: 'push', label: 'Push' }]}
      value={{ email: ['product', 'events'], push: [] }}
      onChange={() => {}}
      unsubscribeAllLabel="Unsubscribe from all"
      onUnsubscribeAll={() => {}}
    />
  );
}
