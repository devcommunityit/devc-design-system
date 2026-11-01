import { useState } from 'react';
import { PrivacyPreferences } from '@devcommunityit/ui';

export function Consent() {
  const [saved, setSaved] = useState<readonly string[] | null>(null);
  return <><PrivacyPreferences aria-label="Privacy" categories={[
    { id: 'essential', label: 'Necessari', description: 'Funzionalità essenziali del servizio.', isRequired: true },
    { id: 'analytics', label: 'Statistiche', description: 'Misurazione facoltativa.' },
  ]} onSave={setSaved} />{saved ? <p>Salvato: {saved.join(', ')}</p> : null}</>;
}
