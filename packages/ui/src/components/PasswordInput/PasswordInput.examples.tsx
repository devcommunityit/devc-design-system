import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button, Form, PasswordInput, Stack, TextField } from '@dev-community/ui';

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