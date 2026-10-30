import { Banner, Inline, Link, Text } from '@dev-community/ui';

export function Brand() {
  return (
    <Inline gap={2} align="center" wrap={false} className="sc-min0">
      <span className="sc-logo" aria-hidden="true" />
      <Text as="span" weight="bold" truncate className="sc-min0 sc-brand-name">
        Northwind Servizi
      </Text>
    </Inline>
  );
}

export function DemoBanner() {
  return (
    <Banner tone="info" action={<Link href="/pattern">Cosa è simulato</Link>}>
      Template dimostrativo: dati fittizi generati localmente; salvataggi e invii modificano solo la memoria della pagina.
    </Banner>
  );
}
