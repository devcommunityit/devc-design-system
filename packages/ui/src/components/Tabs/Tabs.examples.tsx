import { BarChart3, Settings, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge, Tab, TabList, TabPanel, Tabs, Text, type Key } from '@devcommunityit/ui';

export function Basic() {
  return (
    <Tabs defaultSelectedKey="overview">
      <TabList aria-label="Progetto">
        <Tab id="overview">Panoramica</Tab>
        <Tab id="activity">Attività</Tab>
        <Tab id="settings">Impostazioni</Tab>
      </TabList>
      <TabPanel id="overview">
        <Text>Riepilogo del progetto Atlas: 12 attività aperte, 3 in ritardo.</Text>
      </TabPanel>
      <TabPanel id="activity">
        <Text>Ultima modifica: oggi alle 09:41 da Giulia Rossi.</Text>
      </TabPanel>
      <TabPanel id="settings">
        <Text>Visibilità: team interno. Notifiche: solo menzioni.</Text>
      </TabPanel>
    </Tabs>
  );
}

export function PillWithIcons() {
  return (
    <Tabs variant="pill" defaultSelectedKey="stats">
      <TabList aria-label="Sezioni">
        <Tab id="stats" icon={<BarChart3 />}>
          Statistiche
        </Tab>
        <Tab id="team" icon={<Users />} badge={<Badge tone="info">4</Badge>}>
          Team
        </Tab>
        <Tab id="config" icon={<Settings />} isDisabled>
          Configurazione
        </Tab>
      </TabList>
      <TabPanel id="stats">
        <Text>Visite settimanali: 18.420 (+6%).</Text>
      </TabPanel>
      <TabPanel id="team">
        <Text>4 membri, 1 invito in attesa.</Text>
      </TabPanel>
      <TabPanel id="config">
        <Text>Non disponibile.</Text>
      </TabPanel>
    </Tabs>
  );
}

export function Controlled() {
  const [key, setKey] = useState<Key>('b');
  return (
    <Tabs selectedKey={key} onSelectionChange={setKey} keyboardActivation="manual">
      <TabList aria-label="Trimestre">
        <Tab id="a">T1</Tab>
        <Tab id="b">T2</Tab>
        <Tab id="c">T3</Tab>
      </TabList>
      <TabPanel id="a">
        <Text>Ricavi T1: € 120.000</Text>
      </TabPanel>
      <TabPanel id="b">
        <Text>Ricavi T2: € 134.500</Text>
      </TabPanel>
      <TabPanel id="c">
        <Text>Ricavi T3: € 128.900</Text>
      </TabPanel>
    </Tabs>
  );
}

export function Vertical() {
  return (
    <Tabs orientation="vertical" defaultSelectedKey="profile">
      <TabList aria-label="Account">
        <Tab id="profile">Profilo</Tab>
        <Tab id="security">Sicurezza</Tab>
        <Tab id="billing">Fatturazione</Tab>
      </TabList>
      <TabPanel id="profile">
        <Text>Nome, foto e lingua dell’interfaccia.</Text>
      </TabPanel>
      <TabPanel id="security">
        <Text>Password e sessioni attive.</Text>
      </TabPanel>
      <TabPanel id="billing">
        <Text>Piano Team, rinnovo il 1° marzo.</Text>
      </TabPanel>
    </Tabs>
  );
}
