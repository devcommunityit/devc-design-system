import { useState } from 'react';
import { Button } from '@dev-community/ui';
import { VenueMap } from '@dev-community/ui/widgets';

export function Basic() {
  return (
    <VenueMap
      name="Centro Congressi Porta Nuova"
      address={<>Piazza Gae Aulenti 1<br />20124 Milano</>}
      latitude={45.48386}
      longitude={9.19005}
    />
  );
}

export function Controlled() {
  const [isLoaded, setLoaded] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 'var(--dc-space-3)' }}>
      <VenueMap
        name="Officine Community"
        address="Via Tortona 31, 20144 Milano"
        latitude={45.45136}
        longitude={9.16443}
        zoom={17}
        isLoaded={isLoaded}
        onLoadedChange={setLoaded}
        consentNote="Caricando la mappa accetti i cookie tecnici di OpenStreetMap. Ricorderemo la scelta per questa sessione."
      />
      {isLoaded ? (
        <Button variant="secondary" size="sm" onPress={() => setLoaded(false)} style={{ justifySelf: 'start' }}>
          Nascondi la mappa
        </Button>
      ) : null}
    </div>
  );
}

export function CustomLinks() {
  return (
    <VenueMap
      name="Spazio Meetup Navigli"
      latitude={45.45282}
      longitude={9.17599}
      zoom={15}
      aspectRatio="4 / 3"
      directions={['google', 'osm']}
      style={{ maxInlineSize: '28rem' }}
    />
  );
}
