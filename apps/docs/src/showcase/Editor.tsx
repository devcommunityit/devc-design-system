import { BookOpen, Mail, PanelTop, Rows3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  IconButton,
  Inline,
  Stack,
  StageLabel,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  Toggle,
  ToggleGroup,
  type Selection,
} from '@devcommunityit/ui';
import {
  EmailBuilder,
  RichTextContent,
  RichTextEditor,
  createEmailBlock,
  createEmailDocument,
  emailRichText,
  renderEmailHtml,
  type EmailDocument,
  type RichTextJSON,
  type RichTextEditorVariant,
} from '@devcommunityit/ui/editor';
import { DemoBanner } from './chrome';

const ARTICLE = `<h1>Design system in produzione: cosa abbiamo imparato</h1>
<p>Dopo un anno di <strong>@devcommunityit/ui</strong> in tre prodotti, raccogliamo qui le lezioni più utili: dai <em>token</em> ai test di accessibilità.</p>
<h2>1. I token prima dei componenti</h2>
<p>Ogni colore, spaziatura e raggio nasce da un’unica fonte. Così cambiare tema è una <mark>modifica di configurazione</mark>, non un refactoring.</p>
<ul><li><p>Token primitivi per i valori grezzi</p></li><li><p>Token semantici per i ruoli</p></li><li><p>Temi come semplici mappe di valori</p></li></ul>
<h2>2. Accessibilità misurata</h2>
<blockquote><p>Se non lo testi da tastiera, non è finito.</p></blockquote>
<ul data-type="taskList"><li data-type="taskItem" data-checked="true"><p>Navigazione da tastiera su ogni componente</p></li><li data-type="taskItem" data-checked="true"><p>Contrasto verificato su tutti i temi</p></li><li data-type="taskItem" data-checked="false"><p>Test con screen reader su mobile</p></li></ul>
<h2>3. Prossimi passi</h2>
<p>Ne parliamo al prossimo <a href="https://example.org/meetup">meetup di giugno</a>: porta le tue domande.</p>`;

function newsletter(): EmailDocument {
  return createEmailDocument({
    subject: 'Dev Community — il meglio di giugno',
    preheader: 'Un nuovo articolo, due meetup e la call for speaker.',
    settings: { accentColor: '#6d28d9', backgroundColor: '#f3f0ff' },
    blocks: [
      createEmailBlock('heading', { level: 1, align: 'center', content: emailRichText('Il meglio di giugno') }),
      createEmailBlock('text', {
        align: 'center',
        content: emailRichText('Ciao {{first_name}}, ecco cosa è successo nella community questo mese e cosa ti aspetta nelle prossime settimane.'),
      }),
      createEmailBlock('image', {
        src: 'https://picsum.photos/seed/dc-newsletter/1200/560',
        alt: 'Il pubblico del meetup di maggio durante un talk',
        width: 600,
      }),
      createEmailBlock('heading', { level: 2, content: emailRichText('Design system in produzione') }),
      createEmailBlock('text', {
        content: emailRichText('Token, temi e test di accessibilità: le lezioni di un anno di @devcommunityit/ui in tre prodotti.'),
      }),
      createEmailBlock('button', { label: 'Leggi l’articolo', href: 'https://example.org/blog/design-system?utm_source=newsletter', align: 'start' }),
      createEmailBlock('divider'),
      createEmailBlock('columns', {
        columns: [
          [
            createEmailBlock('heading', { level: 3, content: emailRichText('12 giugno — Milano') }),
            createEmailBlock('text', { content: emailRichText('Meetup frontend: componenti accessibili e performance.') }),
            createEmailBlock('button', { label: 'Prenota', href: 'https://example.org/eventi/milano' }),
          ],
          [
            createEmailBlock('heading', { level: 3, content: emailRichText('26 giugno — Online') }),
            createEmailBlock('text', { content: emailRichText('Workshop: email HTML che funzionano anche in Outlook.') }),
            createEmailBlock('button', { label: 'Iscriviti', href: 'https://example.org/eventi/workshop' }),
          ],
        ],
      }),
      createEmailBlock('spacer', { height: 16 }),
      createEmailBlock('social', {
        align: 'center',
        links: [
          { network: 'github', href: 'https://github.com/dev-community' },
          { network: 'linkedin', href: 'https://www.linkedin.com/company/dev-community' },
          { network: 'youtube', href: 'https://www.youtube.com/@devcommunityit' },
        ],
      }),
      createEmailBlock('footer', {
        align: 'center',
        content: {
          type: 'doc',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Dev Community APS · Via dell’Esempio 1, 20100 Milano' }] },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Ricevi questa email perché sei iscritto alla newsletter. ' },
                { type: 'text', text: 'Annulla l’iscrizione', marks: [{ type: 'link', attrs: { href: '{{unsubscribe_url}}' } }] },
              ],
            },
          ],
        },
      }),
    ],
  });
}

function ArticleStudio() {
  const [mode, setMode] = useState<Selection>(new Set(['blocks']));
  const variant = ([...mode][0] ?? 'blocks') as RichTextEditorVariant;
  const [json, setJson] = useState<RichTextJSON | null>(null);
  const [words, setWords] = useState(0);

  return (
    <div className="sc-ed-split">
      <Stack gap={3} className="sc-min0">
        <Inline gap={2} align="center" justify="between">
          <Text variant="body-sm" tone="secondary">
            {variant === 'blocks' ? 'Digita “/” per inserire un blocco; seleziona il testo per formattarlo.' : 'Barra di formattazione classica.'}
          </Text>
          <ToggleGroup aria-label="Modalità dell’editor" selectedKeys={mode} onSelectionChange={setMode} disallowEmptySelection>
            <Toggle id="blocks" icon={<Rows3 />}>
              Blocchi
            </Toggle>
            <Toggle id="toolbar" icon={<PanelTop />}>
              Barra
            </Toggle>
          </ToggleGroup>
        </Inline>
        <RichTextEditor
          key={variant}
          variant={variant}
          label="Articolo del blog"
          description="Il contenuto resta solo in memoria."
          defaultValue={json ?? ARTICLE}
          showCount="words"
          minHeight={360}
          onChange={(value) => {
            setJson(value.json);
            setWords(value.text.trim() ? value.text.trim().split(/\s+/).length : 0);
          }}
        />
      </Stack>
      <Card className="sc-ed-preview">
        <CardHeader title="Anteprima pubblicata" subtitle={json ? `${words} parole` : 'Modifica l’articolo per aggiornarla'} />
        <CardBody>
          {json ? <RichTextContent json={json} /> : <RichTextContent html={ARTICLE} />}
        </CardBody>
      </Card>
    </div>
  );
}

function NewsletterStudio() {
  const [doc, setDoc] = useState(newsletter);
  const [status, setStatus] = useState('');
  return (
    <Stack gap={3}>
      <EmailBuilder
        label="Newsletter di giugno"
        value={doc}
        onChange={setDoc}
        onExport={(html) => setStatus(`HTML esportato: ${html.length.toLocaleString('it-IT')} caratteri, pronto per il tuo servizio di invio.`)}
      />
      <Text variant="body-sm" tone="secondary" role="status">
        {status || `${doc.blocks.length} blocchi · ${renderEmailHtml(doc).length.toLocaleString('it-IT')} caratteri di HTML con stili inline.`}
      </Text>
    </Stack>
  );
}

export function Editor() {
  const navigate = useNavigate();
  return (
    <div className="sc-ed">
      <DemoBanner />
      <Container size="xl" className="sc-ed-container">
        <Stack gap={6}>
          <Inline gap={3} align="start" justify="between">
            <Stack gap={2} className="sc-min0">
              <Inline gap={2} align="center">
                <Badge tone="brand">@devcommunityit/ui/editor</Badge>
                <StageLabel stage="beta" />
              </Inline>
              <Heading level={1} size="headline-lg">
                Studio contenuti
              </Heading>
              <Text tone="secondary">Scrivi un articolo come in Notion o con la barra classica, poi componi la newsletter a blocchi ed esporta l’HTML.</Text>
            </Stack>
            <IconButton variant="ghost" label="Torna alla documentazione" icon={<BookOpen />} onPress={() => void navigate('/pattern')} />
          </Inline>
          <Tabs defaultSelectedKey="article">
            <TabList aria-label="Strumenti">
              <Tab id="article">Articolo</Tab>
              <Tab id="email">
                <Inline gap={1} align="center" wrap={false}>
                  <Mail aria-hidden="true" size={16} />
                  Newsletter
                </Inline>
              </Tab>
            </TabList>
            <TabPanel id="article">
              <ArticleStudio />
            </TabPanel>
            <TabPanel id="email">
              <NewsletterStudio />
            </TabPanel>
          </Tabs>
        </Stack>
      </Container>
    </div>
  );
}
