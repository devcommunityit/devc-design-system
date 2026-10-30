import { X } from 'lucide-react';
import { forwardRef, useContext, useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import {
  Button as RACButton,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  type OverlayTriggerState,
  type DialogProps as RACDialogProps,
  type DialogTriggerProps as RACDialogTriggerProps,
} from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './Dialog.module.css';

export type DialogTriggerProps = RACDialogTriggerProps;

/** Opens the Dialog/Drawer/AlertDialog it wraps when its first pressable child is pressed; restores focus on close. */
export function DialogTrigger(props: DialogTriggerProps) {
  return <RACDialogTrigger {...props} />;
}

export interface DialogRenderProps {
  /** Closes the overlay (focus returns to the trigger). */
  close: () => void;
}

type Renderable = ReactNode | ((opts: DialogRenderProps) => ReactNode);

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
export type DrawerPlacement = 'start' | 'end' | 'bottom';

export interface OverlayStateProps {
  /** Controlled open state. Omit when used inside `DialogTrigger`. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Close when clicking the backdrop. @default true (false for AlertDialog) */
  isDismissable?: boolean;
  /** Disable closing with Escape. @default false */
  isKeyboardDismissDisabled?: boolean;
}

export interface DialogProps extends Omit<RACDialogProps, 'children' | 'className' | 'style'>, OverlayStateProps {
  title: ReactNode;
  /** Short text under the title, linked with aria-describedby. */
  description?: ReactNode;
  children?: Renderable;
  /** Actions area (usually buttons), aligned to the end. */
  footer?: Renderable;
  /** Max inline size. `fullscreen` fills the viewport. @default 'md' */
  size?: DialogSize;
  /** Hide the header close button (keep another visible way to close). */
  hideCloseButton?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface PanelProps extends DialogProps {
  kind: 'dialog' | 'drawer' | 'alert';
  placement?: DrawerPlacement;
  tone?: 'default' | 'danger';
}

/** Internal panel shared by Dialog, Drawer and AlertDialog. */
export const OverlayPanel = forwardRef<HTMLElement, PanelProps>(function OverlayPanel(
  {
    kind,
    placement,
    tone,
    title,
    description,
    children,
    footer,
    size = 'md',
    hideCloseButton,
    isOpen,
    defaultOpen,
    onOpenChange,
    isDismissable = kind !== 'alert',
    isKeyboardDismissDisabled,
    className,
    style,
    role,
    ...rest
  },
  ref,
) {
  const messages = useMessages();
  // Portaled content must follow the closest LocaleProvider, which may sit inside the ThemeProvider.
  const { locale, direction } = useLocale();
  const descriptionId = useId();
  const triggerState = useContext(OverlayTriggerStateContext);
  const usesTrigger = triggerState !== null && isOpen === undefined && defaultOpen === undefined;
  // Inside a DialogTrigger the trigger owns the state; wrap it so `onOpenChange` still fires.
  const wrappedState = useMemo<OverlayTriggerState | null>(() => {
    if (!usesTrigger || !triggerState || !onOpenChange) return triggerState;
    return {
      ...triggerState,
      setOpen: (open) => {
        triggerState.setOpen(open);
        onOpenChange(open);
      },
      open: () => {
        triggerState.open();
        onOpenChange(true);
      },
      close: () => {
        triggerState.close();
        onOpenChange(false);
      },
      toggle: () => {
        const next = !triggerState.isOpen;
        triggerState.toggle();
        onOpenChange(next);
      },
    };
  }, [usesTrigger, triggerState, onOpenChange]);
  return (
    <OverlayTriggerStateContext.Provider value={wrappedState}>
    <ModalOverlay
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={usesTrigger ? undefined : onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={styles.overlay}
      dir={direction}
      lang={locale}
      data-kind={kind}
      data-placement={placement}
    >
      <Modal className={styles.modal} data-kind={kind} data-size={kind === 'drawer' ? undefined : size} data-placement={placement}>
        <RACDialog
          ref={ref}
          role={kind === 'alert' ? 'alertdialog' : role}
          aria-describedby={description ? descriptionId : undefined}
          className={cx(styles.dialog, className)}
          style={style}
          data-tone={tone}
          {...rest}
        >
          {({ close }) => (
            <>
              <div className={styles.header}>
                <Heading slot="title" className={styles.title}>
                  {title}
                </Heading>
                {!hideCloseButton && kind !== 'alert' ? (
                  <RACButton className={styles.close} aria-label={messages.close} onPress={close}>
                    <X aria-hidden="true" />
                  </RACButton>
                ) : null}
              </div>
              {description ? (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              ) : null}
              {children !== undefined ? (
                <div className={styles.body}>{typeof children === 'function' ? children({ close }) : children}</div>
              ) : null}
              {footer !== undefined ? (
                <div className={styles.footer}>{typeof footer === 'function' ? footer({ close }) : footer}</div>
              ) : null}
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
    </OverlayTriggerStateContext.Provider>
  );
});

/**
 * Modal dialog: blocks the page, traps focus, closes with Escape (and the backdrop when dismissable),
 * locks scroll and restores focus. Rendered in the nearest ThemeProvider's portal, so it keeps that theme.
 */
export const Dialog = forwardRef<HTMLElement, DialogProps>(function Dialog(props, ref) {
  return <OverlayPanel ref={ref} kind="dialog" {...props} />;
});
