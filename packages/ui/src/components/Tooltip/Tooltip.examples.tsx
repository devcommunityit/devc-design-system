import { useState } from 'react';
import { Button, IconButton, Inline, Stack, Switch, Text, Tooltip } from '@dev-community/ui';
import { Download, Info, Link2, Pencil, Save, Trash2 } from 'lucide-react';

export function Basic() {
  return (
    <Tooltip content="Esporta i dati filtrati in CSV">
      <Button variant="secondary" startIcon={<Download />}>
        Esporta
      </Button>
    </Tooltip>
  );
}

export function Placements() {
  return (
    <Inline gap={3} wrap>
      {(['top', 'bottom', 'start', 'end'] as const).map((placement) => (
        <Tooltip key={placement} content={`Posizione ${placement}`} placement={placement}>
          <Button variant="ghost">{placement}</Button>
        </Tooltip>
      ))}
    </Inline>
  );
}

export function IconToolbar() {
  return (
    <Inline gap={1}>
      <Tooltip content="Il nome accessibile resta l’etichetta del pulsante">
        <IconButton label="Modifica" icon={<Pencil />} variant="ghost" />
      </Tooltip>
      <Tooltip content="Elimina definitivamente">
        <IconButton label="Elimina" icon={<Trash2 />} variant="ghost" />
      </Tooltip>
    </Inline>
  );
}

export function Controlled() {
  const [isOpen, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const [copied, setCopied] = useState(false);
  return (
    <Stack gap={3} align="start">
      <Tooltip
        content={copied ? 'Link copiato' : 'Copia il link pubblico del documento'}
        delay={0}
        isOpen={isOpen}
        onOpenChange={(open) => {
          setOpen(open);
          if (open) setShown((n) => n + 1);
        }}
      >
        <Button variant="secondary" startIcon={<Link2 />} onPress={() => setCopied(true)}>
          Condividi
        </Button>
      </Tooltip>
      <Text variant="body-sm" tone="secondary">
        Tooltip {isOpen ? 'visibile' : 'nascosto'} · mostrato {shown} {shown === 1 ? 'volta' : 'volte'} · {copied ? 'link copiato (simulato)' : 'link non ancora copiato'}
      </Text>
    </Stack>
  );
}

export function Variants() {
  const [enabled, setEnabled] = useState(true);
  const [saves, setSaves] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Stack gap={3} align="start">
      <Switch isSelected={enabled} onChange={setEnabled}>
        Suggerimenti attivi
      </Switch>
      <Inline gap={2} wrap align="center">
        <Tooltip content="Salva · Ctrl+S" isDisabled={!enabled}>
          <Button startIcon={<Save />} onPress={() => setSaves((n) => n + 1)}>
            Salva
          </Button>
        </Tooltip>
        <Tooltip
          content="I dati vengono conservati per 24 mesi nei data center dell’Unione Europea e non sono condivisi con terze parti senza consenso esplicito."
          showArrow={false}
          placement="bottom"
          isDisabled={!enabled}
        >
          <IconButton
            label={showDetails ? 'Nascondi informativa' : 'Mostra informativa'}
            icon={<Info />}
            variant="ghost"
            onPress={() => setShowDetails((v) => !v)}
          />
        </Tooltip>
      </Inline>
      {showDetails ? (
        <Text variant="body-sm">
          Informativa: conservazione per 24 mesi in data center UE, nessuna condivisione senza consenso esplicito.
        </Text>
      ) : null}
      <Text variant="body-sm" tone="secondary">
        Salvataggi: {saves} · tooltip {enabled ? 'attivi' : 'disattivati'}
      </Text>
    </Stack>
  );
}