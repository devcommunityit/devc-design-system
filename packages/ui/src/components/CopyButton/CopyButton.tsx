import { Check, Copy, X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { composeRenderProps } from 'react-aria-components';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button, type ButtonProps } from '../Button/Button';
import iconButtonStyles from '../IconButton/IconButton.module.css';
import styles from './CopyButton.module.css';

export type CopyStatus = 'idle' | 'copied' | 'error';

export interface UseCopyToClipboardOptions {
  /** Milliseconds before the status returns to `idle`. @default 2000 */
  resetAfter?: number;
  /** Called after a successful copy. */
  onCopy?: (text: string) => void;
  /** Called when the Clipboard API is unavailable or the write is rejected. */
  onCopyError?: (error: unknown) => void;
}

/**
 * Writes text with the asynchronous Clipboard API and exposes a transient status.
 * Never throws: an unavailable API or a denied permission sets the status to `error`.
 */
export function useCopyToClipboard({ resetAfter = 2000, onCopy, onCopyError }: UseCopyToClipboardOptions = {}) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let next: CopyStatus;
      try {
        if (typeof navigator === 'undefined' || !navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(text);
        next = 'copied';
        onCopy?.(text);
      } catch (error) {
        next = 'error';
        onCopyError?.(error);
      }
      setStatus(next);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus('idle'), resetAfter);
      return next === 'copied';
    },
    [resetAfter, onCopy, onCopyError],
  );

  return { status, copy };
}

export interface CopyButtonProps
  extends Omit<ButtonProps, 'children' | 'onPress' | 'startIcon' | 'endIcon' | 'isPending' | 'value'>,
    UseCopyToClipboardOptions {
  /** Text to copy, or a function that returns it at press time. */
  value: string | (() => string);
  /** Visible label (accessible name when `iconOnly`). @default localized "Copy" */
  children?: string;
  /** Show only the icon. @default false */
  iconOnly?: boolean;
  /** @default 'outline' */
  variant?: ButtonProps['variant'];
}

/**
 * Button that copies a value to the clipboard. The outcome ("Copied" / "Copy failed") is shown with
 * icon and text and announced through a polite live region; it returns to idle after `resetAfter` ms.
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { value, children, iconOnly = false, variant = 'outline', resetAfter, onCopy, onCopyError, className, ...rest },
  ref,
) {
  const t = useMessages();
  const { status, copy } = useCopyToClipboard({ resetAfter, onCopy, onCopyError });
  const idleLabel = children ?? t.copy;
  const feedback = status === 'copied' ? t.copied : status === 'error' ? t.copyFailed : '';
  const icon = status === 'copied' ? <Check /> : status === 'error' ? <X /> : <Copy />;
  return (
    <>
      <Button
        ref={ref}
        variant={variant}
        data-status={status}
        aria-label={iconOnly ? idleLabel : undefined}
        startIcon={icon}
        className={composeRenderProps(className, (cn) => cx(styles.copyButton, iconOnly && iconButtonStyles.iconButton, cn))}
        onPress={() => void copy(typeof value === 'function' ? value() : value)}
        {...rest}
      >
        {iconOnly ? undefined : feedback || idleLabel}
      </Button>
      <span className={styles.srOnly} role="status">
        {feedback}
      </span>
    </>
  );
});
