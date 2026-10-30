import { Truncate } from '@dev-community/ui';

const text =
  'Il servizio di assistenza è disponibile dal lunedì al venerdì, dalle 8:30 alle 18:00. Le richieste ricevute fuori orario vengono prese in carico il giorno lavorativo successivo, secondo l’ordine di arrivo e la priorità indicata. Per le segnalazioni urgenti relative a interruzioni di servizio è attivo un numero dedicato, riportato nel contratto di assistenza.';

export function MultiLine() {
  return (
    <div style={{ maxInlineSize: '32rem' }}>
      <Truncate lines={2}>{text}</Truncate>
    </div>
  );
}

export function SingleLine() {
  return (
    <div style={{ maxInlineSize: '18rem' }}>
      <Truncate lines={1}>{text}</Truncate>
    </div>
  );
}