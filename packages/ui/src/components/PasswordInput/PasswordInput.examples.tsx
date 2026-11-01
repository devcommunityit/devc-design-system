import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button, Form, Inline, List, PasswordInput, Stack, Text, TextField, VisuallyHidden } from '@devcommunityit/ui';

export function Basic() {
  return <PasswordInput label="Password" startAdornment={<Lock />} />;
}

export function NewPassword() {
  const [status, setStatus] = useState<string | null>(null);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus('Password valid by the client rules (local demo: nothing is sent or stored).');
      }}
    >
      <Stack gap={4}>
        <TextField label="Email" type="email" name="email" autoComplete="username" isRequired />
        <PasswordInput
          label="Nuova password"
          name="password"
          autoComplete="new-password"
          isRequired
          minLength={12}
          description="Almeno 12 caratteri. Le regole definitive le applica il server."
          errorMessage={(v) => (v.validationDetails.valueMissing ? 'Inserisci una password.' : 'Usa almeno 12 caratteri.')}
        />
        <Button type="submit">Crea account</Button>
        {status ? <p role="status">{status}</p> : null}
      </Stack>
    </Form>
  );
}

export function States() {
  return (
    <Stack gap={4}>
      <PasswordInput label="Invalid" defaultValue="1234" isInvalid errorMessage="Password errata." />
      <PasswordInput label="Disabled" defaultValue="segreta" isDisabled />
      <PasswordInput label="Revealed by default" defaultValue="Visible-at-first" defaultRevealed />
    </Stack>
  );
}
const rules = [
  { id: 'length', label: 'Almeno 12 caratteri', test: (v: string) => v.length >= 12 },
  { id: 'upper', label: 'Una lettera maiuscola', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'digit', label: 'Una cifra', test: (v: string) => /\d/.test(v) },
  { id: 'symbol', label: 'Un simbolo (es. ! ? # @)', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function Controlled() {
  const [value, setValue] = useState('');
  const passed = rules.filter((r) => r.test(value)).length;
  return (
    <Stack gap={3}>
      <PasswordInput
        label="Nuova password"
        autoComplete="new-password"
        value={value}
        onChange={setValue}
        description="Requisiti verificati localmente mentre scrivi (esempio dimostrativo)."
      />
      <List aria-label="Requisiti della password">
        {rules.map((r) => (
          <li key={r.id}>
            <span aria-hidden="true">{r.test(value) ? '✓ ' : '○ '}</span>
            {r.label}
            <VisuallyHidden>{r.test(value) ? ' (soddisfatto)' : ' (non soddisfatto)'}</VisuallyHidden>
          </li>
        ))}
      </List>
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        {passed} requisiti su {rules.length} · lunghezza attuale: {value.length} caratteri
      </Text>
      <Inline gap={2}>
        <Button size="sm" variant="secondary" onPress={() => setValue('Esempio-Sicuro-2025')}>
          Inserisci password di esempio
        </Button>
        <Button size="sm" variant="ghost" onPress={() => setValue('')} isDisabled={value === ''}>
          Svuota
        </Button>
      </Inline>
    </Stack>
  );
}

export function ConfirmPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const mismatch = confirm !== '' && confirm !== password;
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setResult(mismatch ? null : 'Le password coincidono (demo locale: nulla viene inviato).');
      }}
    >
      <Stack gap={4}>
        <PasswordInput label="Password" autoComplete="new-password" value={password} onChange={setPassword} isRequired />
        <PasswordInput
          label="Conferma password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          isRequired
          isInvalid={mismatch}
          errorMessage="Le due password non coincidono."
        />
        <PasswordInput label="Password attuale (sola lettura)" defaultValue="non-modificabile" isReadOnly />
        <Button type="submit" isDisabled={mismatch}>
          Aggiorna password
        </Button>
        {result ? <p role="status">{result}</p> : null}
      </Stack>
    </Form>
  );
}
