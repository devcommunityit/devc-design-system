import { Languages, Monitor, Moon, Settings2, Sun } from 'lucide-react';
import { IconButton, ListBoxItem, Popover, PopoverTrigger, Select, Stack, Switch, Text, Toggle, ToggleGroup, useTheme, type Key, type ThemeMode } from '@dev-community/ui';
import { PRESET_META, PRESET_NAMES, isPresetName } from '@dev-community/ui/theme';
import { DOCS_LANGUAGES, isDocsLanguage, useDocsSettings } from '../settings';

const MODES: Array<{ id: ThemeMode; label: string; icon: React.ReactNode }> = [
  { id: 'light', label: 'Chiaro', icon: <Sun /> },
  { id: 'dark', label: 'Scuro', icon: <Moon /> },
  { id: 'system', label: 'Sistema', icon: <Monitor /> },
];

function isMode(key: Key): key is ThemeMode {
  return key === 'light' || key === 'dark' || key === 'system';
}

/** Site-wide appearance and locale preferences (persisted by ThemeProvider for theme/mode/density/look). */
export function PreferencesMenu() {
  const { mode, setMode, theme, setTheme, density, setDensity, look, setLook, persistenceError } = useTheme();
  const { language, setLanguage, rtl, setRtl } = useDocsSettings();
  return (
    <PopoverTrigger>
      <IconButton variant="ghost" icon={<Settings2 />} label="Preferenze di visualizzazione" />
      <Popover title="Preferenze" placement="bottom end" className="docs-prefs">
        <Stack gap={4}>
          <Stack gap={1}>
            <Text as="span" variant="label-md" id="prefs-mode">
              Modalità
            </Text>
            <ToggleGroup
              aria-labelledby="prefs-mode"
              selectionMode="single"
              disallowEmptySelection
              attached
              selectedKeys={[mode]}
              onSelectionChange={(keys) => {
                const next = [...keys][0];
                if (next !== undefined && isMode(next)) setMode(next);
              }}
            >
              {MODES.map((m) => (
                <Toggle key={m.id} id={m.id} icon={m.icon} size="sm">
                  {m.label}
                </Toggle>
              ))}
            </ToggleGroup>
          </Stack>
          <Select
            label="Palette"
            value={theme.name}
            onChange={(key) => {
              if (typeof key === 'string' && isPresetName(key)) setTheme(key);
            }}
          >
            {PRESET_NAMES.map((name) => (
              <ListBoxItem key={name} id={name} textValue={PRESET_META[name].label.it}>
                {PRESET_META[name].label.it}
              </ListBoxItem>
            ))}
            {isPresetName(theme.name) ? null : (
              <ListBoxItem id={theme.name} textValue={theme.label ?? theme.name}>
                {theme.label ?? theme.name} (personalizzato)
              </ListBoxItem>
            )}
          </Select>
          <Switch
            isSelected={look === 'expressive'}
            onChange={(on) => setLook(on ? 'expressive' : 'standard')}
            description="Forme arrotondate, riempimenti bicolore brand → terziario e alone sulle azioni primarie."
          >
            Stile espressivo
          </Switch>
          <Switch isSelected={density === 'compact'} onChange={(on) => setDensity(on ? 'compact' : 'comfortable')}>
            Densità compatta
          </Switch>
          <Select
            label="Lingua dei testi di sistema"
            startAdornment={<Languages aria-hidden="true" size={16} />}
            value={language}
            onChange={(key) => {
              if (isDocsLanguage(key)) setLanguage(key);
            }}
          >
            {DOCS_LANGUAGES.map((l) => (
              <ListBoxItem key={l.id} id={l.id} textValue={l.label}>
                <span lang={l.id} dir={l.id === 'ar' ? 'rtl' : undefined}>
                  {l.label}
                </span>
              </ListBoxItem>
            ))}
          </Select>
          <Switch isSelected={rtl} onChange={setRtl} description="Usa la locale ar-EG e la direzione da destra a sinistra (sempre attiva con العربية).">
            Anteprima RTL
          </Switch>
          {persistenceError ? (
            <Text variant="body-sm" tone="danger" role="status">
              Le preferenze non possono essere salvate: {persistenceError.message}
            </Text>
          ) : (
            <Text variant="body-sm" tone="secondary">
              Tema, modalità, densità e stile sono salvati in questo browser.
            </Text>
          )}
        </Stack>
      </Popover>
    </PopoverTrigger>
  );
}