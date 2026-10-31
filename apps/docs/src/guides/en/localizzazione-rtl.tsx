import { DocSection, Code, RefTable } from '../../components/Doc';

export default function LocalizzazioneRtl() {
  return (
    <>
      <DocSection title="LocaleProvider">
        <p>
          The core has no hard-coded strings in any language: every system text (Close, No results, Page 2 of 5…) comes from a
          message bundle, including theme validation errors. The bundle is chosen based on the locale’s language; for languages that
          aren’t included, English is used until you provide translations. Without a provider, the browser locale applies.
        </p>
        <RefTable
          label="Included bundles"
          columns={['Language', 'Export', 'Notes']}
          rows={[
            ['Italiano (it)', <code key="it">messagesIt</code>, 'Reviewed'],
            ['English (en)', <code key="en">messagesEn</code>, 'Reviewed; fallback for languages that aren’t included'],
            ['Español (es)', <code key="es">messagesEs</code>, 'Initial translation: needs review by a native speaker'],
            ['Français (fr)', <code key="fr">messagesFr</code>, 'Initial translation; narrow no-break spaces before « : ; ? »'],
            ['Deutsch (de)', <code key="de">messagesDe</code>, 'Initial translation: needs review by a native speaker'],
            ['Português (pt)', <code key="pt">messagesPt</code>, 'Brazilian usage (pt-BR); for pt-PT provide an override'],
            ['العربية (ar)', <code key="ar">messagesAr</code>, 'RTL; six CLDR plural forms; digits interpolated into messages stay Latin'],
          ]}
        />
        <p>
          Plurals use <code>Intl.PluralRules</code> (CLDR forms such as <code>one</code>, <code>few</code>, <code>many</code>), not a simple
          comparison with 1. Translations other than it/en are a starting point: before going to production, have native speakers review them and
          replace the keys you need with an override. By default, <code>LocaleProvider</code> includes
          only <code>it</code> and <code>en</code> (English fallback for other languages): for other languages, import the bundle and pass it to{' '}
          <code>messages</code>, so the app only downloads the languages it uses (about 11 KB minified each). <code>builtInMessages</code> and{' '}
          <code>getDefaultMessages</code> pick among all seven bundles at runtime, but include all of them in the build.
        </p>
        <Code>{`
import { LocaleProvider } from '@dev-community/ui';

<LocaleProvider locale="it-IT">
  <App />
</LocaleProvider>;

// Other languages: import only the bundle you need (tree shaking)
import { messagesDe } from '@dev-community/ui';

<LocaleProvider locale="de-AT" messages={messagesDe}>
  <App />
</LocaleProvider>;

// Runtime choice among all languages (includes every bundle): de-AT → de, ja → en
import { getDefaultMessages } from '@dev-community/ui';

<LocaleProvider locale={userLocale} messages={getDefaultMessages(userLocale)}>
  <App />
</LocaleProvider>;

// Partial override: keys you don't specify keep the bundle's values
<LocaleProvider locale="en-US" messages={{ noResults: 'No customers found' }}>
  <CustomerSearch />
</LocaleProvider>;
`}</Code>
        <p>
          The <code>Messages</code> type lists every key; some are functions that handle numbers and plurals. For a new language, start from an
          existing bundle and TypeScript will flag the missing keys:
        </p>
        <Code>{`
import { LocaleProvider, messagesEn, type Messages } from '@dev-community/ui';

const nl: Messages = {
  ...messagesEn,
  close: 'Sluiten',
  noResults: 'Geen resultaten',
  pageOf: (page, total) => \`Pagina \${page} van \${total}\`,
  selectedCount: (n) => \`\${n} geselecteerd\`,
  // …
};

<LocaleProvider locale="nl-NL" messages={nl}>
  <App />
</LocaleProvider>;
`}</Code>
        <p>
          <code>useMessages()</code> returns the current messages, <code>useLocale()</code> returns <code>{'{ locale, direction }'}</code>.
          The text of your own content (labels, titles, domain errors) remains the responsibility of your application and its translation system.
        </p>
      </DocSection>

      <DocSection title="Theme validation errors">
        <p>
          <code>parseThemeJson</code> and <code>validateTheme</code> return issues with structured <code>code</code>, <code>path</code>, and{' '}
          <code>params</code>. The <code>message</code> field is in English and is meant for logs and developers; for end users, use{' '}
          <code>formatThemeIssue</code>, which translates with the current bundle.
        </p>
        <Code>{`
import { formatThemeIssue, useMessages } from '@dev-community/ui';
import { parseThemeJson } from '@dev-community/ui/theme';

function useThemeImport() {
  const messages = useMessages();
  return (text: string) => {
    const result = parseThemeJson(text);
    return result.success ? [] : result.issues.map((i) => \`\${i.path || '—'}: \${formatThemeIssue(i, messages)}\`);
  };
}
`}</Code>
      </DocSection>

      <DocSection title="Dates, numbers, and currencies">
        <p>
          Formatting uses <code>Intl</code> with the provider’s locale: Calendar, DatePicker, TimeInput, NumberInput, Statistic, and Pagination
          respect separators, month names, and the first day of the week (configurable with <code>firstDayOfWeek</code>).
        </p>
        <RefTable
          label="Date types"
          columns={['Case', 'Type', 'Note']}
          rows={[
            ['Date without time (due date, birth date)', <code key="1">CalendarDate</code>, 'No time zone: the selected day never shifts'],
            ['Local time', <code key="2">Time</code>, 'Hours and minutes without date or time zone'],
            ['Instant with time zone', <code key="3">ZonedDateTime</code>, 'Explicit: you convert to/from UTC'],
          ]}
        />
        <Code>{`
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';

<DatePicker
  label="Delivery date"
  defaultValue={parseDate('2025-03-14')}         // 'YYYY-MM-DD', no UTC conversion
  minValue={today(getLocalTimeZone())}
/>;
`}</Code>
      </DocSection>

      <DocSection title="Right-to-left (RTL)">
        <p>
          All styles use logical properties (<code>margin-inline-start</code>, <code>padding-inline</code>, <code>inset-inline-end</code>,{' '}
          <code>text-align: start</code>), so the layout mirrors without dedicated CSS. Directional icons (arrows, chevrons) are rotated in RTL;
          keyboard interaction and navigation in Slider, Tabs, and Calendar follow the direction.
        </p>
        <Code>{`
// Direction is derived from the locale; also set lang/dir on the document or the container
<html lang="ar" dir="rtl">
  …
  <LocaleProvider locale="ar-EG" messages={messagesAr}>
    <App />
  </LocaleProvider>
</html>
`}</Code>
        <p>
          <code>LocaleProvider</code> doesn’t modify <code>&lt;html lang|dir&gt;</code>: that’s up to the host application. On this site you can choose
          العربية or enable the RTL preview from the Preferences menu at the top.
        </p>
      </DocSection>

      <DocSection title="Variable content">
        <ul>
          <li>Buttons, badges, and tabs wrap or truncate in a controlled way; with <code>Text truncate</code> the full text remains accessible.</li>
          <li>Long labels (e.g. in German) must not have fixed widths: use Stack/Inline with wrap.</li>
          <li>Plan for missing data: DescriptionList and DataTable accept empty content with an explicit placeholder.</li>
        </ul>
      </DocSection>
    </>
  );
}
