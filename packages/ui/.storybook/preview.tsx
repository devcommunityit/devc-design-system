import '../src/styles/index.css';
import type { Decorator, Preview } from '@storybook/react-vite';
import { LocaleProvider, PRESET_NAMES, ThemeProvider, getDefaultMessages, type Density, type PresetName, type ThemeMode } from '../src';

const MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];
const DENSITIES: readonly Density[] = ['comfortable', 'compact'];
/** Locales with a built-in message bundle; the first one is the default. */
const LOCALE_ITEMS = [
  { value: 'it-IT', title: 'Italiano' },
  { value: 'en-US', title: 'English' },
  { value: 'es-ES', title: 'Español' },
  { value: 'fr-FR', title: 'Français' },
  { value: 'de-DE', title: 'Deutsch' },
  { value: 'pt-BR', title: 'Português (Brasil)' },
  { value: 'ar-EG', title: 'العربية (RTL)' },
] as const;
const LOCALES = LOCALE_ITEMS.map((item) => item.value);
type StoryLocale = (typeof LOCALE_ITEMS)[number]['value'];

const pick = <T extends string>(options: readonly T[], value: unknown, fallback: T): T =>
  options.find((option) => option === value) ?? fallback;

const withProviders: Decorator = (Story, context) => {
  const mode = pick(MODES, context.globals.mode, 'light');
  const palette = pick<PresetName>(PRESET_NAMES, context.globals.palette, PRESET_NAMES[0]);
  const density = pick(DENSITIES, context.globals.density, 'comfortable');
  const locale = pick<StoryLocale>(LOCALES, context.globals.locale, 'it-IT');
  const dir = locale === 'ar-EG' ? 'rtl' : 'ltr';
  return (
    <LocaleProvider locale={locale} messages={getDefaultMessages(locale)}>
      <ThemeProvider mode={mode} theme={palette} density={density} surface lang={locale} dir={dir} style={{ padding: '1.5rem', minBlockSize: '100vh' }}>
        <Story />
      </ThemeProvider>
    </LocaleProvider>
  );
};

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
  initialGlobals: { mode: 'light', palette: PRESET_NAMES[0], density: 'comfortable', locale: 'it-IT' },
  globalTypes: {
    mode: { description: 'Modalità colore', toolbar: { title: 'Modalità', icon: 'mirror', items: [...MODES], dynamicTitle: true } },
    palette: { description: 'Preset cromatico', toolbar: { title: 'Palette', icon: 'paintbrush', items: [...PRESET_NAMES], dynamicTitle: true } },
    density: { description: 'Densità', toolbar: { title: 'Densità', icon: 'component', items: [...DENSITIES], dynamicTitle: true } },
    locale: {
      description: 'Locale e direzione',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [...LOCALE_ITEMS],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
