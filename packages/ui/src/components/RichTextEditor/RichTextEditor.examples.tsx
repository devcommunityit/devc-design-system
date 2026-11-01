import { useState } from 'react';
import { Button, Inline, Stack, Switch, Text } from '@devcommunityit/ui';
import { RichTextContent, RichTextEditor, type RichTextEditorValue } from '@devcommunityit/ui/editor';

const ARTICLE = `<h2>Meetup di primavera</h2>
<p>Il <strong>community meetup</strong> torna con talk su <em>accessibilità</em>, design system e <a href="https://example.com/programma">open source</a>.</p>
<ul><li><p>Talk da 20 minuti</p></li><li><p>Workshop pratici</p></li></ul>
<blockquote><p>Il miglior modo per imparare è condividere.</p></blockquote>`;

export function Classic() {
  return (
    <RichTextEditor
      label="Descrizione dell’evento"
      description="Usa titoli e liste per rendere il testo facile da scorrere."
      defaultValue={ARTICLE}
      maxHeight={420}
    />
  );
}

export function Blocks() {
  return (
    <RichTextEditor
      variant="blocks"
      label="Pagina"
      description="Digita “/” per inserire un blocco. Alt+F10 apre le azioni del blocco; Mod+Alt+frecce lo spostano."
      defaultValue={ARTICLE}
      minHeight={240}
    />
  );
}

export function Controlled() {
  const [value, setValue] = useState<string>('<p>Scrivi qualcosa di <strong>importante</strong>.</p>');
  const [text, setText] = useState('');
  return (
    <Stack gap={3}>
      <RichTextEditor
        label="Contenuto controllato"
        value={value}
        onChange={(next: RichTextEditorValue) => {
          setValue(next.html);
          setText(next.text);
        }}
      />
      <Inline gap={2}>
        <Button variant="secondary" onPress={() => setValue('<p>Valore reimpostato dall’esterno.</p>')}>
          Reimposta
        </Button>
        <Button variant="secondary" onPress={() => setValue('')}>
          Svuota
        </Button>
      </Inline>
      <Text variant="body-sm">Testo: {text || '—'}</Text>
      <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 'var(--dc-font-size-sm)' }}>
        <code>{value}</code>
      </pre>
    </Stack>
  );
}

export function CharacterLimit() {
  return (
    <Stack gap={4}>
      <RichTextEditor
        label="Biografia"
        description="Massimo 280 caratteri."
        characterLimit={280}
        features={{ headings: false, image: false, table: false, codeBlock: false, taskList: false }}
        defaultValue="<p>Frontend developer e organizzatrice di meetup sull’accessibilità.</p>"
      />
      <RichTextEditor label="Note" showCount="words" features={{ image: false, table: false }} />
    </Stack>
  );
}

export function ReadOnlyContent() {
  const [readOnly, setReadOnly] = useState(true);
  return (
    <Stack gap={4}>
      <Switch isSelected={readOnly} onChange={setReadOnly}>
        Sola lettura
      </Switch>
      <RichTextEditor label="Contenuto pubblicato" isReadOnly={readOnly} defaultValue={ARTICLE} />
      <Text variant="body-sm">RichTextContent con lo stesso HTML (attendibile, generato dall’editor):</Text>
      <RichTextContent as="article" html={ARTICLE} />
      <Text variant="body-sm">RichTextContent da JSON (convertito con lo schema dell’editor):</Text>
      <RichTextContent
        json={{
          type: 'doc',
          content: [
            { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Da JSON' }] },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Testo con ' },
                { type: 'text', marks: [{ type: 'highlight' }], text: 'evidenziazione' },
                { type: 'text', text: '.' },
              ],
            },
          ],
        }}
      />
    </Stack>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Lettura non riuscita'));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload() {
  const [error, setError] = useState('');
  return (
    <Stack gap={3}>
      <RichTextEditor
        variant="blocks"
        label="Articolo con immagini"
        description="Incolla o trascina un’immagine, oppure usa “/immagine”. Il caricamento è simulato con un data URL."
        onImageUpload={async (file) => {
          await new Promise((resolve) => setTimeout(resolve, 600));
          return { src: await readAsDataUrl(file), alt: file.name.replace(/\.[^.]+$/, '') };
        }}
        onImageUploadError={(reason) => setError(reason instanceof Error ? reason.message : 'Caricamento non riuscito')}
        minHeight={200}
      />
      {error ? <Text role="alert">{error}</Text> : null}
    </Stack>
  );
}

export function Minimal() {
  const [sent, setSent] = useState('');
  const [draft, setDraft] = useState('');
  return (
    <Stack gap={3}>
      <RichTextEditor
        label="Commento"
        placeholder="Scrivi un commento…"
        value={draft}
        onChange={(next) => setDraft(next.html)}
        features={{
          headings: false,
          taskList: false,
          blockquote: false,
          codeBlock: true,
          image: false,
          table: false,
          align: false,
          highlight: false,
          horizontalRule: false,
        }}
        minHeight="5rem"
        characterLimit={1000}
      />
      <Inline gap={2}>
        <Button
          isDisabled={!draft}
          onPress={() => {
            setSent(draft);
            setDraft('');
          }}
        >
          Pubblica
        </Button>
      </Inline>
      {sent ? <RichTextContent html={sent} /> : null}
    </Stack>
  );
}
