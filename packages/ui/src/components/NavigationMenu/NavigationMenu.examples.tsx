import { useState } from 'react';
import { NavigationMenu, Stack, Text, type NavigationMenuItem, type NavigationMenuLink } from '@dev-community/ui';

const items: NavigationMenuItem[] = [
  { id: 'home', label: 'Home', href: '#home', current: true },
  {
    id: 'products',
    label: 'Prodotti',
    items: [
      { id: 'portal', label: 'Portale clienti', href: '#portale', description: 'Area riservata con documenti e ticket.' },
      { id: 'analytics', label: 'Analytics', href: '#analytics', description: 'Report e cruscotti in tempo reale.' },
      { id: 'api', label: 'API', href: '#api', description: 'Integrazioni REST documentate.' },
    ],
  },
  {
    id: 'resources',
    label: 'Risorse',
    items: [
      { id: 'docs', label: 'Documentazione', href: '#docs' },
      { id: 'blog', label: 'Blog', href: '#blog' },
    ],
  },
  { id: 'pricing', label: 'Prezzi', href: '#prezzi' },
];

export function Horizontal() {
  return <NavigationMenu items={items} aria-label="Principale" />;
}

export function Vertical() {
  return <NavigationMenu items={items} orientation="vertical" aria-label="Sezioni" />;
}

const sitePages = [
  { id: 'overview', label: 'Panoramica', href: '#panoramica' },
  { id: 'consulting', label: 'Consulenza', href: '#consulenza', description: 'Analisi dei processi e piani di adozione.' },
  { id: 'support', label: 'Assistenza tecnica', href: '#assistenza', description: 'Contratti con tempi di risposta garantiti.' },
  { id: 'training', label: 'Formazione', href: '#formazione', description: 'Corsi in aula e online per i team.' },
  { id: 'contacts', label: 'Contatti', href: '#contatti' },
];

export function CurrentPage() {
  const [current, setCurrent] = useState('overview');
  const toLink = (id: string): NavigationMenuLink[] =>
    sitePages
      .filter((page) => page.id === id)
      .map((page) => ({ ...page, current: page.id === current, linkProps: { onPress: () => setCurrent(page.id) } }));
  const items: NavigationMenuItem[] = [
    ...toLink('overview'),
    { id: 'services', label: 'Servizi', items: [...toLink('consulting'), ...toLink('support'), ...toLink('training')] },
    ...toLink('contacts'),
  ];
  return (
    <Stack gap={3}>
      <NavigationMenu items={items} aria-label="Sito aziendale" />
      <Text variant="body-sm" tone="secondary">
        Pagina corrente: {sitePages.find((page) => page.id === current)?.label}. Il gruppo che contiene la pagina corrente è evidenziato.
      </Text>
    </Stack>
  );
}

const longItems: NavigationMenuItem[] = [
  { id: 'dashboard', label: 'Cruscotto', href: '#cruscotto' },
  {
    id: 'requests',
    label: 'Richieste e pratiche amministrative',
    items: [
      {
        id: 'refunds',
        label: 'Rimborsi spese di trasferta e missioni',
        href: '#rimborsi',
        description: 'Invio delle note spese con allegati, verifica dello stato di approvazione e storico dei pagamenti.',
      },
      { id: 'leave', label: 'Ferie, permessi e congedi parentali', href: '#ferie', description: 'Saldo aggiornato giornalmente.' },
    ],
  },
  { id: 'certificates', label: 'Certificazioni e documenti personali', href: '#certificazioni' },
];

export function LongLabels() {
  return (
    <div style={{ maxInlineSize: '28rem' }}>
      <NavigationMenu items={longItems} aria-label="Area riservata" />
    </div>
  );
}