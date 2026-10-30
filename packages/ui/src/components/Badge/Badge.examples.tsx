import { CheckCircle2 } from 'lucide-react';
import { Badge, Inline } from '@dev-community/ui';

export function Tones() {
  return (
    <Inline gap={2} wrap>
      <Badge>Bozza</Badge>
      <Badge tone="brand">Nuovo</Badge>
      <Badge tone="info">In revisione</Badge>
      <Badge tone="success">Pagato</Badge>
      <Badge tone="warning">In scadenza</Badge>
      <Badge tone="danger">Scaduto</Badge>
    </Inline>
  );
}

export function Variants() {
  return (
    <Inline gap={2} wrap>
      <Badge tone="success" variant="soft">Soft</Badge>
      <Badge tone="success" variant="solid">Solid</Badge>
      <Badge tone="success" variant="outline">Outline</Badge>
      <Badge tone="success" dot>Online</Badge>
      <Badge tone="success" icon={<CheckCircle2 />}>Verified</Badge>
      <Badge tone="danger" variant="solid" size="sm">12</Badge>
    </Inline>
  );
}