import { CodeBlock } from '@dev-community/ui';

const snippet = `import { ThemeProvider, Button } from '@dev-community/ui';
import '@dev-community/ui/styles.css';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Button onPress={() => console.log('ok')}>Salva</Button>
    </ThemeProvider>
  );
}`;

export function Basic() {
  return <CodeBlock code={snippet} language="tsx" title="App.tsx" />;
}

export function LongLines() {
  return (
    <CodeBlock
      language="bash"
      maxHeight="12rem"
      code={'npm install @dev-community/ui react-aria-components lucide-react --registry=https://npm.example.com/my-company-private-registry/'}
    />
  );
}

export function NotCopyable() {
  return <CodeBlock code={'--dc-color-action-primary: #3457d5;'} language="css" copyable={false} />;
}

const communityConfig = `// community.config.ts
const community = {
  name: 'dev-community',
  members: 12_480,
  join: () => 'Benvenuto a bordo!',
  attend: (event: string) => \`Ci vediamo a \${event}\`,
  share: () => 'Il codice è di tutti.',
};

export default community;`;

export function Window() {
  return <CodeBlock variant="window" code={communityConfig} language="ts" title="community.config.ts" />;
}