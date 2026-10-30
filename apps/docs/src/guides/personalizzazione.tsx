import { Link } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../components/Doc';

export default function Personalizzazione() {
  return (
    <>
      <DocSection title="Livelli di personalizzazione">
        <RefTable
          label="Strumenti di personalizzazione, dal più sicuro"
          columns={['Livello', 'Strumento', 'Stabilità']}
          rows={[
            ['1. Tema', 'createTheme: seed, ruoli colore, raggi, font', 'API pubblica versionata'],
            ['2. Token in un ambito', 'Custom properties --dc-* su un contenitore', 'API pubblica (nomi dei token)'],
            ['3. Props', 'variant, size, tone, density del provider', 'API pubblica'],
            ['4. className / style', 'Su ogni componente, applicati all’elemento radice', 'API pubblica'],
            ['5. Data attribute', 'data-variant, data-size, data-tone e stati react-aria (data-hovered, data-pressed…)', 'API pubblica'],
            ['6. Classi interne', 'dc-<componente>-<parte>', 'Non stabili: possono cambiare in una minor'],
          ]}
        />
      </DocSection>

      <DocSection title="Token in un ambito">
        <p>
          I componenti leggono solo variabili semantiche: ridefinirle su un contenitore cambia l’aspetto di tutto ciò che contiene senza toccare il
          resto della pagina. Preferisci un tema o un provider annidato per cambi di palette completi.
        </p>
        <Code language="css">{`
/* Un pannello promozionale con raggi più ampi e azione primaria di brand partner */
.partner-panel {
  --dc-radius-md: 0.75rem;
  --dc-radius-lg: 1.25rem;
  --dc-color-action-primary: #0b5cad;
  --dc-color-action-primary-foreground: #ffffff;
}
`}</Code>
        <p>
          Se cambi un colore verifica il contrasto con il relativo foreground (vedi il <Link href="/theme-builder">Theme Builder</Link>).
        </p>
      </DocSection>

      <DocSection title="className, style e data attribute">
        <p>
          Ogni componente accetta <code>className</code>, <code>style</code>, <code>id</code>, <code>data-*</code> e <code>aria-*</code> sull’elemento
          radice, oltre agli eventi nativi. I componenti basati su React Aria accettano anche <code>className</code> come funzione dello stato.
        </p>
        <Code>{`
import { Button, Card } from '@dev-community/ui';
import styles from './Checkout.module.css';

<Card className={styles.summary} data-testid="riepilogo">…</Card>;

<Button
  variant="primary"
  className={styles.cta}
  data-analytics="checkout-submit"
  onPress={submit}
>
  Conferma ordine
</Button>;
`}</Code>
        <Code language="css" title="Checkout.module.css">{`
.cta[data-size='lg'] { min-inline-size: 16rem; }
.cta[data-pressed] { transform: translateY(1px); }
@media (prefers-reduced-motion: reduce) { .cta[data-pressed] { transform: none; } }
`}</Code>
      </DocSection>

      <DocSection title="Composizione invece di nuove varianti">
        <p>
          Prima di aggiungere una variante, valuta la composizione: <code>Card</code> + <code>Stack</code> + <code>Badge</code> coprono la maggior parte
          delle schede; i pattern (<code>SiteHeader</code>, <code>UserMenu</code>, <code>LoginForm</code>, <code>Footer</code>) accettano slot e
          contenuti propri invece di configurazioni rigide.
        </p>
        <Code>{`
import { SiteHeader, UserMenu, MenuItem, LinkButton } from '@dev-community/ui';

<SiteHeader
  brand={<Logo />}
  links={[{ id: 'docs', label: 'Documentazione', href: '/docs' }]}
  actions={
    user ? (
      <UserMenu user={user} onSignOut={signOut}>
        <MenuItem id="account" href="/account">Account</MenuItem>
      </UserMenu>
    ) : (
      <LinkButton href="/login">Accedi</LinkButton>
    )
  }
/>;
`}</Code>
      </DocSection>

      <DocSection title="Cosa evitare">
        <ul>
          <li>Selettori sulle classi interne <code>dc-*</code> o sulla struttura DOM dei componenti: non sono API stabile.</li>
          <li><code>!important</code> per vincere la specificità: gli stili della libreria usano specificità bassa, una classe è sufficiente.</li>
          <li>Colori esadecimali sparsi nei componenti del portale: definisci un tema o usa i token semantici.</li>
          <li>Rimuovere l’outline di focus senza alternativa equivalente.</li>
        </ul>
      </DocSection>
    </>
  );
}
