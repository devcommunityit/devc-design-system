import { VenueCard } from './VenueCard';

export function Basic() {
  return (
    <VenueCard
      name="Civic Conference Center"
      address={<>42 Market Street<br />Portland, OR 97201</>}
      directions="Entrance on Market Street, next to the public library."
      accessibility="Step-free entrance on the east side; accessible restrooms on every floor."
      mapHref="https://maps.example.test/?q=42+Market+Street"
    />
  );
}
