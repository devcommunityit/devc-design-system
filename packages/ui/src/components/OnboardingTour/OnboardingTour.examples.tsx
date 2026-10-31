import { useState } from 'react';
import { Button } from '@dev-community/ui';
import { OnboardingTour } from '@dev-community/ui/widgets';

export function Guided() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Avvia guida</Button>
      <p id="tour-welcome">Benvenuto nel tuo spazio.</p>
      <Button id="tour-action" variant="outline">Azione di esempio</Button>
      <OnboardingTour aria-label="Guida introduttiva" isOpen={open} onOpenChange={setOpen} steps={[
        { id: 'welcome', target: '#tour-welcome', title: 'Benvenuto', content: 'Qui trovi le informazioni principali.' },
        { id: 'action', target: '#tour-action', title: 'Azione', content: 'Usa questo pulsante per iniziare.' },
      ]} />
    </>
  );
}
