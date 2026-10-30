import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Inline, Stack, Text } from '@dev-community/ui';
import { Folder } from 'lucide-react';

export function Basic() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbItem href="#clienti">Clienti</BreadcrumbItem>
      <BreadcrumbItem>Studio Bianchi S.r.l.</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function Collapsed() {
  return (
    <Breadcrumb maxItems={3} aria-label="Percorso fattura">
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbItem href="#amministrazione">Amministrazione</BreadcrumbItem>
      <BreadcrumbItem href="#fatture">Fatture</BreadcrumbItem>
      <BreadcrumbItem href="#2025">2025</BreadcrumbItem>
      <BreadcrumbItem>Fattura n. 2025/0142 del 14 febbraio</BreadcrumbItem>
    </Breadcrumb>
  );
}

const folderTree: Record<string, string[]> = {
  Documenti: ['Progetti', 'Contratti'],
  Progetti: ['Portale clienti', 'App mobile'],
  Contratti: ['Fornitori', 'Dipendenti'],
  'Portale clienti': [],
  'App mobile': [],
  Fornitori: [],
  Dipendenti: [],
};

export function FolderNavigation() {
  const [path, setPath] = useState<string[]>(['Documenti']);
  const currentFolder = path[path.length - 1] ?? 'Documenti';
  const subfolders = folderTree[currentFolder] ?? [];
  return (
    <Stack gap={3}>
      <Breadcrumb aria-label="Percorso cartelle">
        {path.map((folder, index) =>
          index === path.length - 1 ? (
            <BreadcrumbItem key={folder}>{folder}</BreadcrumbItem>
          ) : (
            <BreadcrumbItem
              key={folder}
              href={`#cartella-${index}`}
              linkProps={{ onPress: () => setPath((p) => p.slice(0, index + 1)) }}
            >
              {folder}
            </BreadcrumbItem>
          ),
        )}
      </Breadcrumb>
      {subfolders.length > 0 ? (
        <Inline gap={2} wrap>
          {subfolders.map((folder) => (
            <Button key={folder} variant="outline" size="sm" startIcon={<Folder />} onPress={() => setPath((p) => [...p, folder])}>
              {`Apri ${folder}`}
            </Button>
          ))}
        </Inline>
      ) : (
        <Text variant="body-sm" tone="secondary">
          La cartella {currentFolder} non contiene sottocartelle: usa il percorso per tornare indietro.
        </Text>
      )}
    </Stack>
  );
}

export function LongLabels() {
  return (
    <div style={{ maxInlineSize: '24rem' }}>
      <Breadcrumb aria-label="Percorso pratica">
        <BreadcrumbItem href="#sportello">Sportello unico per le attività produttive</BreadcrumbItem>
        <BreadcrumbItem href="#autorizzazioni">Autorizzazioni paesaggistiche e ambientali</BreadcrumbItem>
        <BreadcrumbItem href="#pratica-1187" isCurrent>
          Pratica n. 2025/1187 – Ampliamento del capannone industriale di via dei Mille
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}