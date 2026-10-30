import { useSyncExternalStore } from 'react';

/**
 * Deterministic demo data for the showcase. Everything lives in memory: changes made in the pages
 * (edits, deletions, status updates) last until the page is reloaded and never leave the browser.
 */

export type CustomerStatus = 'attivo' | 'in-prova' | 'sospeso';
export type Plan = 'Base' | 'Professional' | 'Enterprise';
export type Region = 'Nord' | 'Centro' | 'Sud e isole';
export type OrderStatus = 'da-spedire' | 'spedito' | 'consegnato' | 'annullato';

export interface Order {
  id: string;
  customerId: string;
  /** ISO calendar date (no time zone): it is never converted to an instant. */
  date: string;
  total: number;
  items: number;
  status: OrderStatus;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  /** Missing data is shown as "—", never invented. */
  phone: string | null;
  city: string;
  region: Region;
  plan: Plan;
  status: CustomerStatus;
  since: string;
  notes: string | null;
}

const companies = [
  'Officine Riva', 'Studio Bianchi Architetti', 'Conti Alimentari', 'Ferri Energia Rinnovabile', 'Gallo & Figli',
  'Moretti Tech', 'Lombardi Viaggi', 'Fontana Design', 'Esposito Casa', 'Bottega Rossi',
  'Cooperativa Agricola Val di Non', 'Marino Trasporti', 'Greco Farmaceutici', 'Bruno Edilizia', 'Rinaldi Consulting',
  'Caruso Ottica', 'Ricci Arredamenti', 'De Luca Logistica Integrata Mediterranea', 'Costa Ceramiche', 'Mancini Software',
  'Pellegrini Vini', 'Santoro Tessile', 'Fabbri Meccanica', 'Leone Assicurazioni', 'Testa & Partners',
  'Villa Hotel Lago', 'Serra Biotech', 'Farina Pasticcerie', 'Gatti Elettronica', 'Barbieri Legal',
];
const people = [
  'Giulia Bianchi', 'Marco Rossi', 'Chiara Conti', 'Luca Ferri', 'Sara Gallo', 'Davide Moretti', 'Elena Lombardi',
  'Paolo Fontana', 'Francesca Esposito', 'Andrea Ricci', 'Martina Marino', 'Stefano Greco', 'Alessia Bruno',
  'Roberto Rinaldi', 'Valentina Caruso',
];
const cities: Array<[string, Region]> = [
  ['Milano', 'Nord'], ['Torino', 'Nord'], ['Bologna', 'Nord'], ['Verona', 'Nord'], ['Firenze', 'Centro'],
  ['Roma', 'Centro'], ['Perugia', 'Centro'], ['Napoli', 'Sud e isole'], ['Bari', 'Sud e isole'], ['Palermo', 'Sud e isole'],
];
const plans: Plan[] = ['Base', 'Professional', 'Professional', 'Enterprise'];
const statuses: CustomerStatus[] = ['attivo', 'attivo', 'attivo', 'in-prova', 'sospeso'];
const orderStatuses: OrderStatus[] = ['consegnato', 'consegnato', 'spedito', 'da-spedire', 'consegnato', 'annullato'];

const pad = (n: number) => String(n).padStart(2, '0');

function slugEmail(name: string, company: string): string {
  const first = (name.split(' ')[0] ?? 'info').toLowerCase();
  const domain = company
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 18);
  return `${first}@${domain}.example`;
}

export const initialCustomers: Customer[] = companies.map((company, i) => {
  const contact = people[i % people.length] ?? 'Giulia Bianchi';
  const [city, region] = cities[(i * 7) % cities.length] ?? ['Milano', 'Nord'];
  return {
    id: `CL-${1040 + i}`,
    name: company,
    contact,
    email: slugEmail(contact, company),
    phone: i % 6 === 5 ? null : `+39 0${2 + (i % 8)} ${pad((i * 37) % 100)}${pad((i * 53) % 100)} ${pad((i * 71) % 100)}${pad((i * 13) % 100)}`,
    city,
    region,
    plan: plans[i % plans.length] ?? 'Base',
    status: statuses[i % statuses.length] ?? 'attivo',
    since: `${2019 + (i % 6)}-${pad(1 + ((i * 5) % 12))}-${pad(1 + ((i * 11) % 27))}`,
    notes: i % 4 === 0 ? 'Preferisce essere contattato via email. Rinnovo contrattuale da discutere a fine trimestre.' : null,
  };
});

export const initialOrders: Order[] = Array.from({ length: 96 }, (_, i) => {
  const customer = initialCustomers[(i * 7) % initialCustomers.length] ?? initialCustomers[0];
  const month = 1 + (i % 12);
  return {
    id: `ORD-${24100 + i}`,
    customerId: customer?.id ?? 'CL-1040',
    date: `2025-${pad(month)}-${pad(1 + ((i * 13) % 28))}`,
    total: 180 + ((i * 7919) % 9200),
    items: 1 + ((i * 3) % 14),
    // Offset by the year index so that statuses are not tied to the month (i % 12).
    status: orderStatuses[(i + Math.floor(i / 12)) % orderStatuses.length] ?? 'consegnato',
  };
});

/* ------------------------------------------------------------------ store */

interface State {
  customers: Customer[];
  orders: Order[];
}

let state: State = { customers: initialCustomers, orders: initialOrders };
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

export function useShowcaseData(): State {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export const actions = {
  updateCustomer(id: string, patch: Partial<Omit<Customer, 'id'>>) {
    setState({ ...state, customers: state.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  },
  removeCustomers(ids: readonly string[]) {
    const set = new Set(ids);
    setState({ customers: state.customers.filter((c) => !set.has(c.id)), orders: state.orders.filter((o) => !set.has(o.customerId)) });
  },
  setCustomersStatus(ids: readonly string[], status: CustomerStatus) {
    const set = new Set(ids);
    setState({ ...state, customers: state.customers.map((c) => (set.has(c.id) ? { ...c, status } : c)) });
  },
  reset() {
    setState({ customers: initialCustomers, orders: initialOrders });
  },
};

/* ------------------------------------------------------------------ formatting */

export const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Formats an ISO calendar date in UTC so the displayed day never shifts with the user's time zone. */
export function formatDay(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00Z`));
}

export const customerStatusLabel: Record<CustomerStatus, string> = { attivo: 'Attivo', 'in-prova': 'In prova', sospeso: 'Sospeso' };
export const customerStatusTone = { attivo: 'success', 'in-prova': 'info', sospeso: 'warning' } as const;
export const orderStatusLabel: Record<OrderStatus, string> = {
  'da-spedire': 'Da spedire',
  spedito: 'Spedito',
  consegnato: 'Consegnato',
  annullato: 'Annullato',
};
export const orderStatusTone = { 'da-spedire': 'warning', spedito: 'info', consegnato: 'success', annullato: 'neutral' } as const;

/** Simulated latency for local "save" operations, declared in the UI. */
export function simulateLatency(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
