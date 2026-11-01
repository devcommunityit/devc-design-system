import { useState } from 'react';
import { FormWizard } from '@devcommunityit/ui';

export function Registration() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <FormWizard aria-label="Registrazione" onComplete={() => setSubmitted(true)} steps={[
        { id: 'name', label: 'Profilo', content: <label>Nome <input value={name} onChange={(event) => setName(event.target.value)} /></label>, validate: () => name.trim().length > 0 },
        { id: 'review', label: 'Riepilogo', content: <p>Nome: {name}</p> },
      ]} />
      {submitted ? <p>Registrazione confermata.</p> : null}
    </>
  );
}
