import { DiffViewer } from '@dev-community/ui/widgets';

export function Changes() {
  return <DiffViewer aria-label="Modifiche alla configurazione" before={'name: app\nport: 3000'} after={'name: app\nport: 4000\nsecure: true'} />;
}
