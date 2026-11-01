import { useState } from 'react';
import { Button, LocaleProvider, ResponseFeedback, Stack, Text, type FeedbackValue } from '@devcommunityit/ui';

export function Basic() {
  const [last, setLast] = useState<FeedbackValue>(null);
  return <Stack gap={3}><ResponseFeedback onChange={setLast} /><Text role="status">{last === null ? 'Nessuna valutazione.' : last === 'helpful' ? 'Risposta utile (stato locale).' : 'Risposta da migliorare (stato locale).'}</Text></Stack>;
}

export function Controlled() {
  const [value, setValue] = useState<FeedbackValue>('helpful');
  return <Stack gap={3}><ResponseFeedback aria-label="Valutazione controllata" value={value} onChange={setValue} /><Button variant="secondary" onPress={() => setValue(null)}>Azzera valutazione</Button></Stack>;
}

export function Localized() {
  return <LocaleProvider locale="ar"><div dir="rtl"><ResponseFeedback isDisabled defaultValue="helpful" /></div></LocaleProvider>;
}
