import { forwardRef, type CSSProperties } from 'react';
import {
  Button as RACButton,
  ColorArea,
  ColorField,
  ColorPicker as RACColorPicker,
  ColorSlider,
  ColorSwatch as RACColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  Dialog,
  DialogTrigger,
  Group,
  SliderTrack,
  type Color,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { Input } from '../TextField/TextField';
import { PopoverSurface, type PopoverSurfaceProps } from '../Popover/Popover';
import styles from './ColorPicker.module.css';

export type { Color } from 'react-aria-components';
export { parseColor } from 'react-aria-components';

export interface ColorPickerProps extends FieldBaseProps {
  /** Controlled color (hex string such as `#0f62fe`, or a `Color` from `parseColor`). */
  value?: string | Color;
  /** @default '#000000' */
  defaultValue?: string | Color;
  onChange?: (color: Color) => void;
  /** Preset colors shown under the editor. */
  swatches?: string[];
  /** Name of the hidden form value (hex). */
  name?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  popoverProps?: Omit<PopoverSurfaceProps, 'children'>;
}

/**
 * Color input: editable hex field plus a popover with a saturation/brightness area, hue slider and
 * optional swatches. All parts stay in sync and are keyboard accessible.
 */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(function ColorPicker(
  {
    value,
    defaultValue = '#000000',
    onChange,
    swatches,
    label,
    description,
    errorMessage,
    necessityIndicator,
    name,
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid,
    className,
    style,
    id,
    popoverProps,
  },
  ref,
) {
  const t = useMessages();
  const locked = isDisabled || isReadOnly;
  return (
    <RACColorPicker value={value} defaultValue={value === undefined ? defaultValue : undefined} onChange={onChange}>
      <ColorField
        id={id}
        name={name}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isInvalid={isInvalid}
        className={cx(fieldStyles.field, className)}
        style={style}
      >
        <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
          <Group className={cx(fieldStyles.control, styles.control)}>
            <DialogTrigger>
              <RACButton className={styles.trigger} aria-label={t.colorPicker} isDisabled={locked}>
                <RACColorSwatch className={styles.swatch} />
              </RACButton>
              <PopoverSurface placement="bottom start" {...popoverProps}>
                <Dialog className={styles.dialog} aria-label={t.colorPicker}>
                  <ColorArea className={styles.area} colorSpace="hsb" xChannel="saturation" yChannel="brightness">
                    <ColorThumb className={styles.thumb} />
                  </ColorArea>
                  <ColorSlider className={styles.slider} colorSpace="hsb" channel="hue" aria-label={t.hue}>
                    <SliderTrack className={styles.track}>
                      <ColorThumb className={cx(styles.thumb, styles.sliderThumb)} />
                    </SliderTrack>
                  </ColorSlider>
                  {swatches && swatches.length > 0 ? (
                    <ColorSwatchPicker className={styles.swatches}>
                      {swatches.map((c) => (
                        <ColorSwatchPickerItem key={c} color={c} className={styles.swatchItem}>
                          <RACColorSwatch className={styles.swatch} />
                        </ColorSwatchPickerItem>
                      ))}
                    </ColorSwatchPicker>
                  ) : null}
                </Dialog>
              </PopoverSurface>
            </DialogTrigger>
            <Input ref={ref} className={styles.input} />
          </Group>
        </FieldParts>
      </ColorField>
    </RACColorPicker>
  );
});