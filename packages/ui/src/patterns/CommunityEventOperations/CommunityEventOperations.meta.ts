import type { ComponentDoc } from "../../docs-meta/types";

export const doc: ComponentDoc = {
  entry: "patterns",
  exports: [
    "CommunityEventOperations",
    "CommunityEventOperationsProps",
    "CommunityEventTicketTier",
    "CommunityEventTrack",
    "CommunityEventSession",
    "CommunityCfpReview",
  ],
  name: 'CommunityEventOperations',
  slug: 'community-event-operations',
  category: 'patterns',
  summary:
    "Riepilogo operativo controllato per eventi community: biglietti, pass, check-in, programma multi-track, CFP, accessibilità e stati di registrazione.",
  whenToUse: [
    "Per presentare a partecipanti e organizzatori informazioni operative e azioni dell’evento in un’unica vista.",
  ],
  whenNotToUse: [
    "Per processare pagamenti, effettuare scansioni o inviare richieste al server.",
    "Per creare codici QR o certificati: il contenuto viene fornito dal consumer.",
    "Per una galleria di eventi: usa EventCard.",
  ],
  props: [
    {
      name: "title / startsAt",
      type: "ReactNode / string",
      required: true,
      description: "Titolo e data/ora ISO dell’evento.",
    },
    {
      name: "now",
      type: "Date | string | number",
      required: true,
      description:
        "Istante di riferimento esplicito per countdown deterministici; il pattern non aggiorna un timer.",
    },
    {
      name: "timeZone",
      type: "string",
      description: "Fuso IANA per formattare gli orari.",
    },
    {
      name: "registrationDeadline",
      type: "string",
      description: "Scadenza ISO per la registrazione e relativo countdown.",
    },
    {
      name: "tickets",
      type: "object",
      description:
        "Tier, disponibilità, quantità controllate e callback di registrazione/waitlist.",
    },
    {
      name: "pass",
      type: "object",
      description:
        "Stato del pass e contenuto QR ReactNode fornito dal consumer.",
    },
    {
      name: "checkIn",
      type: "object",
      description: "Stato check-in manuale, dettagli e callback onCheckIn.",
    },
    {
      name: "tracks",
      type: "CommunityEventTrack[]",
      description:
        "Sessioni ordinate per track; date e dati forniti dal consumer.",
    },
    {
      name: "cfp",
      type: "object",
      description:
        "Stato della proposta, scadenza, link o callback di invio e scorecard con feedback dei revisori.",
    },
    {
      name: "venue",
      type: "object",
      description: "Sede, indicazioni e informazioni di accessibilità.",
    },
    {
      name: "cancellation",
      type: "object",
      description:
        "Stato di cancellazione e rimborso già determinato dal consumer.",
    },
    {
      name: "calendarHref / certificateHref",
      type: "string",
      description:
        "Link esterni per esportare il calendario e consultare il certificato.",
    },
  ],
  inherits: "Attributi HTML di section, incluso className.",
  keyboard: [
    {
      keys: "Tab / Maiusc+Tab",
      action:
        "Raggiunge i controlli quantità, pulsanti e link in ordine di lettura.",
    },
    {
      keys: "Freccia su/giù, Home/Fine",
      action:
        "NumberInput gestisce le quantità secondo il proprio comportamento accessibile.",
    },
    {
      keys: "Enter / Spazio",
      action: "Attiva un’azione o un link focalizzato.",
    },
  ],
  accessibility: [
    "Le sezioni sono identificate da intestazioni; la pianificazione usa Agenda e le relative liste semantiche.",
    "Disponibilità e stati sono descritti in testo oltre che tramite colore.",
    "Le quantità sono campi NumberInput con etichetta specifica per tier.",
    "QR e risultati delle azioni sono dati consumer-supplied; il pattern non accede a camera o server.",
  ],
  responsive: [
    "I pannelli si dispongono in griglia adattiva; tier, azioni e track vanno a capo nei contenitori stretti.",
  ],
  customization: [
    "Icone, Badge, Button, Link, NumberInput e Agenda riusano le primitive del design system.",
    "Stili interni basati esclusivamente sui token --dc-*.",
  ],
  commonMistakes: [
    "Aspettarsi persistenza di quantità o stati: aggiornare i dati nel consumer tramite callback.",
    "Passare contenuti QR generati qui: il pass accetta soltanto un ReactNode già creato dal consumer.",
    "Attendere countdown live: fornire un nuovo valore now dall’esterno se serve aggiornare il riferimento temporale.",
    "Usare callback per pagamenti, scansioni o generazione di certificati: sono intenzionalmente fuori dallo scope.",
  ],
  examples: [
    { name: 'AttendeeOperations', title: 'Dettagli operativi per partecipanti',
      description:
        "Tier selezionabili, waitlist, pass, accessibilità, link e countdown basati su istanti fissi.",
    },
    { name: 'OrganizerOperations', title: 'Vista organizzatore',
      description:
        "Check-in manuale, stato CFP, rimborsi e programma multi-track.",
    },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: [
      "patterns/CommunityEventOperations/CommunityEventOperations.test.tsx",
    ],
    limits: [
      "Non esegue chiamate server, pagamento, scansione/camera, raffle o generazione QR/certificati.",
      "Countdown e stati non si aggiornano autonomamente: sono controllati dal consumer.",
      "L’ordinamento di track e sessioni resta a carico del consumer.",
    ],
  },
};
