import { ChevronDown } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import {
  Button as RACButton,
  ComboBox as RACComboBox,
  Group,
  composeRenderProps,
  type ComboBoxProps as RACComboBoxProps,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { ListBox } from '../ListBox/ListBox';
import listStyles from '../ListBox/ListBox.module.css';
import { PopoverSurface, type PopoverSurfaceProps } from '../Popover/Popover';
import selectStyles from '../Select/Select.module.css';
import { Spinner } from '../Spinner/Spinner';
import { Input, type InputProps } from '../TextField/TextField';

export interface ComboboxProps<T extends object> extends Omit<RACComboBoxProps<T, 'single'>, 'children' | 'selectionMode'>, FieldBaseProps {
  /** `<ListBoxItem>` elements or a render function for `items`/`defaultItems`. */
  children: ReactNode | ((item: T) => ReactNode);
  placeholder?: string;
  /** Decorative element before the input. */
  startAdornment?: ReactNode;
  /** The consumer is loading results (async search). Shows a spinner and a loading message. */
  isLoading?: boolean;
  /** Content shown when nothing matches. Defaults to the localized "No results". */
  emptyState?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  inputProps?: Omit<InputProps, 'ref'>;
  popoverProps?: Omit<PopoverSurfaceProps, 'children'>;
}

/**
 * Text input with a filtered listbox popup (WAI-ARIA combobox). Uncontrolled `defaultItems`
 * are filtered locally; with controlled `items` the consumer filters (e.g. async results via
 * `onInputChange`). No network logic is built in.
 */
export function Combobox<T extends object>({
  label,
  description,
  errorMessage,
  necessityIndicator,
  children,
  placeholder,
  startAdornment,
  isLoading = false,
  emptyState,
  inputRef,
  inputProps,
  popoverProps,
  className,
  isRequired,
  allowsEmptyCollection = true,
  ...rest
}: ComboboxProps<T>) {
  const t = useMessages();
  return (
    <RACComboBox
      {...rest}
      isRequired={isRequired}
      allowsEmptyCollection={allowsEmptyCollection}
      className={composeRenderProps(className, (cn) => cx(fieldStyles.field, selectStyles.select, cn))}
      data-loading={isLoading || undefined}
    >
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group className={fieldStyles.control}>
          {startAdornment ? (
            <span className={fieldStyles.adornment} aria-hidden="true">
              {startAdornment}
            </span>
          ) : null}
          <Input ref={inputRef} placeholder={placeholder} {...inputProps} />
          {isLoading ? <Spinner size="sm" label={t.loading} /> : null}
          <RACButton className={fieldStyles.inlineButton}>
            <ChevronDown aria-hidden="true" className={selectStyles.chevron} />
          </RACButton>
        </Group>
      </FieldParts>
      <PopoverSurface {...popoverProps} className={composeRenderProps(popoverProps?.className, (cn) => cx(selectStyles.popover, cn))}>
        <ListBox<T>
          variant="plain"
          aria-busy={isLoading || undefined}
          renderEmptyState={() => <div className={listStyles.empty}>{isLoading ? t.loading : (emptyState ?? t.noResults)}</div>}
        >
          {children}
        </ListBox>
      </PopoverSurface>
    </RACComboBox>
  );
}