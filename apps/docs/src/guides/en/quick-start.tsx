import { Alert, Link } from '@dev-community/ui';
import { Code, DocSection } from '../../components/Doc';

export default function QuickStart() {
  return (
    <>
      <DocSection title="1. Install the package">
        <p>
          React and React DOM (18.3 or 19) are peer dependencies: use the ones already in your application. The package is not published to a public
          registry; see <Link href="/guide/installazione">Installation</Link> for tarballs and private registries.
        </p>
        <Code language="bash">{`npm install @dev-community/ui`}</Code>
      </DocSection>

      <DocSection title="2. Import the styles once">
        <p>
          <code>styles.css</code> contains tokens and component styles. It does not include a global reset: if your application does not have one, also add{' '}
          <code>reset.css</code> (optional, in a cascade layer).
        </p>
        <Code>{`
// main.tsx
import '@dev-community/ui/styles.css';
// import '@dev-community/ui/reset.css'; // optional
`}</Code>
      </DocSection>

      <DocSection title="3. Wrap your application in the provider">
        <p>
          <code>ThemeProvider</code> applies tokens, mode and density to its subtree. <code>surface</code> sets the container’s background and text colors.
          Persistence is disabled by default.
        </p>
        <Code>{`
import { createRoot } from 'react-dom/client';
import { LocaleProvider, ThemeProvider } from '@dev-community/ui';
import '@dev-community/ui/styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <LocaleProvider locale="en-US">
    <ThemeProvider defaultMode="system" defaultTheme="aurora" persistence surface>
      <App />
    </ThemeProvider>
  </LocaleProvider>,
);
`}</Code>
      </DocSection>

      <DocSection title="4. Your first component">
        <Code>{`
import { Button, Form, Stack, TextField, useToast } from '@dev-community/ui';

export function Newsletter() {
  const toast = useToast();
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        const email = new FormData(event.currentTarget).get('email');
        toast.show({ title: 'Subscription confirmed', description: String(email), tone: 'success' });
      }}
    >
      <Stack gap={3}>
        <TextField label="Email" description="Just one email a month." name="email" type="email" autoComplete="email" isRequired />
        <Button type="submit">Subscribe</Button>
      </Stack>
    </Form>
  );
}
`}</Code>
        <Alert tone="info" title="Toast">
          <code>useToast</code> requires a <code>ToastProvider</code> in the tree: see the <Link href="/componenti/toast">Toast</Link> page.
        </Alert>
      </DocSection>

      <DocSection title="Next steps">
        <ul>
          <li>
            <Link href="/guide/temi">Themes</Link>: presets, modes, density and custom themes with <code>createTheme</code>.
          </li>
          <li>
            <Link href="/guide/integrazione">Integrating into portals</Link>: routers, nested providers and coexistence with existing CSS.
          </li>
          <li>
            <Link href="/componenti">Component catalog</Link> and <Link href="/pattern">patterns</Link> (header, footer, sign-in, user menu).
          </li>
        </ul>
      </DocSection>
    </>
  );
}
