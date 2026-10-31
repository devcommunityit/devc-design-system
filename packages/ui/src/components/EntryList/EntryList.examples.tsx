import { EntryList } from './EntryList';

export function Basic() {
  return (
    <EntryList
      entries={[
        { id: 'entry-1', name: 'Jordan Lee', entryNumber: 'A-042', detail: 'Joined in 2023' },
        { id: 'entry-2', name: 'Morgan Patel', entryNumber: 'A-043' },
      ]}
      label="Conference raffle entries"
    />
  );
}

export function WinnerAndEmpty() {
  return (
    <>
      <EntryList entries={[{ id: 'entry-1', name: 'Jordan Lee', isWinner: true }]} />
      <EntryList entries={[]} emptyMessage="Entries open soon." />
    </>
  );
}
