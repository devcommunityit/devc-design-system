import { useState } from 'react';
import { Button, Form, Radio, RadioGroup, Stack, Text } from '@dev-community/ui';

export function Basic() {
  return (
    <RadioGroup label="Taglia" defaultValue="m">
      <Radio value="s">Small</Radio>
      <Radio value="m">Medium</Radio>
      <Radio value="l">Large</Radio>
    </RadioGroup>
  );
}

export function WithDescriptions() {
  return (
    <RadioGroup label="Spedizione" defaultValue="standard" description="I tempi sono indicativi.">
      <Radio value="standard" description="3–5 giorni lavorativi, gratuita">
        Standard
      </Radio>
      <Radio value="express" description="Consegna in 24 ore, 9,90 €">
        Express
      </Radio>
      <Radio value="pickup" description="Temporarily unavailable" isDisabled>
        Ritiro in negozio
      </Radio>
    </RadioGroup>
  );
}

export function Horizontal() {
  return (
    <RadioGroup label="Densità" orientation="horizontal" defaultValue="comfortable">
      <Radio value="comfortable">Comoda</Radio>
      <Radio value="compact">Compatta</Radio>
    </RadioGroup>
  );
}

export function Controlled() {
  const [plan, setPlan] = useState('monthly');
  const price = plan === 'monthly' ? '12 €/mese' : '120 €/anno (2 mesi gratis)';
  return (
    <Stack gap={3}>
      <RadioGroup label="Fatturazione" value={plan} onChange={setPlan} orientation="horizontal">
        <Radio value="monthly">Mensile</Radio>
        <Radio value="yearly">Annuale</Radio>
      </RadioGroup>
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        Prezzo: {price}
      </Text>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={5}>
      <RadioGroup label="Read-only" value="b" isReadOnly>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
      <RadioGroup label="Disabled" defaultValue="a" isDisabled>
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    </Stack>
  );
}

export function Validation() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setValue(String(new FormData(e.currentTarget).get('payment')));
      }}
    >
      <Stack gap={4}>
        <RadioGroup label="Metodo di pagamento" name="payment" isRequired errorMessage="Scegli un metodo di pagamento.">
          <Radio value="card">Carta</Radio>
          <Radio value="transfer">Bonifico</Radio>
        </RadioGroup>
        <Button type="submit">Conferma</Button>
        {value ? <p role="status">Metodo scelto: {value}</p> : null}
      </Stack>
    </Form>
  );
}