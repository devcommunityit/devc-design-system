import { useState } from 'react';
import { Button, FileManager, Text, type FileManagerFile } from '@devcommunityit/ui';

const files: FileManagerFile[] = [
  { id: 'guide', name: 'Team guide.pdf', description: 'Getting started', size: '2.4 MB', modified: 'Updated today' },
  { id: 'brand', name: 'Brand assets.zip', size: '18 MB', modified: 'Updated yesterday' },
  { id: 'notes', name: 'Meeting notes.docx', size: '84 KB', modified: 'Updated 3 days ago' },
];

export function Basic() {
  return <FileManager aria-label="Project files" files={files} />;
}

export function WithActions() {
  const [opened, setOpened] = useState('');
  return (
    <>
      <FileManager
        aria-label="Shared project files"
        files={files}
        renderActions={(file) => (
          <Button size="sm" variant="outline" onPress={() => setOpened(file.name)}>
            Open
          </Button>
        )}
      />
      {opened ? <Text>Selected action for {opened}</Text> : null}
    </>
  );
}

export function ControlledSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['guide']);
  const [details, setDetails] = useState('');
  return (
    <>
      <FileManager
        aria-label="Selected project files"
        files={files}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        renderActions={(file) => <Button size="sm" variant="ghost" onPress={() => setDetails(file.name)}>Details</Button>}
      />
      <Text>Selected ids: {selectedIds.join(', ') || 'none'}{details ? ` · Details: ${details}` : ''}</Text>
    </>
  );
}
