import type { ReactNode } from 'react';
import { Code, DocSection } from '../../components/Doc';

interface Issue {
  title: string;
  cause: string;
  fix: ReactNode;
}

const ISSUES: Issue[] = [
  {
    title: 'Components have no styles',
    cause: 'The stylesheet is not imported, or the components are rendered outside ThemeProvider (the variables only exist inside data-dc-theme).',
    fix: (
      <>
        Import <code>@dev-community/ui/styles.css</code> once at startup and wrap the application in <code>ThemeProvider</code>.
      </>
    ),
  },
  {
    title: 'Dialog, Menu, or Toast render with the wrong theme',
    cause: 'A custom consumer portal mounts content in document.body, outside the provider container.',
    fix: (
      <>
        Use the library overlay components, or mount your own portals in <code>useTheme().portalContainer</code>.
      </>
    ),
  },
  {
    title: 'Error “useTheme must be used inside <ThemeProvider>”',
    cause: 'A component that reads the theme is rendered outside the provider (often in tests or isolated stories).',
    fix: (
      <>
        Wrap test renders in <code>ThemeProvider</code>, or use <code>useTheme({'{ optional: true }'})</code> in your code.
      </>
    ),
  },
  {
    title: 'Hooks called outside a component / “Invalid hook call”',
    cause: 'Two copies of React in the bundle, typically caused by npm link or aliases pointing to the sources.',
    fix: (
      <>
        Run <code>npm ls react react-dom</code> to verify that only one version exists; react and react-dom are peer dependencies and must be
        installed by the application.
      </>
    ),
  },
  {
    title: 'Library links reload the page',
    cause: 'No RouterProvider is configured, so the library falls back to native browser navigation.',
    fix: (
      <>
        Wrap the app in <code>RouterProvider</code> and pass your router’s navigate function (see Integration).
      </>
    ),
  },
  {
    title: 'A theme imported from JSON is rejected',
    cause: 'Invalid schema, unknown keys, non-hex colors, or a name reserved for a preset.',
    fix: (
      <>
        Read <code>result.issues</code> (code and path); with <code>{'{ unknown: "ignore" }'}</code>, unknown keys become warnings.
      </>
    ),
  },
  {
    title: 'The theme preference is not saved',
    cause: 'Persistence is disabled by default, or storage is blocked (private browsing, company policies).',
    fix: (
      <>
        Enable <code>persistence</code>, choose the <code>keys</code>, and handle <code>onPersistenceError</code>: the theme keeps working in
        memory even if storage fails.
      </>
    ),
  },
  {
    title: 'Theme flash or hydration warnings with SSR',
    cause: 'The server does not know the user’s explicit preferences.',
    fix: (
      <>
        Store preferences in a cookie and pass the initial values to the provider (see SSR and Next.js). Don’t use <code>resolvedScheme</code> to decide
        the markup of the first render.
      </>
    ),
  },
  {
    title: 'Library styles are overridden by the portal CSS',
    cause: 'Global portal rules on button, input, or a with higher specificity.',
    fix: (
      <>
        Scope the portal resets to the legacy area, or put them in an <code>@layer</code>: unlayered library styles win over
        any layer.
      </>
    ),
  },
  {
    title: 'Horizontal scrolling on mobile',
    cause: 'Fixed-width elements or long unbroken content inside flex/grid.',
    fix: (
      <>
        Use <code>min-inline-size: 0</code> on flexible children, <code>Text truncate</code>, or <code>overflow-wrap: anywhere</code>; wide
        tables belong in <code>Table</code>/<code>DataTable</code>, which scroll locally.
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
            <strong>Likely cause:</strong> {issue.cause}
          </p>
          <p>
            <strong>Solution:</strong> {issue.fix}
          </p>
        </DocSection>
      ))}
      <DocSection title="Quick diagnostics">
        <Code language="bash">{`
npm ls react react-dom @dev-community/ui   # a single copy of React and the library
npm ls react-aria-components                # no duplicate versions
`}</Code>
        <p>
          In the developer tools, check that the provider element has <code>data-dc-theme</code>, <code>data-dc-palette</code>,{' '}
          <code>data-dc-scheme</code>, and <code>data-dc-density</code>, and that portals have <code>data-dc-portal</code> with the same attributes.
        </p>
      </DocSection>
    </>
  );
}
