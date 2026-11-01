import { useState } from 'react';
import { Button } from '@devcommunityit/ui';
import { VenueFloorPlan, type VenueArea } from '@devcommunityit/ui/widgets';

const conferenceAreas: VenueArea[] = [
  { id: 'main', label: 'Sala Plenaria', kind: 'stage', shape: { x: 40, y: 40, width: 420, height: 260 }, capacity: 600, isAccessible: true, description: 'Keynote di apertura e chiusura, traduzione simultanea disponibile.' },
  { id: 'lab-a', label: 'Lab A', kind: 'room', shape: { x: 500, y: 40, width: 200, height: 160 }, capacity: 60, isAccessible: true },
  { id: 'lab-b', label: 'Lab B', kind: 'room', shape: { x: 740, y: 40, width: 220, height: 160 }, capacity: 80 },
  { id: 'expo', label: 'Area sponsor', kind: 'booth', shape: { points: [[500, 240], [960, 240], [960, 420], [700, 420], [700, 360], [500, 360]] }, description: '14 stand degli sponsor, demo dalle 10:00 alle 17:00.' },
  { id: 'cafe', label: 'Caffetteria', kind: 'food', shape: { x: 40, y: 340, width: 260, height: 140 }, isAccessible: true },
  { id: 'wc', label: 'Servizi', kind: 'restroom', shape: { x: 320, y: 340, width: 140, height: 140 }, isAccessible: true, description: 'Servizi accessibili e fasciatoio.' },
  { id: 'info', label: 'Accrediti', kind: 'info', shape: { x: 500, y: 440, width: 180, height: 120 } },
  { id: 'entrance', label: 'Ingresso', kind: 'entrance', shape: { x: 720, y: 460, width: 240, height: 100 }, isAccessible: true },
];

export function Conference() {
  return (
    <VenueFloorPlan
      label="Piantina del Centro Congressi"
      areas={conferenceAreas}
      markers={[{ id: 'you', x: 250, y: 545, label: 'Sei qui' }]}
      defaultSelectedId="main"
    />
  );
}

const levelAreas: VenueArea[] = [
  { id: 'hall', label: 'Hall', kind: 'entrance', level: 'ground', shape: { x: 40, y: 360, width: 920, height: 200 }, isAccessible: true },
  { id: 'auditorium', label: 'Auditorium', kind: 'stage', level: 'ground', shape: { x: 40, y: 40, width: 560, height: 280 }, capacity: 400, isAccessible: true },
  { id: 'bar', label: 'Bar', kind: 'food', level: 'ground', shape: { x: 640, y: 40, width: 320, height: 280 } },
  { id: 'room-1', label: 'Sala 1', kind: 'room', level: 'first', shape: { x: 40, y: 40, width: 280, height: 220 }, capacity: 40 },
  { id: 'room-2', label: 'Sala 2', kind: 'room', level: 'first', shape: { x: 360, y: 40, width: 280, height: 220 }, capacity: 40 },
  { id: 'room-3', label: 'Sala 3', kind: 'room', level: 'first', shape: { x: 680, y: 40, width: 280, height: 220 }, capacity: 30, isDisabled: true, description: 'Chiusa per allestimento.' },
  { id: 'terrace', label: 'Terrazza', kind: 'outdoor', level: 'first', shape: { x: 40, y: 300, width: 600, height: 260 } },
  { id: 'lift', label: 'Ascensore', kind: 'service', level: 'first', shape: { x: 680, y: 300, width: 280, height: 260 }, isAccessible: true },
];

export function MultiLevel() {
  return (
    <VenueFloorPlan
      label="Piantina della sede su due piani"
      areas={levelAreas}
      levels={[
        { id: 'ground', label: 'Piano terra' },
        { id: 'first', label: 'Primo piano' },
      ]}
    />
  );
}

const tracks = {
  frontend: { label: 'Track Frontend', rooms: ['main', 'lab-a'] },
  cloud: { label: 'Track Cloud', rooms: ['lab-b', 'expo'] },
} as const;

const sessions: Record<string, string[]> = {
  main: ['09:30 · Keynote: il web nel 2027', '14:00 · Design system su larga scala'],
  'lab-a': ['11:00 · Workshop React Server Components'],
  'lab-b': ['10:00 · Kubernetes senza paura', '15:30 · Costi cloud sotto controllo'],
};

export function TrackHighlight() {
  const [track, setTrack] = useState<keyof typeof tracks>('frontend');
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div style={{ display: 'grid', gap: 'var(--dc-space-3)' }}>
      <div style={{ display: 'flex', gap: 'var(--dc-space-2)', flexWrap: 'wrap' }}>
        {(Object.keys(tracks) as Array<keyof typeof tracks>).map((key) => (
          <Button key={key} size="sm" variant={key === track ? 'primary' : 'secondary'} aria-pressed={key === track} onPress={() => setTrack(key)}>
            {tracks[key].label}
          </Button>
        ))}
      </div>
      <VenueFloorPlan
        label="Sale della track selezionata"
        areas={conferenceAreas}
        highlightedIds={tracks[track].rooms}
        selectedId={selected}
        onSelectionChange={setSelected}
        renderDetails={(area) =>
          sessions[area.id]?.length ? (
            <ul style={{ margin: 0, paddingInlineStart: 'var(--dc-space-4)' }}>
              {sessions[area.id]?.map((session) => (
                <li key={session}>{session}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>Nessuna sessione in programma.</p>
          )
        }
      />
    </div>
  );
}
