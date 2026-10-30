import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import styles from './PromptSuggestions.module.css';

export interface PromptSuggestion {
  id: string;
  label: string;
  prompt: string;
  icon?: ReactNode;
}

export interface PromptSuggestionsProps extends HTMLAttributes<HTMLDivElement> {
  items: readonly PromptSuggestion[];
  onAction: (item: PromptSuggestion) => void;
  isDisabled?: boolean;
}

export const PromptSuggestions = forwardRef<HTMLDivElement, PromptSuggestionsProps>(function PromptSuggestions(
  { items, onAction, isDisabled, className, ...rest },
  ref,
) {
  const t = useMessages();
  return (
    <div ref={ref} role="group" aria-label={t.aiSuggestions} {...rest} className={cx(styles.suggestions, className)}>
      {items.map((item) => (
        <Button key={item.id} variant="outline" startIcon={item.icon} isDisabled={isDisabled} onPress={() => onAction(item)}>
          {item.label}
        </Button>
      ))}
    </div>
  );
});
