import { List, ListItem, Quote, Stack } from '@dev-community/ui';

export function Unordered() {
  return (
    <List>
      <ListItem>Token semantici per colori, spaziature e tipografia</ListItem>
      <ListItem>Temi chiaro, scuro e personalizzati</ListItem>
      <ListItem>Componenti accessibili da tastiera</ListItem>
    </List>
  );
}

export function Ordered() {
  return (
    <List ordered>
      <ListItem>Installa il pacchetto</ListItem>
      <ListItem>Importa gli stili</ListItem>
      <ListItem>Avvolgi l’app in ThemeProvider</ListItem>
    </List>
  );
}

export function InlineList() {
  return (
    <List variant="inline" gap={3}>
      <ListItem>Privacy</ListItem>
      <ListItem>Termini</ListItem>
      <ListItem>Cookie</ListItem>
    </List>
  );
}

export function Quotation() {
  return (
    <Stack gap={4}>
      <Quote attribution="Responsabile IT, cliente pilota">
        Abbiamo uniformato quattro portali interni in un trimestre, senza riscrivere la logica applicativa.
      </Quote>
    </Stack>
  );
}