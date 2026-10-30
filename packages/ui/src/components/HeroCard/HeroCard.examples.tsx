import { CalendarDays, Rocket, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button, HeroCard, LinkButton, Stack } from '@dev-community/ui';

export function Basic() {
  return (
    <HeroCard
      eyebrow="Lunedì 3 marzo"
      title="Bentornata, Giulia"
      description="Hai 4 richieste di accesso da approvare e 2 report pronti da rivedere."
      actions={
        <>
          <LinkButton href="#richieste" variant="secondary">
            Apri richieste
          </LinkButton>
          <LinkButton href="#report" variant="secondary">
            Vedi report
          </LinkButton>
        </>
      }
    />
  );
}

export function Variants() {
  return (
    <Stack gap={4}>
      <HeroCard variant="brand" icon={<Sparkles />} eyebrow="Brand" title="Pannello di amministrazione" description="Superficie primaria; gradiente nel look expressive." />
      <HeroCard variant="accent" icon={<Rocket />} eyebrow="Accent" title="New: workflow automation" description="Two-tone gradient from primary to accent, in every look." />
      <HeroCard variant="subtle" icon={<CalendarDays />} eyebrow="Subtle" title="Prossima manutenzione" description="Domenica 9 marzo, 02:00–04:00 CET." />
    </Stack>
  );
}

export function WithMedia() {
  return (
    <HeroCard
      variant="accent"
      as="article"
      eyebrow="Release 4.2"
      title="Report pianificati via email"
      description="Programma l’invio settimanale delle dashboard al tuo team."
      media={
        <svg viewBox="0 0 160 120" width="160" height="120" aria-hidden="true">
          <rect x="10" y="20" width="140" height="90" rx="12" fill="currentColor" opacity="0.18" />
          <rect x="28" y="70" width="18" height="28" rx="4" fill="currentColor" opacity="0.6" />
          <rect x="56" y="54" width="18" height="44" rx="4" fill="currentColor" opacity="0.75" />
          <rect x="84" y="40" width="18" height="58" rx="4" fill="currentColor" opacity="0.9" />
          <rect x="112" y="30" width="18" height="68" rx="4" fill="currentColor" />
        </svg>
      }
      actions={
        <LinkButton href="#pianifica" variant="secondary">
          Pianifica un report
        </LinkButton>
      }
    />
  );
}

/** Dismissible onboarding hero driven by local state. */
export function Onboarding() {
  const [step, setStep] = useState(1);
  const done = step > 3;
  return (
    <HeroCard
      variant="subtle"
      headingLevel={3}
      eyebrow={done ? 'Completato' : `Passo ${step} di 3`}
      title={done ? 'Workspace pronto!' : 'Configura il tuo workspace'}
      description={done ? 'Puoi sempre modificare le impostazioni dal menu Account.' : 'Invita il team, collega una fonte dati e crea la prima dashboard.'}
      actions={
        done ? (
          <Button variant="secondary" onPress={() => setStep(1)}>
            Ricomincia
          </Button>
        ) : (
          <Button variant="secondary" onPress={() => setStep((s) => s + 1)}>
            Passo successivo
          </Button>
        )
      }
    />
  );
}
