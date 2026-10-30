import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { Heading, type DialogTriggerProps } from 'react-aria-components';
import { useMessages, useLocale } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { Button } from '../../components/Button/Button';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconButton } from '../../components/IconButton/IconButton';
import { Popover, PopoverTrigger, type PopoverSurfaceProps } from '../../components/Popover/Popover';
import { RelativeTime, type RelativeTimeInput } from '../../components/RelativeTime/RelativeTime';
import { Link } from '../../components/Typography/Typography';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden';
import styles from './NotificationCenter.module.css';

export interface NotificationItem {
  id: string;
  /** Plain-text title (also used in the "mark as read" label). */
  title: string;
  description?: ReactNode;
  /** When it happened: Date, ISO string with offset or epoch ms. */
  date: RelativeTimeInput;
  read?: boolean;
  /** Makes the title a link (client routing through RAC `RouterProvider`). */
  href?: string;
  /** Decorative icon shown before the content. */
  icon?: ReactNode;
}

export interface NotificationCenterProps extends Pick<DialogTriggerProps, 'isOpen' | 'defaultOpen' | 'onOpenChange'> {
  /** Notifications, newest first. The list is controlled: update `read` in your state. */
  items: NotificationItem[];
  /** Called when a single notification is marked as read. Without it, no per-item button is shown. */
  onMarkRead?: (id: string) => void;
  /** Called by "Mark all as read". Without it, the button is not shown. */
  onMarkAllRead?: () => void;
  /** Called when a linked title is activated, before navigation (e.g. to mark it as read). */
  onItemAction?: (id: string) => void;
  /** Panel heading. @default messages.notifications */
  title?: ReactNode;
  /** Reference instant for relative times (deterministic output in tests and demos). */
  now?: RelativeTimeInput;
  /** Extra content at the bottom of the panel, e.g. a "View all" link. */
  footer?: ReactNode | ((opts: { close: () => void }) => ReactNode);
  /** Content when `items` is empty. @default an EmptyState with messages.noNotifications */
  emptyState?: ReactNode;
  /** @default 'bottom end' */
  placement?: PopoverSurfaceProps['placement'];
  /** Class for the trigger wrapper. */
  className?: string;
}

/**
 * Bell button with an unread count and a popover listing notifications (non-modal dialog). The trigger name
 * includes the count; unread items are marked by a dot plus hidden text, not by color alone. Data, read state
 * and delivery (polling, websockets) belong to the consumer.
 */
export function NotificationCenter({
  items,
  onMarkRead,
  onMarkAllRead,
  onItemAction,
  title,
  now,
  footer,
  emptyState,
  placement = 'bottom end',
  className,
  ...triggerProps
}: NotificationCenterProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const listRef = useRef<HTMLUListElement>(null);
  const unread = items.filter((item) => !item.read).length;
  const count = unread > 99 ? `${new Intl.NumberFormat(locale).format(99)}+` : new Intl.NumberFormat(locale).format(unread);

  // A pressed "mark as read" button disappears or becomes disabled: move focus first, then notify the consumer,
  // so focus never falls back to <body> (which would also break focus restoration on close).
  const moveFocusFrom = (current: Element | null) => {
    const list = listRef.current;
    if (!list) return;
    const buttons = [...list.querySelectorAll<HTMLElement>('[data-mark-read]')];
    const index = current instanceof HTMLElement ? buttons.indexOf(current) : -1;
    const next = index >= 0 ? (buttons[index + 1] ?? buttons[index - 1]) : undefined;
    (next ?? list).focus();
  };

  return (
    <PopoverTrigger {...triggerProps}>
      <span className={cx(styles.trigger, className)}>
        <IconButton label={t.notificationsUnread(unread)} icon={<Bell />} />
        {unread > 0 ? (
          <span className={styles.count} aria-hidden="true">
            {count}
          </span>
        ) : null}
      </span>
      <Popover placement={placement} className={styles.popover} dialogProps={{ className: styles.dialog }}>
        {({ close }) => (
          <>
            <div className={styles.header}>
              <Heading slot="title" className={styles.title}>
                {title ?? t.notifications}
              </Heading>
              {onMarkAllRead && items.length > 0 ? (
                <Button
                  size="sm"
                  variant="ghost"
                  startIcon={<CheckCheck />}
                  isDisabled={unread === 0}
                  onPress={() => {
                    moveFocusFrom(null);
                    onMarkAllRead();
                  }}
                >
                  {t.markAllRead}
                </Button>
              ) : null}
            </div>
            {items.length === 0 ? (
              <div className={styles.empty}>
                {emptyState ?? <EmptyState size="sm" icon={<BellOff />} title={t.noNotifications} headingLevel={3} />}
              </div>
            ) : (
              <ul ref={listRef} className={styles.list} tabIndex={-1}>
                {items.map((item) => (
                  <li key={item.id} className={styles.item} data-unread={!item.read || undefined}>
                    {item.icon ? (
                      <span className={styles.icon} aria-hidden="true">
                        {item.icon}
                      </span>
                    ) : null}
                    <div className={styles.body}>
                      <p className={styles.itemTitle}>
                        {item.href ? (
                          <Link
                            variant="standalone"
                            href={item.href}
                            onPress={() => {
                              onItemAction?.(item.id);
                              close();
                            }}
                          >
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                        {!item.read ? <VisuallyHidden>{` (${t.unread})`}</VisuallyHidden> : null}
                      </p>
                      {item.description ? <div className={styles.description}>{item.description}</div> : null}
                      <RelativeTime date={item.date} now={now} className={styles.time} />
                    </div>
                    {!item.read ? <span className={styles.dot} aria-hidden="true" /> : null}
                    {!item.read && onMarkRead ? (
                      <IconButton
                        size="sm"
                        data-mark-read=""
                        label={t.markAsRead(item.title)}
                        icon={<Check />}
                        onPress={(event) => {
                          moveFocusFrom(event.target);
                          onMarkRead(item.id);
                        }}
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {footer ? <div className={styles.footer}>{typeof footer === 'function' ? footer({ close }) : footer}</div> : null}
          </>
        )}
      </Popover>
    </PopoverTrigger>
  );
}
