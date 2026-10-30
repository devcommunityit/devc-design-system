import { DateInput as RACDateInput, DateSegment, type DateInputProps as RACDateInputProps } from 'react-aria-components';
import { cx } from '../../utils';
import styles from './DatePicker.module.css';

export type DateSegmentsProps = Omit<RACDateInputProps, 'children'>;

/** Internal: editable date/time segments (each segment is a spin button). */
export function DateSegments({ className, ...rest }: DateSegmentsProps) {
  return (
    <RACDateInput {...rest} className={cx(styles.dateInput, typeof className === 'string' ? className : undefined)}>
      {(segment) => <DateSegment segment={segment} className={styles.segment} />}
    </RACDateInput>
  );
}