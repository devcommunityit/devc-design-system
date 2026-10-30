import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { Button } from '../Button/Button';
import { OverlayPanel, type DialogProps } from '../Dialog/Dialog';

export interface AlertDialogProps extends Omit<DialogProps, 'footer' | 'size' | 'hideCloseButton' | 'children' | 'role'> {
  /** Message explaining the consequence of the action. */
  children: ReactNode;
  /** `danger` styles the title and confirm button for destructive actions. @default 'default' */
  tone?: 'default' | 'danger';
  /** @default localized "Confirm" */
  confirmLabel?: string;
  /** @default localized "Cancel" */
  cancelLabel?: string;
  /**
   * Called on confirm. If it returns a promise the button shows a pending state and the dialog
   * closes when it resolves; if it rejects the dialog stays open (show the error in your UI).
   */
  onConfirm: () => void | Promise<void>;
  /** Called when the dialog is closed without confirming (Cancel button or Escape). */
  onCancel?: () => void;
  isConfirmDisabled?: boolean;
}

/**
 * Interrupting confirmation (role="alertdialog"). Not closed by clicking outside; Escape cancels.
 * Initial focus goes to the least destructive action (Cancel).
 */
export const AlertDialog = forwardRef<HTMLElement, AlertDialogProps>(function AlertDialog(
  { children, tone = 'default', confirmLabel, cancelLabel, onConfirm, onCancel, isConfirmDisabled, onOpenChange, isKeyboardDismissDisabled, ...rest },
  ref,
) {
  const messages = useMessages();
  const [pending, setPending] = useState(false);
  const confirmed = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <OverlayPanel
      ref={ref}
      kind="alert"
      tone={tone}
      size="sm"
      isKeyboardDismissDisabled={isKeyboardDismissDisabled || pending}
      onOpenChange={(open) => {
        if (!open && !confirmed.current) onCancel?.();
        if (open) confirmed.current = false;
        onOpenChange?.(open);
      }}
      {...rest}
      footer={({ close }) => {
        const confirmAndClose = () => {
          confirmed.current = true;
          close();
          confirmed.current = false;
        };
        return (
          <>
            {/* WAI-ARIA APG alertdialog: initial focus on the least destructive action. */}
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <Button variant="outline" autoFocus isDisabled={pending} onPress={close}>
              {cancelLabel ?? messages.cancel}
            </Button>
            <Button
              variant={tone === 'danger' ? 'danger' : 'primary'}
              isDisabled={isConfirmDisabled}
              isPending={pending}
              onPress={() => {
                const result = onConfirm();
                if (!(result instanceof Promise)) {
                  confirmAndClose();
                  return;
                }
                setPending(true);
                result.then(
                  () => {
                    if (!mounted.current) return;
                    setPending(false);
                    confirmAndClose();
                  },
                  () => {
                    if (mounted.current) setPending(false);
                  },
                );
              }}
            >
              {confirmLabel ?? messages.confirm}
            </Button>
          </>
        );
      }}
    >
      {children}
    </OverlayPanel>
  );
});
