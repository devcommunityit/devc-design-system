import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Inline,
  ListBoxItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  useTheme,
  useToast,
  PRESET_META,
  PRESET_NAMES,
  type PresetName,
  type ThemeMode,
} from '@dev-community/ui';
import { useDocsSettings } from '../settings';
import { simulateLatency } from './data';

interface NotificationPrefs {
  orders: boolean;
  payments: boolean;
  digest: boolean;
  marketing: boolean;
}
const defaultPrefs: NotificationPrefs = { orders: true, payments: true, digest: false, marketing: false };

function isPreset(value: unknown): value is PresetName {
  return typeof value === 'string' && (PRESET_NAMES as readonly string[]).includes(value);
}
function isMode(value: string): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function SettingsPage() {
  const { mode, setMode, theme, setTheme, density, setDensity, persistenceError } = useTheme();
  const { language, setLanguage } = useDocsSettings();
  const toast = useToast();
  const [saved, setSaved] = useState<NotificationPrefs>(defaultPrefs);
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [saving, setSaving] = useState(false);
  const dirty = (Object.keys(prefs) as Array<keyof NotificationPrefs>).some((k) => prefs[k] !== saved[k]);
  const toggle = (key: keyof NotificationPrefs) => (value: boolean) => setPrefs((p) => ({ ...p, [key]: value }));

  return (
    <Stack gap={6} className="sc-narrow">
      <Stack gap={1}>
        <Heading level={1} size="headline-md">
          Impostazioni
        </Heading>
        <Text tone="secondary">L’aspetto si applica subito a tutto il sito; le notifiche sono una simulazione locale.</Text>
      </Stack>

      <Card variant="outlined">
        <CardHeader headingLevel={2} title="Aspetto" subtitle="Preferenze reali, salvate in questo browser dal ThemeProvider." />
        <CardBody>
          <Stack gap={5}>
            <RadioGroup label="Modalità colore" value={mode} onChange={(v) => isMode(v) && setMode(v)} orientation="horizontal">
              <Radio value="light">Chiara</Radio>
              <Radio value="dark">Scura</Radio>
              <Radio value="system" description="Segue il sistema operativo">
                Sistema
              </Radio>
            </RadioGroup>
            <Select
              label="Palette"
              selectedKey={isPreset(theme.name) ? theme.name : null}
              placeholder={theme.label}
              onSelectionChange={(key) => isPreset(key) && setTheme(key)}
            >
              {PRESET_NAMES.map((name) => (
                <ListBoxItem key={name} id={name} description={PRESET_META[name].description}>
                  {PRESET_META[name].label.it}
                </ListBoxItem>
              ))}
            </Select>
            <Switch isSelected={density === 'compact'} onChange={(on) => setDensity(on ? 'compact' : 'comfortable')} description="Riduce altezze dei controlli e spaziature, senza cambiare i colori.">
              Densità compatta
            </Switch>
            <RadioGroup label="Lingua dei messaggi di sistema" value={language} onChange={(v) => setLanguage(v === 'en' ? 'en' : 'it')} orientation="horizontal">
              <Radio value="it">Italiano</Radio>
              <Radio value="en">English</Radio>
            </RadioGroup>
            {persistenceError ? (
              <Alert tone="warning" title="Preferenze non salvate">
                Il browser non consente di salvare le preferenze ({persistenceError.message}). Restano valide fino alla chiusura della pagina.
              </Alert>
            ) : null}
          </Stack>
        </CardBody>
      </Card>

      <Card variant="outlined">
        <CardHeader headingLevel={2} title="Notifiche email" subtitle="Simulazione: il salvataggio aggiorna solo lo stato della pagina." />
        <CardBody>
          <Stack gap={4}>
            <Switch isSelected={prefs.orders} onChange={toggle('orders')} description="Nuovi ordini e cambi di stato.">
              Ordini
            </Switch>
            <Switch isSelected={prefs.payments} onChange={toggle('payments')} description="Pagamenti ricevuti e non riusciti.">
              Pagamenti
            </Switch>
            <Switch isSelected={prefs.digest} onChange={toggle('digest')} description="Un riepilogo ogni lunedì mattina.">
              Riepilogo settimanale
            </Switch>
            <Switch isSelected={prefs.marketing} onChange={toggle('marketing')}>
              Novità sul prodotto
            </Switch>
          </Stack>
        </CardBody>
        <CardFooter justify="end">
          <Inline gap={2}>
            <Button variant="ghost" isDisabled={!dirty || saving} onPress={() => setPrefs(saved)}>
              Annulla modifiche
            </Button>
            <Button
              isDisabled={!dirty}
              isPending={saving}
              onPress={() => {
                setSaving(true);
                void simulateLatency().then(() => {
                  setSaved(prefs);
                  setSaving(false);
                  toast.show({ title: 'Preferenze di notifica salvate', description: 'Solo in memoria (simulazione).', tone: 'success' });
                });
              }}
            >
              Salva notifiche
            </Button>
          </Inline>
        </CardFooter>
      </Card>
    </Stack>
  );
}
