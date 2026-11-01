import { useState } from 'react';
import { Button, ChatMessage, Inline, ResponseFeedback, Stack } from '@devcommunityit/ui';

export function Basic() {
  return <Stack gap={3}><ChatMessage speaker="user">Come posso cambiare la palette?</ChatMessage><ChatMessage footer={<ResponseFeedback />}>Usa il selettore del tema oppure crea un tema personalizzato con createTheme.</ChatMessage><ChatMessage speaker="system">Contenuto dimostrativo, non generato da un modello.</ChatMessage></Stack>;
}

export function Streaming() {
  const [text, setText] = useState('Prima parte della risposta.');
  const [complete, setComplete] = useState(false);
  return <Stack gap={3}><ChatMessage status={complete ? 'complete' : 'streaming'}>{text}</ChatMessage><Inline wrap gap={2}><Button variant="secondary" isDisabled={complete} onPress={() => setText((current) => `${current} Frammento locale aggiunto.`)}>Aggiungi frammento locale</Button><Button isDisabled={complete} onPress={() => setComplete(true)}>Termina esempio</Button><Button variant="ghost" onPress={() => { setText('Prima parte della risposta.'); setComplete(false); }}>Ripristina</Button></Inline></Stack>;
}

export function ErrorState() {
  const [failed, setFailed] = useState(true);
  return <ChatMessage status={failed ? 'error' : 'complete'} statusText="Errore dimostrativo: servizio non raggiungibile." footer={<Button variant="secondary" onPress={() => setFailed((current) => !current)}>{failed ? 'Ripristina localmente' : 'Mostra errore'}</Button>}>{failed ? 'La risposta parziale resta disponibile.' : 'Stato ripristinato localmente, senza chiamate di rete.'}</ChatMessage>;
}
