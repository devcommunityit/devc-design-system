import { useState } from 'react';
import { Grid, Link, NewsletterCard, type NewsletterCardStatus } from '@dev-community/ui';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Uncontrolled: returning a Promise shows the pending state, then the success message. */
export function Basic() {
  return (
    <NewsletterCard
      style={{ maxInlineSize: '24rem' }}
      eyebrow="📬 Newsletter"
      title="Il meglio della settimana, ogni venerdì."
      description="Eventi, talk e articoli selezionati. Zero spam."
      placeholder="nome@email.it"
      submitLabel="Iscrivimi"
      onSubmit={() => wait(1200)}
    />
  );
}

/** Controlled value and status, with custom success and error messages. */
export function Controlled() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<NewsletterCardStatus>('idle');
  return (
    <NewsletterCard
      style={{ maxInlineSize: '24rem' }}
      eyebrow="📬 Newsletter"
      title="Resta aggiornato sui meetup"
      description="Un’email al mese con le date dei prossimi eventi nella tua città."
      placeholder="nome@email.it"
      value={email}
      onChange={(next) => {
        setEmail(next);
        setStatus('idle');
      }}
      status={status}
      successMessage="Fatto! Controlla la posta per confermare l’iscrizione."
      errorMessage="Questo indirizzo risulta già iscritto."
      onSubmit={async (value) => {
        setStatus('pending');
        await wait(1000);
        setStatus(value.endsWith('@contoso.it') ? 'error' : 'success');
      }}
      footer={
        <>
          Iscrivendoti accetti la <Link href="#privacy">privacy policy</Link>.
        </>
      }
    />
  );
}

/** In a sidebar next to other content: the field and the button wrap on narrow widths. */
export function Narrow() {
  return (
    <Grid minItemWidth="16rem" gap={4}>
      <NewsletterCard
        title="Il meglio della settimana"
        description="Ogni venerdì nella tua casella."
        placeholder="nome@email.it"
        onSubmit={() => wait(800)}
      />
      <NewsletterCard title="Iscrizione completata" headingLevel={2} status="success" successMessage="Ci vediamo venerdì!" />
    </Grid>
  );
}
