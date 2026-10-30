import { Badge, DescriptionList } from '@dev-community/ui';

const items = [
  { term: 'Cliente', description: 'Acme S.p.A.' },
  { term: 'Partita IVA', description: 'IT01234567890' },
  { term: 'Stato', description: <Badge tone="success">Attivo</Badge> },
  { term: 'Referente', description: null },
  { term: 'Indirizzo', description: 'Via dei Mille 42, 40121 Bologna (BO), Italia' },
];

export function Stacked() {
  return <DescriptionList items={items} layout="stacked" dividers={false} emptyValue="Non indicato" />;
}

export function Inline() {
  return <DescriptionList items={items} layout="inline" emptyValue="Non indicato" />;
}

export function GridLayout() {
  return <DescriptionList items={items} layout="grid" emptyValue="Non indicato" />;
}