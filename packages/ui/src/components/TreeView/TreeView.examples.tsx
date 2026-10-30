import { FileText, Folder, Image } from 'lucide-react';
import { useState } from 'react';
import { Stack, Text, TreeView, TreeViewItem, type Key, type Selection } from '@dev-community/ui';

export function Basic() {
  return (
    <TreeView aria-label="File del progetto" defaultExpandedKeys={['docs']}>
      <TreeViewItem id="docs" title="Documenti" icon={<Folder />} description="3">
        <TreeViewItem id="contract" title="Contratto 2024.pdf" icon={<FileText />} />
        <TreeViewItem id="budget" title="Budget Q3.xlsx" icon={<FileText />} />
        <TreeViewItem id="archive" title="Archivio" icon={<Folder />}>
          <TreeViewItem id="old" title="Verbale 2022.docx" icon={<FileText />} />
        </TreeViewItem>
      </TreeViewItem>
      <TreeViewItem id="images" title="Immagini" icon={<Folder />} description="1">
        <TreeViewItem id="logo" title="logo.svg" icon={<Image />} />
      </TreeViewItem>
      <TreeViewItem id="readme" title="LEGGIMI.txt" icon={<FileText />} />
    </TreeView>
  );
}

/** Controlled expansion and single selection: the detail shows the selected item. */
export function ControlledSelection() {
  const [expanded, setExpanded] = useState<Set<Key>>(new Set(['north']));
  const [selected, setSelected] = useState<Selection>(new Set(['milan']));
  const current = selected === 'all' ? 'all' : ([...selected][0] ?? 'none');
  return (
    <Stack gap={3}>
      <TreeView
        aria-label="Offices"
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        expandedKeys={expanded}
        onExpandedChange={setExpanded}
      >
        <TreeViewItem id="north" title="North" description="2 offices">
          <TreeViewItem id="milan" title="Milan" />
          <TreeViewItem id="turin" title="Turin" />
        </TreeViewItem>
        <TreeViewItem id="south" title="South" description="1 office">
          <TreeViewItem id="naples" title="Naples" />
        </TreeViewItem>
      </TreeView>
      <Text variant="body-sm" tone="secondary">
        Selected: {String(current)} · Expanded: {[...expanded].join(', ') || 'none'}
      </Text>
    </Stack>
  );
}

/** Multiple selection with checkboxes (selectionBehavior="toggle", the default) and a disabled item. */
export function Checkboxes() {
  const [selected, setSelected] = useState<Selection>(new Set(['read']));
  const count = selected === 'all' ? 'tutti' : selected.size;
  return (
    <Stack gap={3}>
      <TreeView
        aria-label="Permessi"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        defaultExpandedKeys={['content', 'admin']}
        disabledKeys={['billing']}
        size="sm"
      >
        <TreeViewItem id="content" title="Contenuti">
          <TreeViewItem id="read" title="Lettura" />
          <TreeViewItem id="write" title="Scrittura" />
        </TreeViewItem>
        <TreeViewItem id="admin" title="Amministrazione">
          <TreeViewItem id="users" title="Gestione utenti" />
          <TreeViewItem id="billing" title="Fatturazione (solo proprietario)" />
        </TreeViewItem>
      </TreeView>
      <Text variant="body-sm" tone="secondary">Permessi selezionati: {count}</Text>
    </Stack>
  );
}
