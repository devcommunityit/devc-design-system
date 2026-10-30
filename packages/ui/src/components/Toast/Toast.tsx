import { X } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { usePortalContainer } from '../../theme/ThemeProvider';
import { cx } from '../../utils';
import { FeedbackIcon, toneLabel } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import styles from './Toast.module.css';
import { ToastQueue, type ToastOptions, type ToastRecord } from './toastQueue';

export interface ToastApi {
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastQueue | null>(null);

export interface ToastProviderProps {
  children?: ReactNode;
  /** Use an external queue (e.g. to show toasts from non-React code). */
  queue?: ToastQueue;
  /** Toasts visible at once; the rest wait in the queue. @default 3 */
  maxVisible?: number;
  /** @default 'bottom-end' */
  placement?: 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';
  className?: string;
}

const empty: ToastRecord[] = [];

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return '';
}

function ToastItem({ toast, queue }: { toast: ToastRecord; queue: ToastQueue }) {
  const t = useMessages();
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);

  useEffect(() => {
    if (remaining.current === null || paused) return;
    const started = Date.now();
    const timer = window.setTimeout(() => queue.dismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      if (remaining.current !== null) remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [paused, queue, toast.id]);

  const tone = toast.tone ?? 'info';
  return (
    <li
      className={styles.toast}
      data-tone={tone}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      {tone !== 'neutral' ? <FeedbackIcon tone={tone} className={styles.icon} /> : null}
      <div className={styles.body}>
        <div className={styles.title}>
          {tone !== 'neutral' ? <span className={styles.srOnly}>{toneLabel(t, tone)}: </span> : null}
          {toast.title}
        </div>
        {toast.description ? <div className={styles.description}>{toast.description}</div> : null}
        {toast.action ? (
          <div className={styles.actions}>
            <Button
              size="sm"
              variant="secondary"
              onPress={() => {
                toast.action?.onAction();
                queue.dismiss(toast.id);
              }}
            >
              {toast.action.label}
            </Button>
          </div>
        ) : null}
      </div>
      <IconButton size="sm" label={t.dismiss} icon={<X />} className={styles.close} onPress={() => queue.dismiss(toast.id)} />
    </li>
  );
}

/**
 * Announces each new toast once by writing into persistent live regions
 * (more reliable than inserting new live nodes, and does not re-announce on dismissal).
 */
function Announcer({ visible }: { visible: ToastRecord[] }) {
  const t = useMessages();
  const seen = useRef(new Set<string>());
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    for (const toast of visible) {
      if (seen.current.has(toast.id)) continue;
      seen.current.add(toast.id);
      const tone = toast.tone ?? 'info';
      const prefix = tone === 'neutral' ? '' : `${toneLabel(t, tone)}: `;
      const text = toast.announcement ?? [textOf(toast.title), textOf(toast.description)].filter(Boolean).join('. ');
      const target = tone === 'danger' ? assertiveRef.current : politeRef.current;
      if (target) target.textContent = prefix + text;
    }
  }, [visible, t]);
  return (
    <>
      <div ref={politeRef} role="status" aria-live="polite" aria-atomic="true" className={styles.srOnly} />
      <div ref={assertiveRef} role="alert" aria-live="assertive" aria-atomic="true" className={styles.srOnly} />
    </>
  );
}

const subscribeNothing = () => () => undefined;
/**
 * Provides `useToast()` and renders the toast region in the ThemeProvider portal, so toasts inherit
 * the closest theme. Place it inside your ThemeProvider (and LocaleProvider).
 */
export function ToastProvider({ children, queue: externalQueue, maxVisible = 3, placement = 'bottom-end', className }: ToastProviderProps) {
  const [ownQueue] = useState(() => new ToastQueue());
  const queue = externalQueue ?? ownQueue;
  const t = useMessages();
  const { locale, direction } = useLocale();
  const themeContainer = usePortalContainer();
  const isClient = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const toasts = useSyncExternalStore(queue.subscribe, queue.getSnapshot, () => empty);
  const visible = toasts.slice(0, maxVisible);
  const container = themeContainer ?? (isClient ? document.body : null);

  return (
    <ToastContext.Provider value={queue}>
      {children}
      {container
        ? createPortal(
            <section aria-label={t.notifications} dir={direction} lang={locale} className={cx(styles.region, className)} data-placement={placement}>
              <Announcer visible={visible} />
              {visible.length > 0 ? (
                <ol className={styles.list}>
                  {visible.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} queue={queue} />
                  ))}
                </ol>
              ) : null}
            </section>,
            container,
          )
        : null}
    </ToastContext.Provider>
  );
}

/** Imperative API of the closest ToastProvider. */
export function useToast(): ToastApi {
  const queue = useContext(ToastContext);
  if (!queue) throw new Error('@dev-community/ui: useToast() must be used inside <ToastProvider>.');
  return { show: queue.show, dismiss: queue.dismiss, clear: queue.clear };
}

/** Current toasts (including queued ones) of the closest provider. */
export function useToasts(): ToastRecord[] {
  const queue = useContext(ToastContext);
  return useSyncExternalStore(queue?.subscribe ?? subscribeNothing, queue?.getSnapshot ?? (() => empty), () => empty);
}