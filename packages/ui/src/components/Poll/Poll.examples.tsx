import { Poll } from './Poll';

export function Basic() {
  return (
    <Poll
      title="Which topic should we cover next?"
      description="Choose one option."
      value={null}
      onChange={() => {}}
      options={[
        { id: 'accessibility', label: 'Accessible design' },
        { id: 'performance', label: 'Web performance' },
        { id: 'testing', label: 'Testing practices' },
      ]}
    />
  );
}
