import { forwardRef, useState } from 'react';
import { Radio, RadioGroup, composeRenderProps, type RadioGroupProps } from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import styles from './Rating.module.css';

export interface RatingProps
  extends Omit<RadioGroupProps, 'children' | 'value' | 'defaultValue' | 'onChange' | 'orientation'>,
    FieldBaseProps {
  /** Controlled value: 1…max, or `null` when nothing is selected. */
  value?: number | null;
  /** Initial value (uncontrolled). @default null */
  defaultValue?: number | null;
  onChange?: (value: number) => void;
  /** Number of stars. @default 5 */
  max?: number;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Show the numeric value ("4/5") next to the stars. @default false */
  showValue?: boolean;
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.star}>
      <path d="M12 2.8l2.83 5.73 6.32.92-4.57 4.46 1.08 6.3L12 17.24l-5.66 2.97 1.08-6.3-4.57-4.46 6.32-.92L12 2.8z" />
    </svg>
  );
}

/**
 * Star rating built on a native radio group: arrow keys move and select, every star has a
 * localized accessible name ("4 of 5"). Hovering previews the value; the selection never relies on color alone
 * (filled vs outlined stars). Whole values only; once selected, the value cannot be cleared (radio semantics).
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value: valueProp,
    defaultValue = null,
    onChange,
    max = 5,
    size = 'md',
    showValue = false,
    label,
    description,
    errorMessage,
    necessityIndicator,
    isRequired,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const { locale } = useLocale();
  const [value, setValue] = useControllableState<number | null>(valueProp, defaultValue, (next) => {
    if (next !== null) onChange?.(next);
  });
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? value ?? 0;
  const format = new Intl.NumberFormat(locale);

  return (
    <RadioGroup
      ref={ref}
      {...rest}
      orientation="horizontal"
      isRequired={isRequired}
      value={value === null ? null : String(value)}
      onChange={(next) => {
        // A keyboard change while the pointer rests on a star must show the new value, not the preview.
        setHovered(null);
        setValue(Number(next));
      }}
      data-size={size}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.rating, cn))}
    >
      {({ isReadOnly, isDisabled }) => (
        <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
          <div className={styles.row}>
            <div className={styles.stars}>
              {Array.from({ length: max }, (_, i) => {
                const n = i + 1;
                return (
                  <Radio
                    key={n}
                    value={String(n)}
                    className={styles.item}
                    data-filled={n <= shown || undefined}
                    data-preview={hovered !== null || undefined}
                    onHoverStart={() => {
                      if (!isReadOnly && !isDisabled) setHovered(n);
                    }}
                    onHoverEnd={() => setHovered((current) => (current === n ? null : current))}
                  >
                    <Star />
                    <span className={styles.srOnly}>{t.ratingValue(n, max)}</span>
                  </Radio>
                );
              })}
            </div>
            {showValue ? (
              <span className={styles.value} aria-hidden="true">
                {format.format(value ?? 0)}/{format.format(max)}
              </span>
            ) : null}
          </div>
        </FieldParts>
      )}
    </RadioGroup>
  );
});
