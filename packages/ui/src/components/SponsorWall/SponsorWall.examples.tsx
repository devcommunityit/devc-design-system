import { SponsorWall } from './SponsorWall';

export function Basic() {
  return (
    <SponsorWall
      aria-label="Event sponsors"
      heading="Thanks to our sponsors"
      sponsors={[
        { id: 'northstar', name: 'Northstar', logo: 'N', tier: 'Community partner', href: '#northstar' },
        { id: 'orbit', name: 'Orbit', logo: 'O' },
      ]}
    />
  );
}
