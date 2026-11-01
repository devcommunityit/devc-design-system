import { SplitPane } from '@devcommunityit/ui/widgets';

export function EditorPreview() {
  return <SplitPane primary={<pre>src/App.tsx</pre>} secondary={<p>Anteprima dell’applicazione</p>} primaryLabel="Editor" secondaryLabel="Anteprima" />;
}
