import {
  forwardRef, useId, useImperativeHandle, useRef, useState, type ChangeEvent, type DOMAttributes, type ForwardedRef,
  type InputHTMLAttributes, type KeyboardEvent, type TextareaHTMLAttributes,
} from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { useControllableState } from '../../utils';
import styles from './MentionInput.module.css';

export interface MentionSuggestion {
  id: string;
  label: string;
  handle: string;
}

export interface MentionFieldProps {
  label: string;
  suggestions: readonly MentionSuggestion[];
  /** Optional suggestions for #hashtags. Omit to disable hashtag completion. */
  hashtagSuggestions?: readonly MentionSuggestion[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onMentionSelect?: (suggestion: MentionSuggestion) => void;
  onHashtagSelect?: (suggestion: MentionSuggestion) => void;
  emptySuggestionsMessage?: string;
  emptyHashtagSuggestionsMessage?: string;
}

export interface MentionInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue' | 'value'>, MentionFieldProps {}
export interface MentionTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'defaultValue' | 'value'>, MentionFieldProps {}

type FieldElement = HTMLInputElement | HTMLTextAreaElement;
type FieldEvents<T extends FieldElement> = Pick<DOMAttributes<T>, 'onKeyDown' | 'onSelect' | 'onFocus' | 'onBlur'>;
type Token = { start: number; end: number; trigger: '@' | '#'; query: string };

function findToken(text: string, start: number, end: number, allowHashtags: boolean): Token | null {
  if (start !== end) return null;
  const match = /(^|\s)([@#])([\p{L}\p{N}_.-]*)$/u.exec(text.slice(0, start));
  if (!match || (match[2] === '#' && !allowHashtags)) return null;
  const suffix = /^[\p{L}\p{N}_.-]*/u.exec(text.slice(end))?.[0] ?? '';
  return {
    start: start - match[0].length + match[1]!.length,
    end: end + suffix.length,
    trigger: match[2] === '#' ? '#' : '@',
    query: match[3]!,
  };
}

function useMentionField<T extends FieldElement>(
  {
    suggestions, hashtagSuggestions, value, defaultValue = '', onChange, onMentionSelect, onHashtagSelect,
    emptySuggestionsMessage, emptyHashtagSuggestionsMessage, id: suppliedId, onKeyDown, onSelect, onFocus, onBlur,
  }: MentionFieldProps & FieldEvents<T> & { id?: string },
  forwardedRef: ForwardedRef<T>,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const listId = `${id}-suggestions`;
  const inputRef = useRef<T>(null);
  useImperativeHandle(forwardedRef, () => {
    if (!inputRef.current) throw new Error('MentionInput: input ref is not available.');
    return inputRef.current;
  }, []);
  const [text, setText] = useControllableState(value, defaultValue, onChange, 'value');
  const [selection, setSelection] = useState({ start: text.length, end: text.length });
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [focused, setFocused] = useState(false);
  const { locale } = useLocale();
  const t = useMessages().components;

  const token = findToken(text, selection.start, selection.end, hashtagSuggestions !== undefined);
  const getOptions = (current: Token | null) => {
    if (!current) return [];
    const candidates = current.trigger === '@' ? suggestions : hashtagSuggestions ?? [];
    const query = current.query.toLocaleLowerCase(locale);
    return candidates.filter((item) => `${item.label} ${item.handle}`.toLocaleLowerCase(locale).includes(query));
  };
  const options = getOptions(token);
  const selectedIndex = Math.min(activeIndex, Math.max(0, options.length - 1));
  const isOpen = focused && !dismissed && token !== null && options.length > 0;
  const currentToken = () => {
    const input = inputRef.current;
    if (!input) return null;
    return findToken(input.value, input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length, hashtagSuggestions !== undefined);
  };
  const updateSelection = (input: T) => {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    if (start !== selection.start || end !== selection.end) {
      setSelection({ start, end });
      setActiveIndex(0);
      setDismissed(false);
    }
  };
  const insert = (suggestion: MentionSuggestion) => {
    const input = inputRef.current;
    const current = currentToken();
    if (!input || !current || !getOptions(current).some((item) => item.id === suggestion.id)) return;
    const tail = input.value.slice(current.end);
    const insertion = `${current.trigger}${suggestion.handle}${tail.startsWith(' ') ? '' : ' '}`;
    const next = `${input.value.slice(0, current.start)}${insertion}${tail}`;
    const cursor = current.start + insertion.length + (tail.startsWith(' ') ? 1 : 0);
    setText(next);
    setSelection({ start: cursor, end: cursor });
    setActiveIndex(0);
    setDismissed(false);
    if (current.trigger === '@') onMentionSelect?.(suggestion);
    else onHashtagSelect?.(suggestion);
    requestAnimationFrame(() => {
      if (!input.isConnected) return;
      input.focus();
      input.setSelectionRange(cursor, cursor);
    });
  };
  const handleKeyDown = (event: KeyboardEvent<T>) => {
    const available = getOptions(currentToken());
    const canChoose = !dismissed && available.length > 0;
    if (canChoose && event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % available.length);
    } else if (canChoose && event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + available.length) % available.length);
    } else if (canChoose && event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const selected = available[Math.min(activeIndex, available.length - 1)];
      if (selected) insert(selected);
    } else if (canChoose && event.key === 'Escape') {
      event.preventDefault();
      setDismissed(true);
    }
    onKeyDown?.(event);
  };
  const fieldProps = {
    id,
    ref: inputRef,
    value: text,
    role: 'combobox' as const,
    'aria-autocomplete': 'list' as const,
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? listId : undefined,
    'aria-activedescendant': isOpen ? `${listId}-${selectedIndex}` : undefined,
    onChange: (event: ChangeEvent<T>) => {
      setText(event.currentTarget.value);
      setSelection({
        start: event.currentTarget.selectionStart ?? event.currentTarget.value.length,
        end: event.currentTarget.selectionEnd ?? event.currentTarget.value.length,
      });
      setDismissed(false);
      setActiveIndex(0);
    },
    onKeyDown: handleKeyDown,
    onSelect: (event: React.SyntheticEvent<T>) => {
      updateSelection(event.currentTarget);
      onSelect?.(event);
    },
    onFocus: (event: React.FocusEvent<T>) => {
      setFocused(true);
      setDismissed(false);
      updateSelection(event.currentTarget);
      onFocus?.(event);
    },
    onBlur: (event: React.FocusEvent<T>) => {
      setFocused(false);
      setDismissed(true);
      onBlur?.(event);
    },
  };
  const popup = isOpen ? (
    <ul className={styles.listbox} id={listId} role="listbox" aria-label={token?.trigger === '#' ? t.hashtagSuggestions : t.mentionSuggestions}>
      {options.map((suggestion, index) => (
        // Keyboard selection stays on the input via aria-activedescendant.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
          key={suggestion.id}
          id={`${listId}-${index}`}
          role="option"
          aria-selected={index === selectedIndex}
          className={styles.option}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => insert(suggestion)}
        >
          <span>{suggestion.label}</span>
          <span className={styles.handle}>{token?.trigger}{suggestion.handle}</span>
        </li>
      ))}
    </ul>
  ) : focused && token !== null && !dismissed && options.length === 0 ? (
    <div className={styles.empty} role="status">
      {token.trigger === '#' ? (emptyHashtagSuggestionsMessage ?? t.hashtagEmpty) : (emptySuggestionsMessage ?? t.mentionEmpty)}
    </div>
  ) : null;
  return { id, fieldProps, popup };
}

/** Single-line input with local @mention and optional #hashtag suggestions. */
export const MentionInput = forwardRef<HTMLInputElement, MentionInputProps>(function MentionInput(
  {
    label, suggestions, hashtagSuggestions, value, defaultValue, onChange, onMentionSelect, onHashtagSelect,
    emptySuggestionsMessage, emptyHashtagSuggestionsMessage, id, className, onKeyDown, onSelect, onFocus, onBlur, ...rest
  },
  ref,
) {
  const field = useMentionField<HTMLInputElement>({
    label, suggestions, hashtagSuggestions, value, defaultValue, onChange, onMentionSelect, onHashtagSelect,
    emptySuggestionsMessage, emptyHashtagSuggestionsMessage, id, onKeyDown, onSelect, onFocus, onBlur,
  }, ref);
  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={field.id}>{label}</label>
      <input {...rest} type="text" className={[styles.input, className].filter(Boolean).join(' ')} {...field.fieldProps} />
      {field.popup}
    </div>
  );
});

/** Multiline counterpart of MentionInput, with the same suggestion and selection behavior. */
export const MentionTextarea = forwardRef<HTMLTextAreaElement, MentionTextareaProps>(function MentionTextarea(
  {
    label, suggestions, hashtagSuggestions, value, defaultValue, onChange, onMentionSelect, onHashtagSelect,
    emptySuggestionsMessage, emptyHashtagSuggestionsMessage, id, className, onKeyDown, onSelect, onFocus, onBlur, ...rest
  },
  ref,
) {
  const field = useMentionField<HTMLTextAreaElement>({
    label, suggestions, hashtagSuggestions, value, defaultValue, onChange, onMentionSelect, onHashtagSelect,
    emptySuggestionsMessage, emptyHashtagSuggestionsMessage, id, onKeyDown, onSelect, onFocus, onBlur,
  }, ref);
  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={field.id}>{label}</label>
      <textarea
        {...rest}
        className={[styles.input, styles.textarea, className].filter(Boolean).join(' ')}
        {...field.fieldProps}
        role={undefined}
        aria-expanded={undefined}
        aria-haspopup={undefined}
      />
      {field.popup}
    </div>
  );
});
