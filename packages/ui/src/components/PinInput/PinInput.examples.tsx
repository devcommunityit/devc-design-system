import { useState } from 'react';
import { Button, Form, PinInput, Stack, Text } from '@dev-community/ui';

export function Basic() {
  return <PinInput label="Codice di verifica" description="Inserisci le 6 cifre inviate via SMS." />;
}

/** Controlled with local verification (demo only: real codes are verified on the server). */
export function Controlled() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<'idle' | 'ok' | 'error'>('idle');
  return (
    <Stack gap={3} align="start">
      <PinInput
        label="One-time code"
        description="Demo: the expected code is 123456."
        value={code}
        onChange={(next) => {
          setCode(next);
          setResult('idle');
        }}
        onComplete={(full) => setResult(full === '123456' ? 'ok' : 'error')}
        isInvalid={result === 'error'}
        errorMessage="Wrong code. Check the SMS and try again."
      />
      <Text variant="body-sm" tone={result === 'ok' ? 'success' : 'secondary'} role="status">
        {result === 'ok' ? 'Code verified (local simulation).' : `Entered: ${code.length}/6`}
      </Text>
      <Button variant="ghost" size="sm" isDisabled={code === ''} onPress={() => setCode('')}>
        Clear
      </Button>
    </Stack>
  );
}

/** Masked alphanumeric code in a native form: the hidden input `name` carries the value. */
export function MaskedInForm() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get('recovery') ?? ''));
      }}
    >
      <Stack gap={3} align="start">
        <PinInput label="Codice di recupero" length={4} type="alphanumeric" mask name="recovery" size="lg" isRequired />
        <Button type="submit">Invia</Button>
        <Text variant="body-sm" tone="secondary" role="status">
          {submitted === null ? 'Nessun invio' : `Valore inviato: ${submitted.length} caratteri`}
        </Text>
      </Stack>
    </Form>
  );
}

export function Disabled() {
  return <PinInput label="PIN" length={4} defaultValue="12" isDisabled size="sm" />;
}
