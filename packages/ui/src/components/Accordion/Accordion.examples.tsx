import { useState } from 'react';
import { Accordion, AccordionItem, Badge, Collapsible, Text } from '@devcommunityit/ui';

const faqs = [
  { id: 'fatturazione', q: 'Come funziona la fatturazione?', a: 'La fattura viene emessa il primo giorno di ogni mese per gli utenti attivi.' },
  { id: 'recesso', q: 'Posso disdire in qualsiasi momento?', a: 'Sì, la disdetta ha effetto alla fine del periodo già pagato.' },
  { id: 'dati', q: 'Dove sono conservati i dati?', a: 'In data center situati nell’Unione Europea.' },
];

export function Basic() {
  return (
    <Accordion>
      {faqs.map((f) => (
        <AccordionItem key={f.id} id={f.id} title={f.q}>
          <Text>{f.a}</Text>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function Multiple() {
  return (
    <Accordion allowsMultipleExpanded defaultExpandedKeys={['fatturazione']}>
      {faqs.map((f) => (
        <AccordionItem key={f.id} id={f.id} title={f.q} meta={f.id === 'dati' ? <Badge tone="info">Nuovo</Badge> : undefined}>
          <Text>{f.a}</Text>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ControlledCollapsible() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Collapsible title="Opzioni avanzate" variant="plain" isExpanded={open} onExpandedChange={setOpen}>
        <Text>Imposta limiti personalizzati di quota e conservazione dei log.</Text>
      </Collapsible>
      <Text variant="body-sm" tone="secondary">
        Stato: {open ? 'aperto' : 'chiuso'}
      </Text>
    </>
  );
}