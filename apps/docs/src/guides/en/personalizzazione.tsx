import { Link } from '@dev-community/ui';
import { Code, DocSection, RefTable } from '../../components/Doc';

export default function Personalizzazione() {
  return (
    <>
      <DocSection title="Customization levels">
        <RefTable
          label="Customization tools, safest first"
          columns={['Level', 'Tool', 'Stability']}
          rows={[
            ['1. Theme', 'createTheme: seed, color roles, radii, fonts', 'Versioned public API'],
            ['2. Scoped tokens', '--dc-* custom properties on a container', 'Public API (token names)'],
            ['3. Props', 'variant, size, tone, provider density', 'Public API'],
            ['4. className / style', 'On every component, applied to the root element', 'Public API'],
            ['5. Data attributes', 'data-variant, data-size, data-tone, and react-aria states (data-hovered, data-pressed…)', 'Public API'],
            ['6. Internal classes', 'dc-<component>-<part>', 'Not stable: may change in a minor release'],
          ]}
        />
      </DocSection>

      <DocSection title="Scoped tokens">
        <p>
          Components read semantic variables only: redefining them on a container changes the look of everything inside it without affecting the
          rest of the page. Prefer a theme or a nested provider for full palette changes.
        </p>
        <Code language="css">{`
/* A promotional panel with larger radii and a partner-brand primary action */
.partner-panel {
  --dc-radius-md: 0.75rem;
  --dc-radius-lg: 1.25rem;
  --dc-color-action-primary: #0b5cad;
  --dc-color-action-primary-foreground: #ffffff;
}
`}</Code>
        <p>
          If you change a color, check its contrast against the matching foreground (see the <Link href="/theme-builder">Theme Builder</Link>).
        </p>
      </DocSection>

      <DocSection title="className, style, and data attributes">
        <p>
          Every component accepts <code>className</code>, <code>style</code>, <code>id</code>, <code>data-*</code>, and <code>aria-*</code> on the root
          element, as well as native events. Components built on React Aria also accept <code>className</code> as a function of state.
        </p>
        <Code>{`
import { Button, Card } from '@dev-community/ui';
import styles from './Checkout.module.css';

<Card className={styles.summary} data-testid="summary">…</Card>;

<Button
  variant="primary"
  className={styles.cta}
  data-analytics="checkout-submit"
  onPress={submit}
>
  Confirm order
</Button>;
`}</Code>
        <Code language="css" title="Checkout.module.css">{`
.cta[data-size='lg'] { min-inline-size: 16rem; }
.cta[data-pressed] { transform: translateY(1px); }
@media (prefers-reduced-motion: reduce) { .cta[data-pressed] { transform: none; } }
`}</Code>
      </DocSection>

      <DocSection title="Composition over new variants">
        <p>
          Before adding a variant, consider composition: <code>Card</code> + <code>Stack</code> + <code>Badge</code> cover most
          cards; patterns (<code>SiteHeader</code>, <code>UserMenu</code>, <code>LoginForm</code>, <code>Footer</code>) accept slots and
          custom content instead of rigid configuration.
        </p>
        <Code>{`
import { SiteHeader, UserMenu, MenuItem, LinkButton } from '@dev-community/ui';

<SiteHeader
  brand={<Logo />}
  links={[{ id: 'docs', label: 'Documentation', href: '/docs' }]}
  actions={
    user ? (
      <UserMenu user={user} onSignOut={signOut}>
        <MenuItem id="account" href="/account">Account</MenuItem>
      </UserMenu>
    ) : (
      <LinkButton href="/login">Sign in</LinkButton>
    )
  }
/>;
`}</Code>
      </DocSection>

      <DocSection title="What to avoid">
        <ul>
          <li>Selectors targeting internal <code>dc-*</code> classes or the components’ DOM structure: they aren’t a stable API.</li>
          <li><code>!important</code> to win specificity battles: library styles use low specificity, so a single class is enough.</li>
          <li>Hex colors scattered across portal components: define a theme or use semantic tokens.</li>
          <li>Removing the focus outline without an equivalent alternative.</li>
        </ul>
      </DocSection>
    </>
  );
}
