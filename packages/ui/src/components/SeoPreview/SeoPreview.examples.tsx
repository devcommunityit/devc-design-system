import { useState } from 'react';
import { SeoPreview, Stack, Textarea, TextField } from '@dev-community/ui';

export function Basic() {
  return <SeoPreview title="Soluzioni digitali per il tuo team" url="https://example.test/soluzioni" description="Strumenti accessibili per gestire progetti, contenuti e relazioni con i clienti." siteName="Studio digitale" />;
}

export function Editor() {
  const [title, setTitle] = useState('Il tuo prossimo progetto inizia qui');
  const [description, setDescription] = useState('Scopri servizi e strumenti per lavorare meglio.');
  const [url, setUrl] = useState('https://example.test/progetti');
  return <Stack gap={4}><TextField label="Titolo SEO dimostrativo" value={title} onChange={setTitle} /><TextField label="URL mostrato nell’anteprima" value={url} onChange={setUrl} /><Textarea label="Descrizione SEO dimostrativa" value={description} onChange={setDescription} rows={2} /><SeoPreview title={title} url={url} description={description} siteName="Anteprima editoriale locale" /></Stack>;
}

export function LongContent() {
  return <div dir="rtl"><SeoPreview title="دليل شامل لإدارة المحتوى والمواقع الحديثة" url="https://example.test/a-very-long-path-for-testing-responsive-layouts-and-variable-content" description="معاينة تحريرية محلية للمحتوى، وليست نتيجة بحث حقيقية أو ضمانًا للترتيب في محركات البحث." siteName="موقع تجريبي" /></div>;
}
