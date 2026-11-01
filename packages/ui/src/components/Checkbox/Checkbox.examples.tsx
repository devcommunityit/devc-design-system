import { useState } from 'react';
import { Button, Checkbox, CheckboxGroup, Form, Stack, Text } from '@devcommunityit/ui';

export function Basic() {
  return <Checkbox defaultSelected>Ricordami su questo dispositivo</Checkbox>;
}

export function WithDescription() {
  return (
    <Checkbox description="Al massimo una email al mese. Puoi annullare quando vuoi.">Iscrivimi alla newsletter</Checkbox>
  );
}

export function States() {
  return (
    <Stack gap={3}>
      <Checkbox>Default</Checkbox>
      <Checkbox defaultSelected>Selected</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isDisabled defaultSelected>
        Disabled and selected
      </Checkbox>
      <Checkbox isReadOnly isSelected>
        Read-only
      </Checkbox>
      <Checkbox isInvalid>Invalid</Checkbox>
    </Stack>
  );
}

const channels = [
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
  { id: 'push', label: 'Notifiche push' },
];

export function SelectAll() {
  const [selected, setSelected] = useState<string[]>(['email']);
  const all = selected.length === channels.length;
  const some = selected.length > 0 && !all;
  return (
    <Stack gap={3}>
      <Checkbox isSelected={all} isIndeterminate={some} onChange={(on) => setSelected(on ? channels.map((c) => c.id) : [])}>
        Tutti i canali
      </Checkbox>
      <CheckboxGroup aria-label="Canali di notifica" value={selected} onChange={setSelected} style={{ paddingInlineStart: 'var(--dc-space-8)' }}>
        {channels.map((c) => (
          <Checkbox key={c.id} value={c.id}>
            {c.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <Text variant="body-sm" tone="secondary">
        Selezionati: {selected.length ? selected.join(', ') : 'nessuno'}
      </Text>
    </Stack>
  );
}

export function GroupValidation() {
  const [result, setResult] = useState<string | null>(null);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setResult(new FormData(e.currentTarget).getAll('topics').join(', '));
      }}
    >
      <Stack gap={4}>
        <CheckboxGroup
          label="Argomenti di interesse"
          name="topics"
          isRequired
          description="Scegli almeno un argomento."
          orientation="horizontal"
          validate={(v) => (v.length > 2 ? 'Puoi scegliere al massimo 2 argomenti.' : null)}
          errorMessage={(v) => (v.validationDetails.valueMissing ? 'Seleziona almeno un argomento.' : v.validationErrors.join(' '))}
        >
          <Checkbox value="design">Design</Checkbox>
          <Checkbox value="frontend">Frontend</Checkbox>
          <Checkbox value="backend">Backend</Checkbox>
          <Checkbox value="data">Dati</Checkbox>
        </CheckboxGroup>
        <Button type="submit">Salva preferenze</Button>
        {result !== null ? <p role="status">Preferenze salvate: {result}</p> : null}
      </Stack>
    </Form>
  );
}

export function Terms() {
  const [accepted, setAccepted] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <Stack gap={4}>
        <Checkbox name="terms" isRequired isSelected={accepted} onChange={setAccepted} errorMessage="Devi accettare i termini per continuare.">
          I accept the terms of service
        </Checkbox>
        <Button type="submit">Continue</Button>
        {sent ? <p role="status">Terms accepted (local demo, nothing is sent).</p> : null}
      </Stack>
    </Form>
  );
}