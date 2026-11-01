import { Languages, Monitor, Moon, Settings2, Sun } from 'lucide-react';
import { IconButton, ListBoxItem, Popover, PopoverTrigger, Select, Stack, Switch, Text, Toggle, ToggleGroup, useTheme, type Key, type ThemeMode } from '@devcommunityit/ui';
import { PRESET_META, PRESET_NAMES, isPresetName } from '@devcommunityit/ui/theme';
import { DOCS_LANGUAGES, isDocsLanguage, useDocsSettings, useI18n } from '../settings';

const MODES: Array<{ id: ThemeMode; icon: React.ReactNode }> = [
  { id: 'light', icon: <Sun /> },
  { id: 'dark', icon: <Moon /> },
  { id: 'system', icon: <Monitor /> },
];

function isMode(key: Key): key is ThemeMode {
  return key === 'light' || key === 'dark' || key === 'system';
}

/** Site-wide appearance and locale preferences (persisted by ThemeProvider for theme/mode/density/look). */
export function PreferencesMenu() {
  const { mode, setMode, theme, setTheme, density, setDensity, look, setLook, persistenceError } = useTheme();
  const { language, setLanguage, rtl, setRtl } = useDocsSettings();
  const { lang, t } = useI18n();
  const p = t.prefs;
  return (
    <PopoverTrigger>
      <IconButton variant="ghost" icon={<Settings2 />} label={p.open} />
      <Popover title={p.title} placement="bottom end" className="docs-prefs">
        <Stack gap={4}>
          <Stack gap={1}>
            <Text as="span" variant="label-md" id="prefs-mode">
              {p.mode}
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
                  {p[m.id]}
                </Toggle>
              ))}
            </ToggleGroup>
          </Stack>
          <Select
            label={p.palette}
            value={theme.name}
            onChange={(key) => {
              if (typeof key === 'string' && isPresetName(key)) setTheme(key);
            }}
          >
            {PRESET_NAMES.map((name) => (
              <ListBoxItem key={name} id={name} textValue={PRESET_META[name].label[lang]}>
                {PRESET_META[name].label[lang]}
              </ListBoxItem>
            ))}
            {isPresetName(theme.name) ? null : (
              <ListBoxItem id={theme.name} textValue={theme.label ?? theme.name}>
                {theme.label ?? theme.name} ({p.custom})
              </ListBoxItem>
            )}
          </Select>
          <Switch
            isSelected={look === 'expressive'}
            onChange={(on) => setLook(on ? 'expressive' : 'standard')}
            description={p.expressiveHelp}
          >
            {p.expressive}
          </Switch>
          <Switch isSelected={density === 'compact'} onChange={(on) => setDensity(on ? 'compact' : 'comfortable')}>
            {p.compact}
          </Switch>
          <Select
            label={p.systemLanguage}
            description={p.systemLanguageHelp}
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
          <Switch isSelected={rtl} onChange={setRtl} description={p.rtlHelp}>
            {p.rtl}
          </Switch>
          {persistenceError ? (
            <Text variant="body-sm" tone="danger" role="status">
              {p.notSaved(persistenceError.message)}
            </Text>
          ) : (
            <Text variant="body-sm" tone="secondary">
              {p.saved}
            </Text>
          )}
        </Stack>
      </Popover>
    </PopoverTrigger>
  );
}