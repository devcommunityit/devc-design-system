import { useState } from 'react';
import { Button, Fieldset, Form, Inline, NativeSelect, Stack, TextField } from '@devcommunityit/ui';

export function Basic() {
  return (
    <Fieldset legend="Indirizzo di spedizione" description="Usato solo per la consegna.">
      <Stack gap={4}>
        <TextField label="Via e numero civico" autoComplete="street-address" />
        <Inline gap={4} wrap align="start">
          <TextField label="CAP" autoComplete="postal-code" inputProps={{ inputMode: 'numeric' }} />
          <TextField label="Città" autoComplete="address-level2" />
        </Inline>
        <NativeSelect label="Paese" autoComplete="country" defaultValue="IT" options={[{ value: 'IT', label: 'Italia' }, { value: 'CH', label: 'Svizzera' }, { value: 'FR', label: 'Francia' }]} />
      </Stack>
    </Fieldset>
  );
}

export function GroupError() {
  const [from, setFrom] = useState('2025-03-10');
  const [to, setTo] = useState('2025-03-05');
  const invalid = Boolean(from && to && to < from);
  return (
    <Fieldset legend="Periodo" legendVariant="label" isInvalid={invalid} errorMessage="La data di fine deve seguire quella di inizio.">
      <Inline gap={4} wrap>
        <TextField label="Dal" type="date" value={from} onChange={setFrom} />
        <TextField label="Al" type="date" value={to} onChange={setTo} isInvalid={invalid} />
      </Inline>
    </Fieldset>
  );
}

export function Disabled() {
  const [locked, setLocked] = useState(true);
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Stack gap={4}>
        <Fieldset legend="Billing details" disabled={locked} description="Pass isDisabled to library controls too, so their style matches.">
          <Stack gap={4}>
            <TextField label="VAT number" defaultValue="IT01234567890" isDisabled={locked} />
            <TextField label="SDI code" defaultValue="M5UXCR1" isDisabled={locked} />
          </Stack>
        </Fieldset>
        <Button variant="secondary" onPress={() => setLocked((l) => !l)}>
          {locked ? 'Modifica' : 'Blocca'}
        </Button>
      </Stack>
    </Form>
  );
}