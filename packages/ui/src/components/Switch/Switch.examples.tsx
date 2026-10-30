import { useState } from 'react';
import { Divider, Stack, Switch, Text } from '@dev-community/ui';

export function Basic() {
  return <Switch defaultSelected>Notifiche email</Switch>;
}

export function Controlled() {
  const [on, setOn] = useState(false);
  return (
    <Stack gap={2}>
      <Switch isSelected={on} onChange={setOn} description="Vale solo per questo browser.">
        Modalità risparmio dati
      </Switch>
      <Text variant="body-sm" tone="secondary">
        Stato: {on ? 'attiva' : 'disattiva'}
      </Text>
    </Stack>
  );
}

export function SettingsList() {
  const [prefs, setPrefs] = useState({ digest: true, mentions: true, marketing: false });
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }));
  return (
    <Stack gap={3} style={{ maxInlineSize: '28rem' }}>
      <Switch labelPosition="start" isSelected={prefs.digest} onChange={set('digest')} description="Un riepilogo ogni lunedì.">
        Riepilogo settimanale
      </Switch>
      <Divider />
      <Switch labelPosition="start" isSelected={prefs.mentions} onChange={set('mentions')}>
        Menzioni e risposte
      </Switch>
      <Divider />
      <Switch labelPosition="start" isSelected={prefs.marketing} onChange={set('marketing')}>
        Product news and offers
      </Switch>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={3}>
      <Switch>Off</Switch>
      <Switch defaultSelected>On</Switch>
      <Switch isDisabled>Disabled</Switch>
      <Switch isDisabled defaultSelected>
        Disabled on
      </Switch>
      <Switch isReadOnly isSelected>
        Read-only
      </Switch>
    </Stack>
  );
}