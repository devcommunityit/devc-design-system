import { useEffect, useRef, useState } from 'react';
import { BulkActionBar, Button, Checkbox, Stack, Text } from '@dev-community/ui';

export function Basic() {
  const [count, setCount] = useState(3);
  const [notice, setNotice] = useState('');
  const resetRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (count === 0) resetRef.current?.focus(); }, [count]);
  return <Stack gap={3}><Text>Le azioni modificano solo lo stato di questa demo.</Text><BulkActionBar count={count} onClear={() => setCount(0)}><Button size="sm" onPress={() => { setNotice(`${count} pagine archiviate localmente.`); setCount(0); }}>Archivia</Button></BulkActionBar><Button ref={resetRef} variant="secondary" isDisabled={count > 0} onPress={() => { setCount(3); setNotice(''); }}>Seleziona tre pagine</Button><Text role="status">{notice}</Text></Stack>;
}

export function WithSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const selectionRef = useRef<HTMLDivElement>(null);
  return <Stack gap={3}><div ref={selectionRef} role="group" aria-label="Pagine da selezionare" tabIndex={-1}>{['Homepage', 'Servizi', 'Contatti'].map((name) => <Checkbox key={name} isSelected={selected.includes(name)} onChange={(checked) => setSelected((current) => checked ? [...current, name] : current.filter((item) => item !== name))}>{name}</Checkbox>)}</div><BulkActionBar count={selected.length} onClear={() => { setSelected([]); selectionRef.current?.focus(); }}><Button size="sm" onPress={() => setNotice(`Revisione locale richiesta: ${selected.join(', ')}`)}>Richiedi revisione</Button></BulkActionBar><Text role="status">{notice || 'Seleziona almeno una pagina per mostrare la barra.'}</Text></Stack>;
}

export function Sticky() {
  const [enabled, setEnabled] = useState(true);
  return <Stack gap={3}><Text>La barra sticky resta nel flusso del contenitore; non blocca il focus.</Text><BulkActionBar count={2} sticky><Button size="sm" variant="secondary" onPress={() => setEnabled((current) => !current)}>{enabled ? 'Metti in pausa localmente' : 'Riprendi localmente'}</Button></BulkActionBar><Text role="status">{enabled ? 'Revisione attiva' : 'Revisione in pausa'}</Text></Stack>;
}
