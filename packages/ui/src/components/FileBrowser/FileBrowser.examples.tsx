import { useState } from 'react';
import { FileBrowser, type FileBrowserItem } from '@dev-community/ui/widgets';

const preview = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#dbeafe"/><circle cx="160" cy="100" r="50" fill="#2563eb"/></svg>')}`;
const items: FileBrowserItem[] = [
  { id: 'assets', name: 'Immagini', kind: 'folder', children: [
    { id: 'logo', name: 'Logo', kind: 'file', preview: { src: preview, alt: 'Anteprima del logo' } },
  ] },
  { id: 'guide', name: 'Guida.pdf', kind: 'file', size: '2 MB' },
];

export function Browser() {
  const [opened, setOpened] = useState('');
  return <><FileBrowser aria-label="File del progetto" items={items} rootLabel="Progetto" onOpenFile={(file) => setOpened(file.name)} />{opened ? <p>File selezionato: {opened}</p> : null}</>;
}
