import { NpsWidget } from './NpsWidget';

export function Basic() {
  return (
    <NpsWidget
      label="How likely are you to recommend this community?"
      value={null}
      onChange={() => {}}
      lowLabel="Not at all likely"
      highLabel="Extremely likely"
    />
  );
}
