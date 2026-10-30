import { Alert } from '@dev-community/ui';
import { DocSection, RefTable } from '../components/Doc';

export default function Accessibilita() {
  return (
    <>
      <Alert tone="info" title="Nessuna dichiarazione di conformità">
        La libreria è progettata rispetto ai criteri pertinenti di WCAG 2.2 livello AA. La conformità riguarda però una pagina o un servizio
        completo, non una libreria: dipende da contenuti, testi alternativi, ordine dei titoli e flussi del consumer, e richiede verifiche manuali con
        tecnologie assistive. I test automatici rilevano solo una parte dei problemi.
      </Alert>

      <DocSection title="Principi applicati">
        <ul>
          <li>HTML nativo prima di ARIA: button, a, input, select, fieldset, table, dialog semantici.</li>
          <li>
            Widget complessi (Combobox, Select, Menu, Tabs, Calendar, Slider, Dialog) basati su React Aria, che implementa i pattern WAI-ARIA APG
            con gestione di focus, tastiera e annunci.
          </li>
          <li>Ogni controllo ha un nome accessibile; label, descrizione ed errore sono collegati tramite id (aria-describedby / aria-errormessage).</li>
          <li>
            Il focus visibile usa un anello con contrasto minimo 3:1. Con header sticky nel tuo layout imposta <code>scroll-padding-top</code> sul
            documento perché l’elemento focalizzato non venga coperto (2.4.11).
          </li>
          <li>Stati e feedback combinano colore, icona e testo; nessuna informazione affidata solo al colore.</li>
          <li>Target interattivi di almeno 24×24 CSS px anche in densità compatta; 40px o più in densità comoda.</li>
          <li>prefers-reduced-motion azzera le durate; forced-colors usa i colori di sistema per bordi e focus.</li>
          <li>Nessun blocco dello zoom; layout fluidi senza scroll orizzontale globale a 320 CSS px.</li>
        </ul>
      </DocSection>

      <DocSection title="Overlay">
        <RefTable
          label="Comportamento degli overlay"
          columns={['Componente', 'Focus iniziale', 'Contenimento', 'Escape', 'Ripristino']}
          rows={[
            ['Dialog / Drawer', 'Primo elemento focalizzabile o autoFocus', 'Sì', 'Chiude', 'Al controllo di apertura'],
            ['AlertDialog', 'Azione di annullamento', 'Sì', 'Chiude (salvo isKeyboardDismissDisabled o conferma in corso); il backdrop non chiude', 'Al controllo di apertura'],
            ['Popover / Menu', 'Contenuto o prima voce', 'Gestito da React Aria (Tab chiude il Menu)', 'Chiude', 'Al trigger'],
            ['Tooltip', 'Nessuno', 'No', 'Chiude', '—'],
            ['Toast', 'Nessuno (annuncio tramite regione live)', 'No', '—', 'Raggiungibile con Tab; nessuna scorciatoia F6'],
          ]}
        />
        <p>
          Gli overlay modali bloccano lo scroll del documento e rendono inerte il resto della pagina; gli overlay annidati (es. Select dentro un
          Dialog) chiudono soltanto il livello più alto con Escape.
        </p>
      </DocSection>

      <DocSection title="Cosa è verificato">
        <RefTable
          label="Verifiche"
          columns={['Tipo', 'Strumento', 'Copertura']}
          rows={[
            ['Unit e interazione', 'Vitest + Testing Library + user-event', 'Tastiera, focus, controlled/uncontrolled, validazione per ogni componente'],
            ['Regole automatiche', 'axe-core nei test dei componenti', 'Nomi accessibili, ruoli, attributi ARIA validi'],
            ['Browser', 'Playwright + @axe-core/playwright (cartella e2e/)', 'Pagine reali a 320–1440 px, tema scuro, RTL, overlay e flussi da tastiera'],
            ['Regole axe nel browser', 'e2e/a11y.spec.ts', 'Tutte le pagine componente, guide e showcase, in tema chiaro e scuro (tag WCAG 2.0/2.1/2.2 A e AA)'],
            ['Reflow e zoom', 'e2e/responsive.spec.ts', '320, 375, 768, 1024, 1440 px; zoom 200% simulato (viewport 640 e 320 con deviceScaleFactor 2); testo al 200% su 375 px'],
            ['Contrasto', 'Generatore dei token', 'Coppie testo/sfondo dei preset in chiaro e scuro (la build fallisce sotto soglia)'],
          ]}
        />
        <p>
          Lo zoom del browser è simulato riducendo la viewport CSS e raddoppiando il fattore di scala del dispositivo: il layout risultante è quello
          che il browser calcola a 200% e 400% su schermi da 1280 px. L’ingrandimento solo del testo è simulato impostando <code>font-size: 200%</code>{' '}
          sull’elemento radice.
        </p>
        <p>Nei test del browser sono escluse due sole classi di segnalazioni, motivate e limitate nel file <code>e2e/fixtures.ts</code>:</p>
        <ul>
          <li>
            <code>color-contrast</code> su controlli disabilitati: WCAG 1.4.3 esclude i componenti inattivi.
          </li>
          <li>
            <code>label-content-name-mismatch</code> su opzioni di elenco con descrizione: il nome accessibile coincide con l’etichetta visibile e la
            descrizione è collegata con <code>aria-describedby</code>; la regola (sperimentale) confronta invece l’intero testo visibile.
          </li>
        </ul>
        <p>
          Restano necessarie verifiche manuali con screen reader (NVDA, JAWS, VoiceOver, TalkBack), con ingrandimento del testo e con la modalità
          a contrasto elevato del sistema, sui flussi del tuo portale. Queste verifiche manuali non sono state eseguite su questa versione.
        </p>
      </DocSection>

      <DocSection title="Responsabilità del consumer">
        <ul>
          <li>Impostare <code>lang</code> e <code>dir</code> sul documento e un titolo di pagina significativo.</li>
          <li>Mantenere una gerarchia di titoli coerente e landmark unici (un solo main).</li>
          <li>Fornire label in ogni controllo, testi alternativi alle immagini e messaggi di errore comprensibili.</li>
          <li>Verificare il contrasto dei temi personalizzati (il Theme Builder segnala le coppie insufficienti).</li>
          <li>Non comunicare informazioni critiche solo tramite Toast: usa Alert o Banner persistenti.</li>
        </ul>
      </DocSection>
    </>
  );
}
