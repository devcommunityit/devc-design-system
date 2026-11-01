import { useMemo, useState } from 'react';
import { Stack, Switch, Text } from '@devcommunityit/ui';
import { EmailBuilder, createEmailBlock, createEmailDocument, emailRichText, renderEmailHtml, type EmailDocument } from '@devcommunityit/ui/editor';

function newsletterDocument(): EmailDocument {
  return createEmailDocument({
    subject: 'Dev Community — meetup di giugno',
    preheader: 'Due serate, un workshop e la call for speaker aperta.',
    settings: { accentColor: '#0b5cad' },
    blocks: [
      createEmailBlock('heading', { level: 1, align: 'center', content: emailRichText('Novità dalla Dev Community') }),
      createEmailBlock('text', {
        content: emailRichText(
          'Ciao {{first_name}}, questo mese torniamo in presenza con due serate dedicate al frontend e all’accessibilità.',
          'Porta un’amica o un collega: l’ingresso è gratuito, ma i posti sono limitati.',
        ),
      }),
      createEmailBlock('image', {
        src: 'https://picsum.photos/seed/devcommunity/1200/600',
        alt: 'Persone sedute in sala durante un talk del meetup',
        width: 600,
        href: 'https://example.org/meetup',
      }),
      createEmailBlock('button', { label: 'Iscriviti al meetup', href: 'https://example.org/meetup?utm_source=newsletter', align: 'center' }),
      createEmailBlock('columns', {
        columns: [
          [
            createEmailBlock('heading', { level: 3, content: emailRichText('12 giugno — Milano') }),
            createEmailBlock('text', { content: emailRichText('Design system in produzione: token, temi e test di accessibilità.') }),
          ],
          [
            createEmailBlock('heading', { level: 3, content: emailRichText('26 giugno — Online') }),
            createEmailBlock('text', { content: emailRichText('Workshop: email HTML che funzionano anche in Outlook.') }),
          ],
        ],
      }),
      createEmailBlock('divider'),
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

export function Newsletter() {
  return <EmailBuilder label="Newsletter di giugno" defaultValue={newsletterDocument()} />;
}

export function ControlledExport() {
  const [doc, setDoc] = useState(newsletterDocument);
  const [exported, setExported] = useState('');
  const length = useMemo(() => renderEmailHtml(doc).length, [doc]);
  return (
    <Stack gap={3}>
      <EmailBuilder
        label="Email controllata"
        value={doc}
        onChange={setDoc}
        onExport={(html) => setExported(`HTML esportato: ${html.length.toLocaleString('it-IT')} caratteri.`)}
      />
      <Text role="status">{exported || `${doc.blocks.length} blocchi · HTML attuale: ${length.toLocaleString('it-IT')} caratteri.`}</Text>
    </Stack>
  );
}

export function EmptyStart() {
  return <EmailBuilder aria-label="Nuova email" defaultValue={createEmailDocument({ subject: 'Nuova comunicazione' })} />;
}

export function RestrictedReadOnly() {
  const [readOnly, setReadOnly] = useState(true);
  return (
    <Stack gap={3}>
      <Switch isSelected={readOnly} onChange={setReadOnly}>
        Sola lettura
      </Switch>
      <EmailBuilder
        label="Annuncio (solo titolo, testo e bottone)"
        blockTypes={['heading', 'text', 'button']}
        isReadOnly={readOnly}
        defaultPreviewDevice="mobile"
        defaultValue={createEmailDocument({
          blocks: [
            createEmailBlock('heading', { content: emailRichText('La call for speaker è aperta') }),
            createEmailBlock('text', { content: emailRichText('Proponi un talk di 20 minuti entro il 30 maggio.') }),
            createEmailBlock('button', { label: 'Invia una proposta', href: 'https://example.org/cfp' }),
          ],
        })}
      />
    </Stack>
  );
}
