import { ChevronDown } from 'lucide-react';
import { useState, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import {
  Button as RACButton,
  ComboBox as RACComboBox,
  Group,
  useFilter,
  type ComboBoxProps as RACComboBoxProps,
  type Key,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { ListBox, ListBoxItem } from '../ListBox/ListBox';
import listStyles from '../ListBox/ListBox.module.css';
import { PopoverSurface } from '../Popover/Popover';
import selectStyles from '../Select/Select.module.css';
import { Spinner } from '../Spinner/Spinner';
import { Tag, TagGroup } from '../Tag/Tag';
import { Input } from '../TextField/TextField';
import styles from './MultiSelect.module.css';

export interface MultiSelectOption {
  id: Key;
  label: string;
  description?: string;
  isDisabled?: boolean;
}

type InheritedComboBoxProps = Pick<
  RACComboBoxProps<MultiSelectOption, 'multiple'>,
  | 'id'
  | 'name'
  | 'form'
  | 'isDisabled'
  | 'isReadOnly'
  | 'isInvalid'
  | 'isRequired'
  | 'validate'
  | 'validationBehavior'
  | 'autoFocus'
  | 'menuTrigger'
  | 'onOpenChange'
  | 'onFocus'
  | 'onBlur'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
>;

export interface MultiSelectProps extends InheritedComboBoxProps, FieldBaseProps {
  /** Available options. With `filter="none"` pass the results already filtered by the consumer. */
  options: MultiSelectOption[];
  value?: Key[];
  defaultValue?: Key[];
  onChange?: (value: Key[]) => void;
  /** Search text (controlled). Cleared after each selection. */
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
  /** `local`: filter `options` by label (locale-aware "contains"); `none`: the consumer filters (async). @default 'local' */
  filter?: 'local' | 'none';
  /** The consumer is loading options. */
  isLoading?: boolean;
  /** Content shown when no option matches. */
  emptyState?: ReactNode;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
  style?: CSSProperties;
}

/**
 * Multiple selection with search: selected values are shown as removable chips (TagGroup),
 * shown below the input; the list stays open while picking. Backspace in the empty input removes the last chip.
 * Labels of selected keys missing from the current `options` (async results) are remembered
 * from when they were selected; keys never seen in `options` are shown as `String(key)`.
 */
export function MultiSelect({
  label,
  description,
  errorMessage,
  necessityIndicator,
  options,
  value,
  defaultValue,
  onChange,
  inputValue,
  defaultInputValue,
  onInputChange,
  filter = 'local',
  isLoading = false,
  emptyState,
  placeholder,
  inputRef,
  className,
  style,
  isRequired,
  isDisabled,
  isReadOnly,
  ...rest
}: MultiSelectProps) {
  const t = useMessages();
  const { contains } = useFilter({ sensitivity: 'base' });
  const [selected, setSelected] = useControllableState<Key[]>(value, defaultValue ?? [], onChange);
  const [query, setQuery] = useControllableState(inputValue, defaultInputValue ?? '', onInputChange, 'inputValue');
  const [knownLabels, setKnownLabels] = useState<ReadonlyMap<Key, string>>(() => new Map());

  const labelOf = (key: Key) => options.find((o) => o.id === key)?.label ?? knownLabels.get(key) ?? String(key);
  const items = filter === 'local' ? options.filter((o) => contains(o.label, query)) : options;

  const update = (keys: Key[]) => {
    const added = keys.filter((k) => !selected.includes(k));
    if (added.length > 0) {
      setKnownLabels((prev) => {
        const next = new Map(prev);
        for (const k of added) next.set(k, labelOf(k));
        return next;
      });
    }
    setSelected(keys);
  };

  const remove = (keys: Set<Key>) => update(selected.filter((k) => !keys.has(k)));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && query === '' && selected.length > 0 && !isReadOnly && !isDisabled) {
      update(selected.slice(0, -1));
    }
  };

  const chips = selected.map((id) => ({ id, label: labelOf(id) }));

  // Chips live outside the ComboBox: its collection builder would otherwise collect the tags as options.
  return (
    <div
      className={cx(fieldStyles.field, styles.root, className)}
      style={style}
      data-disabled={isDisabled || undefined}
    >
      <RACComboBox<MultiSelectOption, 'multiple'>
        {...rest}
        selectionMode="multiple"
        items={items}
        value={selected}
        onChange={(keys) => {
          update([...keys]);
          setQuery('');
        }}
        inputValue={query}
        onInputChange={setQuery}
        allowsEmptyCollection
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        className={cx(fieldStyles.field, selectStyles.select)}
      >
        <FieldParts
          label={label}
          description={description}
          errorMessage={errorMessage}
          isRequired={isRequired}
          necessityIndicator={necessityIndicator}
        >
          <Group className={fieldStyles.control}>
            <Input ref={inputRef} placeholder={placeholder} onKeyDown={onKeyDown} />
            {isLoading ? <Spinner size="sm" label={t.loading} /> : null}
            <RACButton className={fieldStyles.inlineButton}>
              <ChevronDown aria-hidden="true" className={selectStyles.chevron} />
            </RACButton>
          </Group>
        </FieldParts>
        <PopoverSurface className={selectStyles.popover}>
          <ListBox<MultiSelectOption>
            variant="plain"
            aria-busy={isLoading || undefined}
            renderEmptyState={() => (
              <div className={listStyles.empty}>{isLoading ? t.loading : (emptyState ?? t.noResults)}</div>
            )}
          >
            {(o) => (
              <ListBoxItem id={o.id} description={o.description} isDisabled={o.isDisabled} textValue={o.label}>
                {o.label}
              </ListBoxItem>
            )}
          </ListBox>
        </PopoverSurface>
      </RACComboBox>
      {chips.length > 0 ? (
        <TagGroup
          aria-label={t.selectedItems}
          items={chips}
          size="sm"
          onRemove={isReadOnly || isDisabled ? undefined : remove}
        >
          {(chip) => <Tag id={chip.id}>{chip.label}</Tag>}
        </TagGroup>
      ) : null}
    </div>
  );
}
