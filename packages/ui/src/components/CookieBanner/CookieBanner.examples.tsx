import { CookieBanner } from './CookieBanner';

export function Basic() {
  return (
    <CookieBanner
      title="Your privacy choices"
      description="Choose which optional technologies this site may use."
      categories={[
        { id: 'essential', label: 'Essential', isRequired: true },
        { id: 'analytics', label: 'Analytics', description: 'Help us understand aggregate site usage.' },
        { id: 'personalization', label: 'Personalization' },
      ]}
      value={['essential']}
      onChange={() => {}}
      onSave={() => {}}
    />
  );
}
