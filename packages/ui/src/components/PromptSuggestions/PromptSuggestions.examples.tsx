import { useState } from 'react';
import { Button, PromptComposer, PromptSuggestions, Stack, Text } from '@dev-community/ui';

const items = [
  { id: 'summary', label: 'Riassumi', prompt: 'Riassumi i punti principali del documento' },
  { id: 'ideas', label: 'Proponi idee', prompt: 'Proponi tre idee per migliorare la homepage' },
  { id: 'translate', label: 'Traduci', prompt: 'Traduci il contenuto in inglese' },
];

export function Basic() {
  const [selected, setSelected] = useState('');
  return <Stack gap={3}><PromptSuggestions aria-label="Suggerimenti rapidi" items={items} onAction={(item) => setSelected(item.prompt)} /><Text role="status">{selected || 'Scegli una richiesta suggerita.'}</Text></Stack>;
}

export function FillComposer() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState('');
  return <Stack gap={3}><PromptSuggestions aria-label="Compila il campo" items={items} onAction={(item) => setValue(item.prompt)} /><PromptComposer label="Prompt da suggerimento" value={value} onChange={setValue} onSend={setSent} /><Text role="status">{sent ? `Ricevuto localmente: ${sent}` : 'Il suggerimento riempie il campo senza inviarlo automaticamente.'}</Text></Stack>;
}

export function Disabled() {
  const [disabled, setDisabled] = useState(true);
  const [last, setLast] = useState('');
  return <Stack gap={3}><Button variant="secondary" onPress={() => setDisabled((current) => !current)}>{disabled ? 'Abilita suggerimenti' : 'Disabilita suggerimenti'}</Button><PromptSuggestions aria-label="Suggerimenti disabilitabili" items={items} isDisabled={disabled} onAction={(item) => setLast(item.label)} /><Text role="status">{last || 'Nessuna azione selezionata.'}</Text></Stack>;
}
