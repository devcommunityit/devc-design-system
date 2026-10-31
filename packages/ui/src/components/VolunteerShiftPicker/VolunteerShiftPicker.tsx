import type { ReactNode } from 'react';
import { Radio, RadioGroup } from '../RadioGroup/RadioGroup';
import styles from './VolunteerShiftPicker.module.css';

export interface VolunteerShift {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  isAvailable?: boolean;
}

export interface VolunteerShiftPickerProps {
  label: string;
  shifts: readonly VolunteerShift[];
  value: string | null;
  onChange: (shiftId: string | null) => void;
  emptyState?: ReactNode;
}

/** Controlled shift selection; it does not reserve or register a volunteer. */
export function VolunteerShiftPicker({
  label,
  shifts,
  value,
  onChange,
  emptyState = 'No shifts are currently available.',
}: VolunteerShiftPickerProps) {
  if (shifts.length === 0) return <p className={styles.empty}>{emptyState}</p>;

  return (
    <RadioGroup className={styles.picker} label={label} value={value} onChange={onChange}>
      {shifts.map((shift) => (
        <Radio
          key={shift.id}
          value={shift.id}
          isDisabled={shift.isAvailable === false}
          description={shift.description}
        >
          {shift.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
