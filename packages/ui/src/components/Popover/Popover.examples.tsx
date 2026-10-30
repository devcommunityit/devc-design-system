import { useState } from 'react';
import { Button, IconButton, Popover, PopoverTrigger, Stack, Switch, Text } from '@dev-community/ui';
import { Info } from 'lucide-react';

export function Basic() {
  return (
    <PopoverTrigger>
      <IconButton label="Informazioni sul piano" icon={<Info />} variant="ghost" />
      <Popover title="Piano Business" placement="bottom start">
        <Text>Include 25 utenti, 100 GB di spazio e supporto prioritario.</Text>
      </Popover>
    </PopoverTrigger>
  );
}

export function Interactive() {
  const [compact, setCompact] = useState(false);
  return (
    <PopoverTrigger>
      <Button variant="secondary">Opzioni vista</Button>
      <Popover title="Opzioni vista">
        {({ close }) => (
          <Stack gap={3}>
            <Switch isSelected={compact} onChange={setCompact}>
              Righe compatte
            </Switch>
            <Button size="sm" onPress={close}>
              Fatto
            </Button>
          </Stack>
        )}
      </Popover>
    </PopoverTrigger>
  );
}