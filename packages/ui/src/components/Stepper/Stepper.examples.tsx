import { useState } from 'react';
import { Button, Inline, Stack, Stepper, Text, type StepperStep } from '@dev-community/ui';

const steps: StepperStep[] = [
  { id: 'account', label: 'Account', description: 'Email e password' },
  { id: 'company', label: 'Azienda', description: 'Ragione sociale e P. IVA' },
  { id: 'plan', label: 'Piano', description: 'Scelta dell’abbonamento' },
  { id: 'confirm', label: 'Conferma' },
];

export function Interactive() {
  const [current, setCurrent] = useState(1);
  return (
    <Stack gap={4}>
      <Stepper steps={steps} currentStep={current} onStepPress={(index) => setCurrent(index)} aria-label="Registrazione" />
      <Text variant="body-sm" tone="secondary">
        Passaggio {current + 1} di {steps.length}: i passaggi completati sono pulsanti per tornare indietro.
      </Text>
      <Inline gap={2}>
        <Button variant="outline" isDisabled={current === 0} onPress={() => setCurrent((c) => c - 1)}>
          Indietro
        </Button>
        <Button isDisabled={current === steps.length - 1} onPress={() => setCurrent((c) => c + 1)}>
          Avanti
        </Button>
      </Inline>
    </Stack>
  );
}

export function WithError() {
  const withError = steps.map((s) => (s.id === 'company' ? { ...s, hasError: true, description: 'P. IVA non valida' } : s));
  return <Stepper steps={withError} currentStep={2} aria-label="Registrazione" />;
}

export function Vertical() {
  return <Stepper steps={steps} currentStep={2} orientation="vertical" aria-label="Onboarding" />;
}
