import { Search, X } from 'lucide-react';
import { forwardRef } from 'react';
import { Button as RACButton, Group, SearchField, composeRenderProps, type SearchFieldProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { FieldParts, type FieldBaseProps } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { Input, type InputProps } from '../TextField/TextField';
import { Spinner } from '../Spinner/Spinner';
import styles from './SearchInput.module.css';

export interface SearchInputProps extends Omit<SearchFieldProps, 'children'>, FieldBaseProps {
  placeholder?: string;
  /** Shows a spinner while the consumer is fetching results. */
  isPending?: boolean;
  inputProps?: Omit<InputProps, 'ref'>;
}

/**
 * Search field (`type="search"`) with clear button. Enter calls `onSubmit`, Escape clears.
 * Without a visible `label` pass `aria-label`. Searching/debouncing is up to the consumer.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { label, description, errorMessage, necessityIndicator, placeholder, isPending, inputProps, className, isRequired, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <SearchField {...rest} isRequired={isRequired} className={composeRenderProps(className, (cn) => cx(fieldStyles.field, styles.search, cn))}>
      <FieldParts label={label} description={description} errorMessage={errorMessage} isRequired={isRequired} necessityIndicator={necessityIndicator}>
        <Group className={fieldStyles.control}>
          <span className={fieldStyles.adornment} aria-hidden="true">
            <Search />
          </span>
          <Input ref={ref} placeholder={placeholder} className={styles.input} {...inputProps} />
          {isPending ? <Spinner size="sm" label={t.loading} className={styles.spinner} /> : null}
          <RACButton className={cx(fieldStyles.inlineButton, styles.clear)} aria-label={t.clear}>
            <X aria-hidden="true" />
          </RACButton>
        </Group>
      </FieldParts>
    </SearchField>
  );
});