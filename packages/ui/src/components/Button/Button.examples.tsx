import { Download, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button, Inline, LinkButton } from '@devcommunityit/ui';

export function Variants() {
  return (
    <Inline gap={3} wrap>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Inline>
  );
}

export function Sizes() {
  return (
    <Inline gap={3} align="center" wrap>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Inline>
  );
}

export function WithIcons() {
  return (
    <Inline gap={3} wrap>
      <Button startIcon={<Plus />}>Nuovo progetto</Button>
      <Button variant="outline" endIcon={<Download />}>
        Export CSV
      </Button>
      <Button variant="danger" startIcon={<Trash2 />}>
        Elimina
      </Button>
    </Inline>
  );
}

export function States() {
  return (
    <Inline gap={3} wrap>
      <Button isDisabled>Disabled</Button>
      <Button variant="outline" isDisabled>
        Disabled outline
      </Button>
      <Button isPending>Saving</Button>
    </Inline>
  );
}

/** Pending state driven by an async action (simulated locally with a timer). */
export function AsyncAction() {
  const [pending, setPending] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <Inline gap={3} align="center" wrap>
      <Button
        isPending={pending}
        onPress={() => {
          setPending(true);
          window.setTimeout(() => {
            setPending(false);
            setCount((c) => c + 1);
          }, 1200);
        }}
      >
        Save changes
      </Button>
      <span aria-live="polite">{count > 0 ? `Saved ${count}×` : 'Not saved yet'}</span>
    </Inline>
  );
}

export function AsLink() {
  return (
    <Inline gap={3} wrap>
      <LinkButton href="#installation">Get started</LinkButton>
      <LinkButton href="#components" variant="outline">
        Browse components
      </LinkButton>
    </Inline>
  );
}

export function FullWidth() {
  return (
    <div style={{ maxInlineSize: 360 }}>
      <Button fullWidth>Continue</Button>
    </div>
  );
}
