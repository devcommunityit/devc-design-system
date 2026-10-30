import { forwardRef, type ReactNode } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { useMessages } from '../../i18n/LocaleProvider';
import { useControllableState } from '../../utils';
import { Button } from '../Button/Button';
import { Textarea, type TextareaProps } from '../TextField/TextField';
import styles from './PromptComposer.module.css';

export interface PromptComposerProps extends Omit<TextareaProps, 'children'> {
  /** Receives the trimmed prompt. Network calls and resetting the value belong to the consumer. */
  onSend: (prompt: string) => void;
  isGenerating?: boolean;
  /** When provided, generation shows a stop action instead of a disabled send button. */
  onStop?: () => void;
  footer?: ReactNode;
}

/** Multiline prompt field with explicit send, IME-safe Enter and Shift+Enter for a newline. */
export const PromptComposer = forwardRef<HTMLTextAreaElement, PromptComposerProps>(function PromptComposer(
  { value: valueProp, defaultValue = '', onChange, onSend, onStop, isGenerating = false, isDisabled, isReadOnly, isInvalid, minLength, maxLength, label, placeholder, rows = 3, textareaProps, footer, ...rest },
  ref,
) {
  const t = useMessages();
  const [value, setValue] = useControllableState(valueProp, defaultValue, onChange);
  const prompt = value.trim();
  const canSend = !isDisabled && !isReadOnly && !isInvalid && !isGenerating && prompt.length > 0
    && (minLength === undefined || prompt.length >= minLength) && (maxLength === undefined || prompt.length <= maxLength);
  const send = () => {
    if (canSend) onSend(prompt);
  };
  return (
    <div className={styles.composer} data-generating={isGenerating || undefined}>
      <Textarea
        {...rest}
        ref={ref}
        value={value}
        onChange={setValue}
        label={label ?? t.aiPrompt}
        placeholder={placeholder ?? t.aiPrompt}
        rows={rows}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid}
        minLength={minLength}
        maxLength={maxLength}
        textareaProps={{
          ...textareaProps,
          onKeyDown: (event) => {
            textareaProps?.onKeyDown?.(event);
            if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229) return;
            if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
              event.preventDefault();
              send();
            }
          },
        }}
      />
      <div className={styles.actions}>
        <div className={styles.context}>{footer}</div>
        {isGenerating && onStop ? (
          <Button variant="secondary" startIcon={<Square />} isDisabled={isDisabled} onPress={onStop}>{t.aiStop}</Button>
        ) : (
          <Button startIcon={<ArrowUp />} isDisabled={!canSend} onPress={send}>{t.aiSend}</Button>
        )}
      </div>
    </div>
  );
});
