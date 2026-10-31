import { VolunteerShiftPicker } from './VolunteerShiftPicker';

export function Basic() {
  return (
    <VolunteerShiftPicker
      label="Choose a volunteer shift"
      value={null}
      onChange={() => {}}
      shifts={[
        { id: 'morning', label: 'Morning · 9:00–12:00', description: 'Welcome desk' },
        { id: 'afternoon', label: 'Afternoon · 13:00–16:00', description: 'Workshop support', isAvailable: false },
      ]}
    />
  );
}
