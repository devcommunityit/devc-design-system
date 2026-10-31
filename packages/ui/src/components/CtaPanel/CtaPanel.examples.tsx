import { Button, CtaPanel, LinkButton } from '@dev-community/ui';

/** Call for speakers from the community landing, with numbered steps. */
export function Basic() {
  return (
    <CtaPanel
      eyebrow="🎤 Call for Speaker 2027"
      title="Hai qualcosa da raccontare? Sali sul palco."
      description="Che sia il tuo primo talk o il cinquantesimo, ti affianchiamo con mentoring, prove generali e feedback."
      actions={
        <>
          <LinkButton href="#proponi">Proponi un talk</LinkButton>
          <LinkButton href="#mentor" variant="secondary">
            Diventa mentor
          </LinkButton>
        </>
      }
      steps={[
        { title: 'Invia abstract e livello del talk' },
        { title: 'Ricevi feedback da un mentor in 7 giorni' },
        { title: 'Prova generale online con la community' },
        { title: 'Sali sul palco 🚀' },
      ]}
    />
  );
}

/** Brand gradient surface without steps. */
export function Brand() {
  return (
    <CtaPanel
      variant="brand"
      eyebrow="Community"
      title="Unisciti a oltre 12.000 sviluppatori"
      description="Meetup mensili, workshop pratici e un forum dove nessuna domanda è banale."
      actions={
        <>
          <Button variant="secondary">Crea il tuo profilo</Button>
          <LinkButton href="#eventi" variant="secondary">
            Guarda i prossimi eventi
          </LinkButton>
        </>
      }
    />
  );
}

/** Steps with descriptions in a narrow container: they stack in a single column. */
export function NarrowWithDescriptions() {
  return (
    <div style={{ maxInlineSize: '24rem' }}>
      <CtaPanel
        headingLevel={3}
        title="Organizza un meetup nella tua città"
        actions={<LinkButton href="#organizza">Candidati come organizer</LinkButton>}
        steps={[
          { title: 'Proponi la città', description: 'Ti mettiamo in contatto con chi è già nella zona.' },
          { title: 'Scegli la location', description: 'Uffici, coworking o università partner.' },
          { title: 'Pubblica l’evento', description: 'Lo promuoviamo nella newsletter del venerdì.' },
        ]}
      />
    </div>
  );
}
