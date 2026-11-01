import { useState } from 'react';
import { Button, Inline, PublishStatus, Stack, Text, type PublicationStatus } from '@devcommunityit/ui';

export function Basic() {
  return <Inline wrap gap={2}><PublishStatus status="draft" /><PublishStatus status="published" /><PublishStatus status="scheduled" /><PublishStatus status="archived" /></Inline>;
}

export function Workflow() {
  const [status, setStatus] = useState<PublicationStatus>('draft');
  return <Stack gap={3}><Text>Workflow solo locale: non pubblica contenuti.</Text><div role="status"><PublishStatus status={status} /></div><Inline wrap gap={2}><Button isDisabled={status === 'published'} onPress={() => setStatus('published')}>Pubblica localmente</Button><Button variant="secondary" isDisabled={status === 'draft'} onPress={() => setStatus('draft')}>Torna a bozza</Button><Button variant="ghost" isDisabled={status === 'archived'} onPress={() => setStatus('archived')}>Archivia localmente</Button></Inline></Stack>;
}

export function CustomLabels() {
  return <Inline wrap gap={2}><PublishStatus status="scheduled" variant="outline">Programmato per il 12 novembre</PublishStatus><PublishStatus status="published" variant="solid" dot={false}>Visibile sul sito pubblico</PublishStatus></Inline>;
}
