import { useState } from 'react';
import { Button, Inline, Stack, Stepper, Text, TextField, type StepperStep } from '@devcommunityit/ui';

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
  return <Stepper steps={withError} currentStep={2} aria-label="Registrazione con errore" />;
}

export function Vertical() {
  return <Stepper steps={steps} currentStep={2} orientation="vertical" aria-label="Onboarding" />;
}

const quoteSteps: StepperStep[] = [
  { id: 'contacts', label: 'Contatti', description: 'Nome ed email' },
  { id: 'address', label: 'Indirizzo', description: 'Luogo dell’intervento' },
  { id: 'summary', label: 'Riepilogo' },
];

export function GuidedForm() {
  const [current, setCurrent] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [attempted, setAttempted] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const errors: Record<string, boolean> = {
    contacts: name.trim() === '' || !email.includes('@'),
    address: city.trim() === '',
    summary: false,
  };
  const currentId = quoteSteps[current]?.id ?? 'summary';
  const showErrors = attempted.includes(currentId);
  const stepsWithState = quoteSteps.map((step) => ({ ...step, hasError: attempted.includes(step.id) && errors[step.id] === true }));
  const next = () => {
    if (errors[currentId]) {
      setAttempted((a) => (a.includes(currentId) ? a : [...a, currentId]));
      return;
    }
    setCurrent((c) => c + 1);
  };
  const reset = () => {
    setCurrent(0);
    setName('');
    setEmail('');
    setCity('');
    setAttempted([]);
    setSent(false);
  };
  return (
    <Stack gap={4}>
      <Stepper steps={stepsWithState} currentStep={current} onStepPress={(index) => setCurrent(index)} aria-label="Richiesta preventivo" />
      {sent ? (
        <Text role="status">
          Richiesta inviata: ti contatteremo all’indirizzo {email} per l’intervento a {city}.
        </Text>
      ) : currentId === 'contacts' ? (
        <Stack gap={3}>
          <TextField label="Nome e cognome" value={name} onChange={setName} isRequired isInvalid={showErrors && name.trim() === ''} errorMessage="Inserisci nome e cognome." />
          <TextField label="Email" type="email" value={email} onChange={setEmail} isRequired isInvalid={showErrors && !email.includes('@')} errorMessage="Inserisci un’email valida." />
        </Stack>
      ) : currentId === 'address' ? (
        <TextField label="Comune dell’intervento" value={city} onChange={setCity} isRequired isInvalid={showErrors && city.trim() === ''} errorMessage="Indica il comune." />
      ) : (
        <Text>
          {name} · {email} · {city}
        </Text>
      )}
      <Inline gap={2}>
        {sent ? (
          <Button variant="outline" onPress={reset}>
            Ricomincia
          </Button>
        ) : (
          <>
            <Button variant="outline" isDisabled={current === 0} onPress={() => setCurrent((c) => c - 1)}>
              Indietro
            </Button>
            {currentId === 'summary' ? (
              <Button onPress={() => setSent(true)}>Invia richiesta</Button>
            ) : (
              <Button onPress={next}>Avanti</Button>
            )}
          </>
        )}
      </Inline>
    </Stack>
  );
}