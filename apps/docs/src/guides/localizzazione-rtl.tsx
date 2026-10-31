import { DocSection, Code, RefTable } from '../components/Doc';

export default function LocalizzazioneRtl() {
  return (
    <>
      <DocSection title="LocaleProvider">
        <p>
          Il core non contiene stringhe obbligatorie in una lingua: ogni testo di sistema (Chiudi, Nessun risultato, Pagina 2 di 5…) proviene da un
          bundle di messaggi, compresi gli errori di validazione dei temi. Il bundle viene scelto in base alla lingua della locale; per lingue non
          incluse si usa l’inglese finché non fornisci le traduzioni. Senza provider vale la locale del browser.
        </p>
        <RefTable
          label="Bundle inclusi"
          columns={['Lingua', 'Export', 'Note']}
          rows={[
            ['Italiano (it)', <code key="it">messagesIt</code>, 'Rivisto'],
            ['English (en)', <code key="en">messagesEn</code>, 'Rivisto; fallback per lingue non incluse'],
            ['Español (es)', <code key="es">messagesEs</code>, 'Prima traduzione: da far rivedere a un madrelingua'],
            ['Français (fr)', <code key="fr">messagesFr</code>, 'Prima traduzione; spazi fini non separabili prima di « : ; ? »'],
            ['Deutsch (de)', <code key="de">messagesDe</code>, 'Prima traduzione: da far rivedere a un madrelingua'],
            ['Português (pt)', <code key="pt">messagesPt</code>, 'Uso brasiliano (pt-BR); per pt-PT fornisci un override'],
            ['العربية (ar)', <code key="ar">messagesAr</code>, 'RTL; sei forme plurali CLDR; le cifre interpolate nei messaggi restano latine'],
          ]}
        />
        <p>
          I plurali usano <code>Intl.PluralRules</code> (forme CLDR come <code>one</code>, <code>few</code>, <code>many</code>), non il semplice
          confronto con 1. Le traduzioni diverse da it/en sono una base di partenza: prima della produzione falle rivedere da madrelingua e
          sostituisci le chiavi necessarie con un override. <code>LocaleProvider</code> include di
          default solo <code>it</code> ed <code>en</code> (fallback inglese per le altre lingue): per le altre lingue importa il bundle e passalo in{' '}
          <code>messages</code>, così l’app scarica solo le lingue che usa (circa 11 KB minificati ciascuno). <code>builtInMessages</code> e{' '}
          <code>getDefaultMessages</code> scelgono a runtime tra tutti e sette i bundle, ma li includono tutti nella build.
        </p>
        <Code>{`
import { LocaleProvider } from '@dev-community/ui';

<LocaleProvider locale="it-IT">
  <App />
</LocaleProvider>;

// Altre lingue: importa solo il bundle che serve (tree shaking)
import { messagesDe } from '@dev-community/ui';

<LocaleProvider locale="de-AT" messages={messagesDe}>
  <App />
</LocaleProvider>;

// Scelta a runtime tra tutte le lingue (include tutti i bundle): de-AT → de, ja → en
import { getDefaultMessages } from '@dev-community/ui';

<LocaleProvider locale={userLocale} messages={getDefaultMessages(userLocale)}>
  <App />
</LocaleProvider>;

// Override parziale: le chiavi non specificate restano quelle del bundle
<LocaleProvider locale="it-IT" messages={{ noResults: 'Nessun cliente trovato' }}>
  <CustomerSearch />
</LocaleProvider>;
`}</Code>
        <p>
          Il tipo <code>Messages</code> elenca tutte le chiavi; alcune sono funzioni per gestire numeri e plurali. Per una nuova lingua parti da un
          bundle esistente e TypeScript segnalerà le chiavi mancanti:
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
          <code>useMessages()</code> restituisce i messaggi correnti, <code>useLocale()</code> restituisce <code>{'{ locale, direction }'}</code>.
          I testi dei tuoi contenuti (label, titoli, errori di dominio) restano responsabilità della tua applicazione e del suo sistema di traduzione.
        </p>
      </DocSection>

      <DocSection title="Errori di validazione dei temi">
        <p>
          <code>parseThemeJson</code> e <code>validateTheme</code> restituiscono problemi con <code>code</code>, <code>path</code> e{' '}
          <code>params</code> strutturati. Il campo <code>message</code> è in inglese ed è pensato per log e sviluppatori; per l’utente finale usa{' '}
          <code>formatThemeIssue</code>, che traduce con il bundle corrente.
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

      <DocSection title="Date, numeri e valute">
        <p>
          La formattazione usa <code>Intl</code> con la locale del provider: Calendar, DatePicker, TimeInput, NumberInput, Statistic e Pagination
          rispettano separatori, nomi dei mesi e primo giorno della settimana (configurabile con <code>firstDayOfWeek</code>).
        </p>
        <RefTable
          label="Tipi di data"
          columns={['Caso', 'Tipo', 'Nota']}
          rows={[
            ['Data senza orario (scadenza, nascita)', <code key="1">CalendarDate</code>, 'Nessun fuso: il giorno selezionato non si sposta mai'],
            ['Orario locale', <code key="2">Time</code>, 'Ore e minuti senza data né fuso'],
            ['Istante con fuso', <code key="3">ZonedDateTime</code>, 'Esplicito: converti tu da/verso UTC'],
          ]}
        />
        <Code>{`
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';

<DatePicker
  label="Data di consegna"
  defaultValue={parseDate('2025-03-14')}         // 'YYYY-MM-DD', nessuna conversione UTC
  minValue={today(getLocalTimeZone())}
/>;
`}</Code>
      </DocSection>

      <DocSection title="Destra-sinistra (RTL)">
        <p>
          Tutti gli stili usano proprietà logiche (<code>margin-inline-start</code>, <code>padding-inline</code>, <code>inset-inline-end</code>,{' '}
          <code>text-align: start</code>), quindi il layout si specchia senza CSS dedicato. Le icone direzionali (frecce, chevron) sono ruotate in RTL;
          tastiera e navigazione di Slider, Tabs e Calendar seguono la direzione.
        </p>
        <Code>{`
// La direzione deriva dalla locale; imposta anche lang/dir sul documento o sul contenitore
<html lang="ar" dir="rtl">
  …
  <LocaleProvider locale="ar-EG" messages={messagesAr}>
    <App />
  </LocaleProvider>
</html>
`}</Code>
        <p>
          <code>LocaleProvider</code> non modifica <code>&lt;html lang|dir&gt;</code>: è una scelta dell’applicazione ospite. Nel sito puoi scegliere
          العربية o attivare l’anteprima RTL dal menu Preferenze in alto.
        </p>
      </DocSection>

      <DocSection title="Contenuti variabili">
        <ul>
          <li>Pulsanti, badge e tab vanno a capo o si troncano in modo controllato; con <code>Text truncate</code> il testo completo resta accessibile.</li>
          <li>Le etichette lunghe (es. in tedesco) non devono avere larghezze fisse: usa Stack/Inline con wrap.</li>
          <li>Prevedi dati mancanti: DescriptionList e DataTable accettano contenuti vuoti con un segnaposto esplicito.</li>
        </ul>
      </DocSection>
    </>
  );
}
