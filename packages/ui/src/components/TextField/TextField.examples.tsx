import { useState } from 'react';
import { Mail, Search } from 'lucide-react';
import { Button, Field, Form, Stack, TextField, Textarea } from '@devcommunityit/ui';

export function Basic() {
  return <TextField label="Nome completo" placeholder="Mario Rossi" autoComplete="name" />;
}

export function WithDescriptionAndRequired() {
  return (
    <Stack gap={4}>
      <TextField label="Email di lavoro" type="email" isRequired description="La useremo solo per le notifiche di sistema." startAdornment={<Mail />} />
      <TextField label="Company" necessityIndicator="label" isRequired description="Indicator shown as text instead of an asterisk." />
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <TextField label="Invalid" defaultValue="mario@" isInvalid errorMessage="Inserisci un indirizzo email valido." />
      <TextField label="Read-only" defaultValue="IT60X0542811101000000123456" isReadOnly description="IBAN verificato: non modificabile." />
      <TextField label="Disabled" defaultValue="Non disponibile" isDisabled />
      <TextField label="Search" placeholder="Cerca…" startAdornment={<Search />} type="search" />
    </Stack>
  );
}

export function Controlled() {
  const [value, setValue] = useState('');
  return (
    <Stack gap={2}>
      <TextField label="Codice fiscale" value={value} onChange={(v) => setValue(v.toUpperCase())} maxLength={16} description="Il valore viene convertito in maiuscolo." />
      <p>
        Valore: <code>{value || '—'}</code>
      </p>
    </Stack>
  );
}

export function Validation() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(new FormData(e.currentTarget).get('username')?.toString() ?? '');
      }}
    >
      <Stack gap={4}>
        <TextField
          label="Username"
          name="username"
          isRequired
          minLength={3}
          validate={(v) => (/^[a-z0-9_]*$/.test(v) ? null : 'Use only lowercase letters, numbers and _')}
          errorMessage={(v) => (v.validationDetails.valueMissing ? 'Username is required.' : v.validationErrors.join(' '))}
        />
        <Button type="submit">Check</Button>
        {submitted !== null ? <p role="status">Valid username: {submitted}</p> : null}
      </Stack>
    </Form>
  );
}

export function MultiLine() {
  return <Textarea label="Note per il supporto" maxLength={280} showCount description="Massimo 280 caratteri." />;
}

export function CustomControl() {
  const [value, setValue] = useState('#0b57d0');
  const invalid = !/^#[0-9a-f]{6}$/i.test(value);
  return (
    <Field label="Brand color (custom control)" description="Field adds label, description and error to any native or third-party control." isInvalid={invalid} errorMessage="Use the #rrggbb format.">
      {(props) => <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />}
    </Field>
  );
}
