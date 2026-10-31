import { MemberDirectory } from './MemberDirectory';

export function Basic() {
  return (
    <MemberDirectory
      aria-label="Community members"
      searchLabel="Search members"
      heading="Meet the community"
      query=""
      onQueryChange={() => {}}
      members={[
        { id: 'ada', name: 'Ada Lovelace', jobTitle: 'Engineer', href: '#ada' },
        { id: 'grace', name: 'Grace Hopper', jobTitle: 'Computer scientist', href: '#grace' },
      ]}
    />
  );
}
