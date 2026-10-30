import type { ReactNode } from 'react';
import { Code, DocSection } from '../components/Doc';

interface Issue {
  title: string;
  cause: string;
  fix: ReactNode;
}

const ISSUES: Issue[] = [
  {
    title: 'I componenti non hanno stile',
    cause: 'Il foglio di stile non è importato, oppure i componenti sono fuori da ThemeProvider (le variabili esistono solo dentro data-dc-theme).',
    fix: (
      <>
        Importa <code>@dev-community/ui/styles.css</code> una volta all’avvio e avvolgi l’applicazione in <code>ThemeProvider</code>.
      </>
    ),
  },
  {
    title: 'Dialog, Menu o Toast appaiono con il tema sbagliato',
    cause: 'Un portal personalizzato del consumer monta il contenuto in document.body, fuori dal contenitore del provider.',
    fix: (
      <>
        Usa i componenti overlay della libreria oppure monta i tuoi portal in <code>useTheme().portalContainer</code>.
      </>
    ),
  },
  {
    title: 'Errore “useTheme must be used inside <ThemeProvider>”',
    cause: 'Un componente che legge il tema è renderizzato fuori dal provider (spesso in test o storie isolate).',
    fix: (
      <>
        Avvolgi il render dei test in <code>ThemeProvider</code>, oppure usa <code>useTheme({'{ optional: true }'})</code> nel tuo codice.
      </>
    ),
  },
  {
    title: 'Hook chiamati fuori da un componente / “Invalid hook call”',
    cause: 'Due copie di React nel bundle, tipico con npm link o alias verso i sorgenti.',
    fix: (
      <>
        Verifica con <code>npm ls react react-dom</code> che esista una sola versione; react e react-dom sono peer dependencies e devono essere
        installati dall’applicazione.
      </>
    ),
  },
  {
    title: 'I link della libreria ricaricano la pagina',
    cause: 'Nessun RouterProvider configurato: la libreria usa la navigazione nativa del browser.',
    fix: (
      <>
        Avvolgi l’app in <code>RouterProvider</code> passando la funzione di navigazione del tuo router (vedi Integrazione).
      </>
    ),
  },
  {
    title: 'Il tema importato da JSON viene rifiutato',
    cause: 'Schema non valido, chiavi sconosciute, colori non esadecimali o nome riservato a un preset.',
    fix: (
      <>
        Leggi <code>result.issues</code> (codice e percorso); con <code>{'{ unknown: "ignore" }'}</code> le chiavi sconosciute diventano avvisi.
      </>
    ),
  },
  {
    title: 'La preferenza del tema non viene salvata',
    cause: 'La persistenza è disattivata per default, oppure lo storage è bloccato (modalità privata, policy aziendali).',
    fix: (
      <>
        Abilita <code>persistence</code>, scegli le <code>keys</code> e gestisci <code>onPersistenceError</code>: il tema continua a funzionare in
        memoria anche se lo storage fallisce.
      </>
    ),
  },
  {
    title: 'Flash del tema o avvisi di hydration con SSR',
    cause: 'Il server non conosce le preferenze esplicite dell’utente.',
    fix: (
      <>
        Salva le preferenze in un cookie e passa i valori iniziali al provider (vedi SSR e Next.js). Non usare <code>resolvedScheme</code> per decidere
        il markup del primo render.
      </>
    ),
  },
  {
    title: 'Gli stili della libreria vengono sovrascritti dal CSS del portale',
    cause: 'Regole globali del portale su button, input o a con specificità maggiore.',
    fix: (
      <>
        Limita i reset del portale all’area legacy oppure inseriscili in un <code>@layer</code>: gli stili non stratificati della libreria vincono su
        qualunque layer.
      </>
    ),
  },
  {
    title: 'Scroll orizzontale su mobile',
    cause: 'Elementi con larghezza fissa o contenuti lunghi senza a capo dentro flex/grid.',
    fix: (
      <>
        Usa <code>min-inline-size: 0</code> sui figli flessibili, <code>Text truncate</code> o <code>overflow-wrap: anywhere</code>; le tabelle
        ampie vanno in <code>Table</code>/<code>DataTable</code>, che hanno scroll locale.
      </>
    ),
  },
];

export default function Troubleshooting() {
  return (
    <>
      {ISSUES.map((issue) => (
        <DocSection key={issue.title} title={issue.title}>
          <p>
            <strong>Causa probabile:</strong> {issue.cause}
          </p>
          <p>
            <strong>Soluzione:</strong> {issue.fix}
          </p>
        </DocSection>
      ))}
      <DocSection title="Diagnostica rapida">
        <Code language="bash">{`
npm ls react react-dom @dev-community/ui   # una sola copia di React e della libreria
npm ls react-aria-components                # nessuna versione duplicata
`}</Code>
        <p>
          Negli strumenti per sviluppatori controlla che l’elemento del provider abbia <code>data-dc-theme</code>, <code>data-dc-palette</code>,{' '}
          <code>data-dc-scheme</code> e <code>data-dc-density</code>, e che i portal abbiano <code>data-dc-portal</code> con gli stessi attributi.
        </p>
      </DocSection>
    </>
  );
}
