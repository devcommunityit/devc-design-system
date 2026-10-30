import { forwardRef, type ReactNode } from 'react';
import {
  Label,
  Slider as RACSlider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Text,
  composeRenderProps,
  type SliderProps as RACSliderProps,
} from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import fieldStyles from '../Field/Field.module.css';
import styles from './Slider.module.css';

interface SliderCommonProps {
  label?: ReactNode;
  description?: ReactNode;
  /** Show the formatted value next to the label. @default true */
  showValue?: boolean;
  /** Show min and max under the track. @default false */
  showBounds?: boolean;
}

export interface SliderProps extends Omit<RACSliderProps<number>, 'children'>, SliderCommonProps {
  /** Hidden input name for native form submission. */
  name?: string;
}

function Bounds({ min = 0, max = 100, format }: { min?: number; max?: number; format: Intl.NumberFormat }) {
  const t = useMessages();
  return (
    <div className={styles.bounds} aria-hidden="true">
      <span title={t.minimum}>{format.format(min)}</span>
      <span title={t.maximum}>{format.format(max)}</span>
    </div>
  );
}

function useFormatter(options: Intl.NumberFormatOptions | undefined) {
  const { locale } = useLocale();
  return new Intl.NumberFormat(locale, options);
}

/** Single-value slider (APG Slider). Uses a native `<input type="range">` per thumb for assistive technologies. */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { label, description, showValue = true, showBounds = false, name, className, formatOptions, minValue, maxValue, ...rest },
  ref,
) {
  const format = useFormatter(formatOptions);
  return (
    <RACSlider
      ref={ref}
      {...rest}
      minValue={minValue}
      maxValue={maxValue}
      formatOptions={formatOptions}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.slider, cn))}
    >
      <div className={styles.header}>
        {label ? <Label className={fieldStyles.label}>{label}</Label> : null}
        {showValue ? <SliderOutput className={styles.output} /> : null}
      </div>
      <SliderTrack className={styles.track}>
        <SliderFill className={styles.fill} />
        <SliderThumb className={styles.thumb} name={name} />
      </SliderTrack>
      {showBounds ? <Bounds min={minValue} max={maxValue} format={format} /> : null}
      {description ? (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      ) : null}
    </RACSlider>
  );
});

export interface RangeSliderProps extends Omit<RACSliderProps<number[]>, 'children' | 'value' | 'defaultValue' | 'onChange' | 'onChangeEnd'>, SliderCommonProps {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
  /** Hidden input names for the start and end thumbs. */
  startName?: string;
  endName?: string;
  /** Accessible labels of the two thumbs. @default localized "Minimum" / "Maximum" */
  thumbLabels?: [string, string];
}

const toPair = (v: number[]): [number, number] => [v[0] ?? 0, v[1] ?? v[0] ?? 0];

/** Two-thumb range slider: thumbs cannot cross each other. */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
  {
    label,
    description,
    showValue = true,
    showBounds = false,
    startName,
    endName,
    thumbLabels,
    className,
    formatOptions,
    minValue = 0,
    maxValue = 100,
    value,
    defaultValue,
    onChange,
    onChangeEnd,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const format = useFormatter(formatOptions);
  const [startLabel, endLabel] = thumbLabels ?? [t.minimum, t.maximum];
  return (
    <RACSlider<number[]>
      ref={ref}
      {...rest}
      minValue={minValue}
      maxValue={maxValue}
      formatOptions={formatOptions}
      value={value}
      defaultValue={defaultValue ?? (value ? undefined : [minValue, maxValue])}
      onChange={onChange ? (v) => onChange(toPair(v)) : undefined}
      onChangeEnd={onChangeEnd ? (v) => onChangeEnd(toPair(v)) : undefined}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.slider, cn))}
    >
      <div className={styles.header}>
        {label ? <Label className={fieldStyles.label}>{label}</Label> : null}
        {showValue ? <SliderOutput className={styles.output} /> : null}
      </div>
      <SliderTrack className={styles.track}>
        <SliderFill className={styles.fill} />
        <SliderThumb index={0} aria-label={startLabel} name={startName} className={styles.thumb} />
        <SliderThumb index={1} aria-label={endLabel} name={endName} className={styles.thumb} />
      </SliderTrack>
      {showBounds ? <Bounds min={minValue} max={maxValue} format={format} /> : null}
      {description ? (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      ) : null}
    </RACSlider>
  );
});