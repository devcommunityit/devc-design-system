import { NavigationMenu, type NavigationMenuItem } from '@dev-community/ui';

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
