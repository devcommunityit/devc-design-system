import { useState } from 'react';
import { Banner, Button, Link, Radio, RadioGroup, ScrollArea, Stack, Text } from '@dev-community/ui';

export function Basic() {
  return (
    <Stack gap={2}>
      <Banner tone="neutral" action={<Link href="#novita">Scopri le novità</Link>}>
        Il nuovo pannello report è disponibile per tutti.
      </Banner>
      <Banner tone="warning">Manutenzione programmata sabato dalle 22:00 alle 23:00.</Banner>
      <Banner tone="danger">Alcuni servizi non rispondono. Stiamo indagando.</Banner>
    </Stack>
  );
}

export function Dismissible() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Banner tone="info" onDismiss={() => setOpen(false)}>
      Questo sito usa solo cookie tecnici.
    </Banner>
  ) : (
    <Button variant="secondary" onPress={() => setOpen(true)}>
      Mostra banner
    </Button>
  );
}
type BannerTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
const bannerTones: BannerTone[] = ['neutral', 'info', 'success', 'warning', 'danger'];
const toneNames: Record<BannerTone, string> = { neutral: 'Neutro', info: 'Informazione', success: 'Successo', warning: 'Avviso', danger: 'Errore' };
const toneText: Record<BannerTone, string> = {
  neutral: 'Da lunedì la dashboard si apre con il nuovo riepilogo personalizzato.',
  info: 'Stai visualizzando i dati dell’organizzazione “Comune di Bologna – Settore Servizi Digitali e Innovazione”.',
  success: 'Migrazione completata: tutti i 1.240 documenti sono stati importati.',
  warning: 'Il tuo abbonamento scade tra 5 giorni. Rinnova per non perdere l’accesso ai report.',
  danger: 'Pagamento non riuscito. Aggiorna il metodo di pagamento entro 48 ore.',
};

export function ToneAndAction() {
  const [tone, setTone] = useState<BannerTone>('warning');
  const [visible, setVisible] = useState(true);
  const [reminders, setReminders] = useState(0);
  return (
    <Stack gap={3}>
      <RadioGroup
        label="Tono del banner"
        orientation="horizontal"
        value={tone}
        onChange={(v) => {
          setTone(bannerTones.find((t) => t === v) ?? 'info');
          setVisible(true);
        }}
      >
        {bannerTones.map((t) => (
          <Radio key={t} value={t}>
            {toneNames[t]}
          </Radio>
        ))}
      </RadioGroup>
      {visible ? (
        <Banner
          tone={tone}
          onDismiss={() => setVisible(false)}
          action={
            <Button size="sm" variant="secondary" onPress={() => setReminders((n) => n + 1)}>
              Ricordamelo più tardi
            </Button>
          }
        >
          {toneText[tone]}
        </Banner>
      ) : (
        <Button variant="secondary" onPress={() => setVisible(true)}>
          Mostra di nuovo il banner
        </Button>
      )}
      <Text variant="body-sm" tone="secondary" aria-live="polite">
        Promemoria richiesti: {reminders}
      </Text>
    </Stack>
  );
}

const paragraphs = Array.from(
  { length: 8 },
  (_, i) => `Paragrafo ${i + 1}. Il banner resta in cima al contenitore che scorre, così l’avviso rimane visibile mentre l’utente legge il resto della pagina.`,
);

export function StickyInScrollArea() {
  return (
    <ScrollArea aria-label="Anteprima pagina con banner fisso" maxHeight="14rem" style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-md)' }}>
      <Banner tone="info" sticky>
        Versione di prova: i dati vengono azzerati ogni notte alle 02:00.
      </Banner>
      <Stack gap={3} style={{ padding: 'var(--dc-space-4)' }}>
        {paragraphs.map((p) => (
          <Text key={p}>{p}</Text>
        ))}
      </Stack>
    </ScrollArea>
  );
}
