import { Alert } from '@devcommunityit/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

export default function SsrNextjs() {
  return (
    <>
      <DocSection title="Garanzie della libreria">
        <ul>
          <li>Nessun accesso a window, document o localStorage durante l’importazione dei moduli.</li>
          <li>
            Il punto di ingresso <code>@devcommunityit/ui/theme</code> non contiene React né DOM: usalo nei Server Component, negli script di build e
            in Node.
          </li>
          <li>
            I moduli con componenti sono marcati <code>&apos;use client&apos;</code> nel pacchetto compilato: possono essere importati da un Server
            Component e diventano automaticamente il confine client.
          </li>
          <li>
            La persistenza viene letta dopo il montaggio (mai durante il rendering), quindi il markup del server è sempre uguale al primo render del
            client: nessun mismatch di hydration.
          </li>
          <li>
            Con <code>mode=&quot;system&quot;</code> lo schema scuro è applicato da una media query CSS: nessun flash per chi usa la preferenza di
            sistema, anche senza JavaScript.
          </li>
        </ul>
      </DocSection>

      <DocSection title="Evitare il flash del tema: cookie (consigliato)">
        <p>
          Se l’utente sceglie esplicitamente chiaro/scuro, palette, densità o stile, il server deve conoscerle per produrre il markup corretto. Salva le
          preferenze in un cookie e passale al provider come valori iniziali.
        </p>
        <Code title="app/providers.tsx">{`
'use client';
import type { ReactNode } from 'react';
import { ThemeProvider, LocaleProvider, createCookieStorageAdapter, isPresetName, type ThemePreferences } from '@devcommunityit/ui';

const storage = createCookieStorageAdapter({ sameSite: 'Lax', secure: true });

export function Providers({ initial, children }: { initial: ThemePreferences; children: ReactNode }) {
  return (
    <LocaleProvider locale="it-IT">
      <ThemeProvider
        defaultMode={initial.mode ?? 'system'}
        defaultTheme={initial.theme && isPresetName(initial.theme) ? initial.theme : 'aurora'}
        defaultDensity={initial.density ?? 'comfortable'}
        defaultLook={initial.look ?? 'standard'}
        persistence={{ storage, keys: ['mode', 'theme', 'density', 'look'] }}
        surface
      >
        {children}
      </ThemeProvider>
    </LocaleProvider>
  );
}
`}</Code>
        <Code title="app/layout.tsx (Server Component)">{`
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { getThemePreferencesFromCookie } from '@devcommunityit/ui/theme';
import '@devcommunityit/ui/styles.css';
import { Providers } from './providers';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const prefs = getThemePreferencesFromCookie((await headers()).get('cookie'));
  return (
    <html lang="it">
      <body>
        <Providers initial={prefs}>{children}</Providers>
      </body>
    </html>
  );
}
`}</Code>
        <p>
          <code>getThemePreferencesFromCookie</code> valida il contenuto e non lancia eccezioni: un cookie manomesso produce semplicemente le
          preferenze di default. Nelle versioni di Next.js in cui <code>headers()</code> è sincrono rimuovi <code>await</code>.
        </p>
      </DocSection>

      <DocSection title="Siti statici e SPA">
        <p>
          In una SPA renderizzata solo sul client il provider ripristina le preferenze prima del primo paint (layout effect): non serve altro. Per
          pagine pre-renderizzate senza server (SSG) è disponibile <code>getThemeScript()</code>, uno script inline che imposta gli attributi{' '}
          <code>data-dc-*</code> su <code>&lt;html&gt;</code> leggendo localStorage prima del paint. Usalo insieme a <code>applyToDocument</code> per
          colorare subito sfondo della pagina e <code>color-scheme</code>.
        </p>
        <Code>{`
import { getThemeScript } from '@devcommunityit/ui/theme';

// nel template HTML / _document, con nonce generato per richiesta o hash statico
<script nonce={nonce} dangerouslySetInnerHTML={{ __html: getThemeScript({ storageKey: 'dc-theme' }) }} />
`}</Code>
        <Alert tone="warning" title="Limite noto">
          Lo script agisce su <code>&lt;html&gt;</code>; il contenuto dentro il provider usa i valori del markup pre-renderizzato finché React non
          completa l’hydration. Con preferenze esplicite diverse dal default può quindi comparire un breve cambio di colori in pagine SSG: per
          eliminarlo serve il rendering lato server con cookie.
        </Alert>
      </DocSection>

      <DocSection title="Content Security Policy">
        <RefTable
          label="Requisiti CSP"
          columns={['Direttiva', 'Requisito', 'Note']}
          rows={[
            [<code key="1">script-src</code>, 'Nessun unsafe-inline / unsafe-eval', 'getThemeScript, se usato, richiede nonce o hash'],
            [<code key="2">style-src-elem</code>, 'Solo i fogli di stile del pacchetto', 'Nessun <style> iniettato a runtime; nessuna dipendenza da font o CDN esterni'],
            [
              <code key="3">style-src-attr</code>,
              <span key="3b">
                <code>&apos;unsafe-inline&apos;</code> solo con SSR
              </span>,
              'Alcuni componenti (Grid, Progress, Skeleton, AspectRatio, temi personalizzati inline) usano l’attributo style. Nel rendering client gli stili sono applicati via CSSOM e non richiedono eccezioni.',
            ],
          ]}
        />
        <p>
          Per i temi personalizzati con CSP restrittiva genera il CSS in fase di build con <code>themeToCss()</code>, servilo come file statico e usa{' '}
          <code>themeStrategy=&quot;stylesheet&quot;</code>: le variabili di colore non passano più dagli attributi style.
        </p>
      </DocSection>

      <DocSection title="Checklist Next.js (App Router)">
        <ul>
          <li>Importa <code>@devcommunityit/ui/styles.css</code> una sola volta nel layout radice.</li>
          <li>Mantieni i provider in un file <code>&apos;use client&apos;</code> e passagli dati serializzabili (non funzioni) dai Server Component.</li>
          <li>Per collegare i link al router usa <code>RouterProvider</code> con <code>useRouter().push</code> nel componente client dei provider.</li>
          <li>Non leggere <code>useTheme().resolvedScheme</code> per decidere il markup del primo render: durante SSR vale sempre light.</li>
        </ul>
      </DocSection>
    </>
  );
}
