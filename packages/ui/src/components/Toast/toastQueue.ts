import type { ReactNode } from 'react';
import type { FeedbackTone } from '../Alert/Alert';

export interface ToastAction {
  label: string;
  onAction: () => void;
}

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  /** @default 'info' */
  tone?: FeedbackTone | 'neutral';
  /**
   * Auto-dismiss delay in ms; `null` keeps the toast until closed.
   * Default: 6000, or `null` for `danger` toasts and toasts with an action (critical info must not disappear).
   */
  duration?: number | null;
  action?: ToastAction;
  /** Called after the toast is removed (closed, timed out or cleared). */
  onClose?: () => void;
  /** Plain-text announcement; defaults to the string content of title + description. */
  announcement?: string;
}

export interface ToastRecord extends Omit<ToastOptions, 'duration'> {
  id: string;
  duration: number | null;
}

type Listener = () => void;

/** Framework-agnostic queue (external store). Create one per app or let ToastProvider create it. */
export class ToastQueue {
  private items: ToastRecord[] = [];
  private listeners = new Set<Listener>();
  private seq = 0;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): ToastRecord[] => this.items;

  /** Adds a toast and returns its id. */
  show = (options: ToastOptions): string => {
    this.seq += 1;
    const id = `dc-toast-${this.seq}`;
    const persistent = options.tone === 'danger' || options.action !== undefined;
    const duration = options.duration === undefined ? (persistent ? null : 6000) : options.duration;
    this.items = [...this.items, { ...options, id, duration }];
    this.emit();
    return id;
  };

  dismiss = (id: string): void => {
    const item = this.items.find((t) => t.id === id);
    if (!item) return;
    this.items = this.items.filter((t) => t.id !== id);
    this.emit();
    item.onClose?.();
  };

  clear = (): void => {
    const removed = this.items;
    this.items = [];
    this.emit();
    removed.forEach((t) => t.onClose?.());
  };

  private emit() {
    this.listeners.forEach((l) => l());
  }
}

export function createToastQueue(): ToastQueue {
  return new ToastQueue();
}