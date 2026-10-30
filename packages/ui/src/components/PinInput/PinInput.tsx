import {
  forwardRef,
  useRef,
  type ClipboardEvent,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useField } from 'react-aria';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import fieldStyles from '../Field/Field.module.css';
import type { NecessityIndicator } from '../Field/Field';
import styles from './PinInput.module.css';

export interface PinInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Number of characters. @default 6 */
  length?: number;
  /** Controlled value (contiguous characters, at most `length`). */
  value?: string;
  /** Initial value (uncontrolled). @default '' */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once every position is filled. */
  onComplete?: (value: string) => void;
  /** Accepted characters. @default 'numeric' */
  type?: 'numeric' | 'alphanumeric';
  /** Hide the characters like a password. @default false */
  mask?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  /** Shown while `isInvalid` is true. */
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  /** @default 'icon' */
  necessityIndicator?: NecessityIndicator;
  /** Name of a hidden input carrying the value in native form submissions. */
  name?: string;
  /** Focus the first empty position on mount. @default false */
  autoFocus?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

const PATTERNS = { numeric: /[0-9]/, alphanumeric: /[a-zA-Z0-9]/ } as const;

/**
 * Verification code split into one input per character (OTP, PIN). The value is always contiguous:
 * typing advances, Backspace goes back, pasting or one-time-code autofill fills every position.
 * The first input declares `autocomplete="one-time-code"`. Codes are laid out left-to-right in every locale.
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    length = 6,
    value: valueProp,
    defaultValue = '',
    onChange,
    onComplete,
    type = 'numeric',
    mask = false,
    label,
    description,
    errorMessage,
    isInvalid,
    isDisabled,
    isRequired,
    necessityIndicator = 'icon',
    name,
    autoFocus,
    size = 'md',
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const [value, setValue] = useControllableState(valueProp, defaultValue, onChange);
  // Latest committed value: focus handlers run before React re-renders with the new value.
  const valueRef = useRef(value);
  valueRef.current = value;
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const showError = Boolean(isInvalid && errorMessage);
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = useField({
    label,
    description,
    errorMessage: showError ? errorMessage : undefined,
    isInvalid,
    labelElementType: 'span',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  });
  const pattern = PATTERNS[type];
  const sanitize = (text: string) => [...text].filter((c) => pattern.test(c)).join('');

  const focusAt = (index: number) => {
    const target = inputs.current[Math.max(0, Math.min(index, length - 1))];
    target?.focus();
    target?.select();
  };

  const commit = (next: string, focusIndex: number) => {
    const clipped = next.slice(0, length);
    if (clipped !== value) {
      valueRef.current = clipped;
      setValue(clipped);
      if (clipped.length === length) onComplete?.(clipped);
    }
    focusAt(focusIndex);
  };

  const insert = (index: number, text: string) => {
    const chars = sanitize(text);
    if (!chars) return;
    const start = Math.min(index, value.length);
    const next = value.slice(0, start) + chars + value.slice(start + chars.length);
    commit(next, start + chars.length);
  };

  const onInputChange = (index: number, raw: string) => {
    const previous = value[index] ?? '';
    if (raw === '') {
      commit(value.slice(0, index) + value.slice(index + 1), index);
      return;
    }
    // Typing next to an existing character yields two characters: keep the new one.
    const typed = previous && raw.length === 2 && raw.includes(previous) ? raw.replace(previous, '') : raw;
    insert(index, typed);
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Backspace':
        if (!value[index] && index > 0) {
          event.preventDefault();
          commit(value.slice(0, index - 1) + value.slice(index), index - 1);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusAt(index - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        focusAt(Math.min(index + 1, value.length));
        break;
      case 'Home':
        event.preventDefault();
        focusAt(0);
        break;
      case 'End':
        event.preventDefault();
        focusAt(value.length);
        break;
      default:
        break;
    }
  };

  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    insert(index, event.clipboardData.getData('text'));
  };

  const onFocus = (index: number, event: FocusEvent<HTMLInputElement>) => {
    // Keep the value contiguous: positions after the first empty one are not reachable.
    const firstEmpty = Math.min(valueRef.current.length, length - 1);
    if (index > firstEmpty) focusAt(firstEmpty);
    else event.target.select();
  };

  const describedBy = fieldProps['aria-describedby'];
  return (
    <div
      ref={ref}
      className={cx(fieldStyles.field, styles.pinInput, className)}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-size={size}
      {...rest}
    >
      {label ? (
        <span {...labelProps} className={fieldStyles.label}>
          {label}
          {isRequired && necessityIndicator !== 'none' ? (
            necessityIndicator === 'label' ? (
              <span className={fieldStyles.necessity}> ({t.required})</span>
            ) : (
              <span className={fieldStyles.required}>
                <span aria-hidden="true"> *</span>
                <span className={fieldStyles.srOnly}> ({t.required})</span>
              </span>
            )
          ) : null}
        </span>
      ) : null}
      <div
        role="group"
        id={fieldProps.id}
        aria-labelledby={fieldProps['aria-labelledby']}
        aria-label={fieldProps['aria-label']}
        aria-describedby={describedBy}
        className={styles.cells}
        dir="ltr"
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            className={styles.cell}
            type={mask ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- opt-in, used on dedicated verification screens
            autoFocus={autoFocus && index === Math.min(value.length, length - 1)}
            value={value[index] ?? ''}
            disabled={isDisabled}
            aria-label={t.pinDigit(index + 1, length)}
            aria-describedby={describedBy}
            aria-invalid={isInvalid || undefined}
            aria-required={isRequired || undefined}
            onChange={(event) => onInputChange(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            onPaste={(event) => onPaste(index, event)}
            onFocus={(event) => onFocus(index, event)}
          />
        ))}
      </div>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      {description ? (
        <div {...descriptionProps} className={fieldStyles.description}>
          {description}
        </div>
      ) : null}
      {showError ? (
        <div {...errorMessageProps} className={fieldStyles.error}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
});
