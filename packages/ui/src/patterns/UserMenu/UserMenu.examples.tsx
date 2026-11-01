import { HelpCircle, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Button, Header, MenuItem, Stack, Text, UserMenu, type Key } from '@devcommunityit/ui';

const labels: Record<string, string> = { profile: 'Profilo', settings: 'Impostazioni', help: 'Assistenza' };

/** Logged-in header: the menu reports the chosen action; sign-out swaps the menu for a sign-in button. */
export function LoggedUserHeader() {
  const [signedIn, setSignedIn] = useState(true);
  const [last, setLast] = useState<string>('nessuna');
  const onAction = (key: Key) => setLast(labels[String(key)] ?? String(key));
  return (
    <Stack gap={3}>
      <div style={{ border: '1px solid var(--dc-color-border-subtle)', borderRadius: 'var(--dc-radius-lg)', overflow: 'hidden' }}>
        <Header
          sticky={false}
          brand={<Text as="span" weight="bold">Acme Portal</Text>}
          actions={
            signedIn ? (
              <UserMenu
                user={{ name: 'Giulia Bianchi', email: 'giulia.bianchi@acme.example', role: 'Amministratrice' }}
                onAction={onAction}
                onSignOut={() => {
                  setSignedIn(false);
                  setLast('uscita');
                }}
              >
                <MenuItem id="profile" icon={<User />}>Profilo</MenuItem>
                <MenuItem id="settings" icon={<Settings />}>Impostazioni</MenuItem>
                <MenuItem id="help" icon={<HelpCircle />}>Assistenza</MenuItem>
              </UserMenu>
            ) : (
              <Button size="sm" onPress={() => setSignedIn(true)}>
                Accedi
              </Button>
            )
          }
        />
      </div>
      <Text tone="secondary" role="status">
        Ultima azione: {last}
      </Text>
    </Stack>
  );
}

/** Name always visible, English labels and a custom sign-out text. */
export function AlwaysShowName() {
  const [last, setLast] = useState('none');
  return (
    <Stack gap={3} align="start">
      <UserMenu
        user={{ name: 'Alexander Montgomery-Fitzgerald', email: 'alexander.montgomery-fitzgerald@example.com' }}
        showName="always"
        signOutLabel="Log out"
        placement="bottom start"
        onAction={(key) => setLast(String(key))}
        onSignOut={() => setLast('log out')}
      >
        <MenuItem id="account">Account</MenuItem>
      </UserMenu>
      <Text tone="secondary" role="status">
        Last action: {last}
      </Text>
    </Stack>
  );
}
