import { Alert, Link } from '@dev-community/ui';
import { Code, DocSection } from '../components/Doc';

export default function Integrazione() {
  return (
    <>
      <DocSection title="Principi">
        <ul>
          <li>La libreria non dipende da router, backend o dal sito di documentazione.</li>
          <li>
            Nessun reset globale: gli stili toccano solo elementi con classi <code>dc-…</code> e le variabili <code>--dc-…</code> sono definite sotto{' '}
            <code>[data-dc-theme]</code>, cioè dentro un <code>ThemeProvider</code>.
          </li>
          <li>
            Il provider non modifica <code>&lt;html&gt;</code>, <code>lang</code> o <code>dir</code> se non lo chiedi (<code>applyToDocument</code>) e non
            usa lo storage se non abiliti <code>persistence</code>.
          </li>
          <li>Nessun accesso a <code>window</code>, <code>document</code> o <code>localStorage</code> durante l’import dei moduli.</li>
        </ul>
      </DocSection>

      <DocSection title="Vite">
        <p>Non serve configurazione: Vite gestisce ESM e import CSS. Importa gli stili nell’entry point.</p>
        <Code>{`
// src/main.tsx
import '@dev-community/ui/styles.css';
import './app.css'; // gli stili dell'app dopo quelli della libreria
`}</Code>
      </DocSection>

      <DocSection title="Collegare il router">
        <p>
          Link, LinkButton, voci di Menu, Breadcrumb, Sidebar, SiteHeader e Footer usano la navigazione di react-aria. Senza configurazione
          eseguono una navigazione nativa del browser. Per una SPA collega il tuo router una volta, con <code>RouterProvider</code> (riesportato dalla
          libreria):
        </p>
        <Code title="React Router">{`
import { useHref, useNavigate } from 'react-router';
import { RouterProvider } from '@dev-community/ui';

// useHref di React Router tratta ogni valore come percorso: gli URL esterni vanno lasciati invariati,
// altrimenti "https://…" diventa "/pagina-corrente/https:/…".
function useRouterHref(href: string) {
  const isExternal = /^[a-z][a-z\\d+.-]*:/i.test(href) || href.startsWith('//');
  const resolved = useHref(isExternal ? '.' : href);
  return isExternal ? href : resolved;
}

export function UiRouter({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={(to) => void navigate(to)} useHref={useRouterHref}>
      {children}
    </RouterProvider>
  );
}
`}</Code>
        <Code title="Next.js App Router (client component)">{`
'use client';
import { useRouter } from 'next/navigation';
import { RouterProvider } from '@dev-community/ui';

export function UiRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return <RouterProvider navigate={(to) => router.push(to)}>{children}</RouterProvider>;
}
`}</Code>
        <Alert tone="info" title="Link a frammenti">
          Con alcuni router, gli href <code>#sezione</code> passano dalla funzione <code>navigate</code>. Se il router non gestisce lo scroll ai frammenti,
          intercettali e imposta <code>window.location.hash</code>, come fa questo sito.
        </Alert>
      </DocSection>

      <DocSection title="Provider annidati">
        <p>
          Un <code>ThemeProvider</code> interno eredita dal genitore ciò che non specifica. Usalo per un’area con palette o densità diversa (un pannello
          amministrativo compatto, un’anteprima del tema, un widget del partner).
        </p>
        <Code>{`
<ThemeProvider defaultTheme="aurora" defaultMode="system" surface>
  <Portal />
  <ThemeProvider theme="graphite" density="compact">
    <AdminPanel /> {/* Dialog, Menu, Tooltip, Toast aperti qui usano graphite + compact */}
  </ThemeProvider>
</ThemeProvider>
`}</Code>
        <p>
          Gli overlay (Dialog, AlertDialog, Drawer, Popover, Tooltip, Menu, Select, Combobox, DatePicker, Toast) sono montati in un contenitore creato dal
          provider più vicino, con gli stessi attributi di tema: ereditano palette, modalità, densità e direzione del punto di origine.
        </p>
      </DocSection>

      <DocSection title="Coesistenza con CSS esistenti">
        <ul>
          <li>Classi e variabili sono prefissate (<code>dc-</code>, <code>--dc-</code>): nessun conflitto di nomi con Bootstrap, Tailwind o CSS legacy.</li>
          <li>
            Se l’app ha regole globali aggressive (per esempio <code>button {'{'} all: unset {'}'}</code> o <code>* {'{'} line-height: … {'}'}</code>),
            racchiudile in un cascade layer: gli stili non stratificati della libreria vincono su quelli in layer.
          </li>
          <li>Tailwind non è richiesto né incluso; può coesistere senza configurazione.</li>
          <li>
            Il contenuto di un microfrontend può avere un proprio <code>ThemeProvider</code>: i token sono definiti per sottoalbero, non su{' '}
            <code>:root</code>.
          </li>
        </ul>
      </DocSection>

      <DocSection title="Stringhe e lingua">
        <p>
          Le stringhe di sistema (chiudi, carica altro, nessun risultato…) arrivano da <code>LocaleProvider</code>, con pacchetti italiano e inglese inclusi
          e override parziali. Vedi <Link href="/guide/localizzazione-rtl">Localizzazione e RTL</Link>.
        </p>
      </DocSection>

      <DocSection title="Pattern pronti per i portali">
        <p>
          <Link href="/componenti/site-header">SiteHeader e Footer</Link>, <Link href="/componenti/user-menu">UserMenu</Link> (header dell’utente
          autenticato), <Link href="/componenti/auth-forms">LoginForm, SignUpForm, PasswordResetForm</Link> e{' '}
          <Link href="/componenti/app-shell">AppShell</Link> coprono le strutture ricorrenti. Non contengono logica di autenticazione: ricevono dati e
          callback dall’applicazione.
        </p>
      </DocSection>
    </>
  );
}
