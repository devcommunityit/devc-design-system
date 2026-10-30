import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Button as RACButton,
  Label,
  Tag as RACTag,
  TagGroup as RACTagGroup,
  TagList,
  Text,
  composeRenderProps,
  type TagGroupProps as RACTagGroupProps,
  type TagListProps,
  type TagProps as RACTagProps,
} from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import fieldStyles from '../Field/Field.module.css';
import styles from './Tag.module.css';

export interface TagGroupProps<T extends object> extends Omit<RACTagGroupProps, 'children'> {
  /** Visible label; otherwise pass `aria-label`. */
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  /** Tags as data, rendered by the `children` function. */
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
  /** Shown when there are no tags. */
  renderEmptyState?: TagListProps<T>['renderEmptyState'];
  /** @default 'md' */
  size?: 'sm' | 'md';
}

/**
 * Group of chips/tags with keyboard navigation (grid pattern), optional selection
 * (`selectionMode`, filter chips) and removal (`onRemove`: adds a remove button and Backspace/Delete).
 */
export function TagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  renderEmptyState,
  size = 'md',
  className,
  ...rest
}: TagGroupProps<T>) {
  return (
    <RACTagGroup {...rest} className={cx(styles.group, className)} data-size={size}>
      {label ? <Label className={fieldStyles.label}>{label}</Label> : null}
      <TagList items={items} renderEmptyState={renderEmptyState} className={styles.list}>
        {children}
      </TagList>
      {description ? (
        <Text slot="description" className={fieldStyles.description}>
          {description}
        </Text>
      ) : null}
      {errorMessage ? (
        <Text slot="errorMessage" className={fieldStyles.error}>
          {errorMessage}
        </Text>
      ) : null}
    </RACTagGroup>
  );
}

export interface TagProps extends RACTagProps {
  /** Decorative leading icon or avatar. */
  icon?: ReactNode;
}

/** A chip inside TagGroup. Pass `textValue` when children are not plain text. */
export function Tag({ icon, children, className, textValue, ...rest }: TagProps) {
  const t = useMessages();
  const text = textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <RACTag {...rest} textValue={text} className={composeRenderProps(className, (cn) => cx(styles.tag, cn))}>
      {composeRenderProps(children, (content, { allowsRemoving }) => (
        <>
          {icon ? (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className={styles.label}>{content}</span>
          {allowsRemoving ? (
            <RACButton slot="remove" className={styles.remove} aria-label={text ? t.remove(text) : undefined}>
              <X aria-hidden="true" />
            </RACButton>
          ) : null}
        </>
      ))}
    </RACTag>
  );
}