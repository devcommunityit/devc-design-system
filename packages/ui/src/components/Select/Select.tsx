import { ChevronDown } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import {
  Button as RACButton,
  Select as RACSelect,
  SelectValue,
  composeRenderProps,
  type SelectProps as RACSelectProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { ListBox } from '../ListBox/ListBox';
import { PopoverSurface, type PopoverSurfaceProps } from '../Popover/Popover';
import styles from './Select.module.css';

export interface SelectProps<T extends object> extends Omit<RACSelectProps<T, 'single'>, 'children' | 'selectionMode'>, FieldBaseProps {
  /** Options as data, rendered by the `children` function. */
  items?: Iterable<T>;
  /** `<ListBoxItem>`/`<ListBoxSection>` elements, or a render function for `items`. */
  children: ReactNode | ((item: T) => ReactNode);
  /** Decorative element before the value. */
  startAdornment?: ReactNode;
  /** Content shown when the list is empty. */
  emptyState?: ReactNode;
  /** Ref to the trigger button (e.g. to focus it programmatically). */
  triggerRef?: Ref<HTMLButtonElement>;
  popoverProps?: Omit<PopoverSurfaceProps, 'children'>;
}

/**
 * Single-choice dropdown with custom option rendering (WAI-ARIA listbox popup).
 * `value`/`defaultValue` are option keys (`Key | null`). For a native picker use NativeSelect;
 * with many options use Combobox.
 */
export function Select<T extends object>({
  label,
  description,
  errorMessage,
  necessityIndicator,
  items,
  children,
  startAdornment,
  emptyState,
  triggerRef,
  popoverProps,
  className,
  isRequired,
  ...rest
}: SelectProps<T>) {
  return (
    <RACSelect {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.select, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <RACButton ref={triggerRef} className={cx(fieldStyles.control, styles.trigger)}>
          {startAdornment ? (
            <span className={fieldStyles.adornment} aria-hidden="true">
              {startAdornment}
            </span>
          ) : null}
          {/* Show the item's text value only: option layouts (check mark, icon, description) don't fit the trigger. */}
          <SelectValue className={styles.value}>{({ isPlaceholder, selectedText, defaultChildren }) => (isPlaceholder ? defaultChildren : selectedText)}</SelectValue>
          <ChevronDown aria-hidden="true" className={styles.chevron} />
        </RACButton>
      </FieldParts>
      <PopoverSurface {...popoverProps} className={composeRenderProps(popoverProps?.className, (cn) => cx(styles.popover, cn))}>
        <ListBox items={items} variant="plain" renderEmptyState={emptyState ? () => emptyState : undefined}>
          {children}
        </ListBox>
      </PopoverSurface>
    </RACSelect>
  );
}