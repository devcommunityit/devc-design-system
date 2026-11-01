import { useState } from 'react';
import { Button, ChatMessage, PromptComposer, PromptSuggestions, ResponseFeedback, SourceList, Stack, Text } from '@devcommunityit/ui';

export function Basic() {
  const [last, setLast] = useState('');
  return <Stack gap={3}><PromptComposer label="Richiesta di esempio" onSend={setLast} description="Invio per inviare, Maiusc+Invio per andare a capo." /><Text role="status">{last ? `Ricevuto localmente: ${last}` : 'Nessuna richiesta inviata.'}</Text></Stack>;
}

export function Controlled() {
  const [value, setValue] = useState('Riassumi le novità del sito');
  const [sent, setSent] = useState('');
  return <Stack gap={3}><PromptComposer label="Richiesta controllata" value={value} onChange={setValue} onSend={(prompt) => { setSent(prompt); setValue(''); }} /><Text role="status">{sent ? `Invio locale: ${sent}` : 'Il consumer cancella il campo dopo l’invio.'}</Text></Stack>;
}

export function GenerationState() {
  const [generating, setGenerating] = useState(false);
  return <Stack gap={3}><Text>Simulazione locale dello stato: nessun modello AI collegato.</Text><Button variant="secondary" isDisabled={generating} onPress={() => setGenerating(true)}>Simula generazione</Button><PromptComposer label="Richiesta con interruzione" defaultValue="Prepara un titolo" isGenerating={generating} onStop={() => setGenerating(false)} onSend={() => setGenerating(true)} /><Text role="status">{generating ? 'Stato locale: in corso' : 'Stato locale: pronto'}</Text></Stack>;
}

export function AssistantWorkspace() {
  const [prompt, setPrompt] = useState('');
  const [request, setRequest] = useState('');
  return (
    <Stack gap={4}>
      <Text tone="secondary">Demo locale deterministica: la risposta è predefinita, non viene chiamato un modello AI.</Text>
      <PromptSuggestions items={[
        { id: 'launch', label: 'Piano di lancio', prompt: 'Suggerisci una checklist per pubblicare il sito' },
        { id: 'theme', label: 'Scelta del tema', prompt: 'Come posso personalizzare il tema?' },
      ]} onAction={(item) => setPrompt(item.prompt)} />
      {request ? (
        <Stack gap={3}>
          <ChatMessage speaker="user">{request}</ChatMessage>
          <ChatMessage footer={<><SourceList label="Riferimenti della demo" sources={[{ id: 'theme', title: 'Guida ai temi', href: '/guide/temi' }, { id: 'a11y', title: 'Accessibilità', href: '/guide/accessibilita' }]} /><ResponseFeedback key={request} /></>}>
            Risposta dimostrativa: verifica contenuti, contrasto e navigazione da tastiera; prova il tema chiaro e scuro prima della pubblicazione.
          </ChatMessage>
        </Stack>
      ) : null}
      <PromptComposer label="Richiesta all’assistente dimostrativo" value={prompt} onChange={setPrompt} onSend={(text) => { setRequest(text); setPrompt(''); }} footer="Solo stato locale · nessuna rete" />
    </Stack>
  );
}
