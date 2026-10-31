import { ScheduleGrid } from './ScheduleGrid';

export function Basic() {
  return (
    <ScheduleGrid
      title="Thursday schedule"
      tracks={[
        { id: 'main', name: 'Main stage', sessions: [
          { id: 'keynote', title: 'Opening keynote', startTime: '09:30', endTime: '10:15', location: 'Auditorium' },
          { id: 'panel', title: 'Community panel', startTime: '10:30', endTime: '11:15' },
        ] },
        { id: 'workshop', name: 'Workshop room', sessions: [
          { id: 'lab', title: 'Design systems lab', startTime: '10:30', endTime: '11:30', location: 'Room 2' },
        ] },
      ]}
    />
  );
}
