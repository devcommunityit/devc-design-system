import { CalendarClock, Gift, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Button, PromoBanner, Stack } from '@dev-community/ui';

export function Basic() {
  return <PromoBanner href="#piani" icon={<Sparkles />} title="Passa al piano Pro" description="Report illimitati, SSO e supporto prioritario." />;
}

export function Tones() {
  return (
    <Stack gap={3}>
      <PromoBanner tone="brand" href="#brand" icon={<Sparkles />} title="Brand" description="Superficie primaria, gradiente nel look expressive." />
      <PromoBanner tone="accent" href="#accent" icon={<Gift />} title="Accent" description="Two-tone gradient in every look." />
      <PromoBanner tone="neutral" href="#neutral" icon={<CalendarClock />} title="Webinar giovedì alle 17:00" description="Novità della release 4.2." />
      <PromoBanner tone="success" href="#success" icon={<ShieldCheck />} title="Verifica in due passaggi attiva" description="Scopri le altre opzioni di sicurezza." />
      <PromoBanner tone="warning" href="#warning" icon={<TriangleAlert />} title="Il tuo piano scade tra 5 giorni" description="Rinnova per non perdere i dati." />
    </Stack>
  );
}

/** The whole surface is a button: here it opens a local confirmation. */
export function AsButton() {
  const [claimed, setClaimed] = useState(false);
  return (
    <Stack gap={3}>
      <PromoBanner tone="accent" icon={<Gift />} title="Riscatta 30 giorni gratuiti" description="Nessuna carta di credito richiesta." onPress={() => setClaimed(true)} />
      <p aria-live="polite">{claimed ? 'Prova attivata fino al 2 aprile.' : 'Prova non ancora attivata.'}</p>
    </Stack>
  );
}

export function Dismissible() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <PromoBanner
      tone="neutral"
      href="#novita"
      icon={<Sparkles />}
      title="New: scheduled reports"
      description="Send dashboards by email every Monday."
      onDismiss={() => setVisible(false)}
    />
  ) : (
    <Button variant="outline" onPress={() => setVisible(true)}>
      Mostra di nuovo il banner
    </Button>
  );
}

export function ExternalLink() {
  return (
    <PromoBanner
      href="https://example.com/changelog"
      linkProps={{ target: '_blank', rel: 'noreferrer' }}
      icon={<CalendarClock />}
      title="Leggi il changelog"
      description="Si apre in una nuova scheda."
    />
  );
}
