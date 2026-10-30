import { Text, Timeline, TimelineItem } from '@dev-community/ui';
import { Package, Truck } from 'lucide-react';

export function Basic() {
  return (
    <Timeline aria-label="Storico dell’ordine 10458">
      <TimelineItem title="Ordine ricevuto" time="3 mar 2025, 09:14" dateTime="2025-03-03T09:14" tone="info" />
      <TimelineItem title="Pagamento confermato" time="3 mar 2025, 09:15" dateTime="2025-03-03T09:15" tone="success" />
      <TimelineItem title="Spedito" time="4 mar 2025, 16:02" dateTime="2025-03-04T16:02" icon={<Truck />}>
        <Text variant="body-sm" tone="secondary">Corriere: BRT · Tracking 0571 2234 9981</Text>
      </TimelineItem>
      <TimelineItem title="Tentativo di consegna fallito" time="6 mar 2025" dateTime="2025-03-06" tone="warning" />
    </Timeline>
  );
}

export function WithIcons() {
  return (
    <Timeline aria-label="Attività del magazzino">
      <TimelineItem title="Lotto 22 registrato" icon={<Package />} />
      <TimelineItem title="Errore di sincronizzazione inventario" tone="danger">
        <Text variant="body-sm">Il dettaglio dell’errore resta visibile finché non viene risolto.</Text>
      </TimelineItem>
    </Timeline>
  );
}