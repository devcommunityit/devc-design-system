import { useEffect, useRef } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import shared from '../composite/Composite.module.css';
import styles from './ImageGallery.module.css';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  thumbnailSrc?: string;
  caption?: string;
}

export interface ImageGalleryProps {
  'aria-label': string;
  images: readonly GalleryImage[];
  /** Selected image, or null when the viewer is closed. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (id: string | null) => void;
  className?: string;
}

/** Thumbnail gallery with a keyboard-accessible modal image viewer. */
export function ImageGallery({
  'aria-label': ariaLabel, images, selectedId: controlledId, defaultSelectedId = null, onSelectionChange, className,
}: ImageGalleryProps) {
  const { direction } = useLocale();
  const t = useMessages();
  const dialogRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useControllableState(controlledId, defaultSelectedId, onSelectionChange, 'selectedId');
  const ids = new Set<string>();
  for (const image of images) {
    if (ids.has(image.id)) throw new Error(`ImageGallery: duplicate image id "${image.id}".`);
    ids.add(image.id);
  }
  const index = selectedId === null ? -1 : images.findIndex((image) => image.id === selectedId);
  if (selectedId !== null && index < 0) throw new Error(`ImageGallery: image "${selectedId}" was not found.`);
  const selected = index < 0 ? undefined : images[index];
  const goTo = (next: number) => {
    const image = images[next];
    if (image) setSelectedId(image.id);
  };
  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.target instanceof Node) || !dialogRef.current?.contains(event.target)) return;
      let next: number | undefined;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const forward = event.key === (direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
        next = index + (forward ? 1 : -1);
      } else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = images.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        const image = images[next];
        if (image) setSelectedId(image.id);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected, index, direction, images, setSelectedId]);
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      {images.length ? (
        <ul className={styles.grid}>
          {images.map((image) => (
            <li key={image.id}>
              <Button variant="ghost" className={styles.thumbnail} aria-label={t.components.imageOpen(image.alt || image.id)} onPress={() => setSelectedId(image.id)}>
                <img src={image.thumbnailSrc ?? image.src} alt="" loading="lazy" />
              </Button>
            </li>
          ))}
        </ul>
      ) : <div className={shared.muted}>{t.noResults}</div>}
      <Dialog
        ref={dialogRef}
        title={selected?.caption || selected?.alt || ariaLabel}
        isOpen={selected !== undefined}
        onOpenChange={(open) => { if (!open) setSelectedId(null); }}
        size="lg"
        footer={
          <div className={shared.toolbar}>
            <Button variant="outline" isDisabled={index <= 0} onPress={() => goTo(index - 1)}>{t.components.previous}</Button>
            <span aria-live="polite">{t.components.imagePosition(index + 1, images.length)}</span>
            <Button variant="outline" isDisabled={index >= images.length - 1} onPress={() => goTo(index + 1)}>{t.components.next}</Button>
          </div>
        }
      >
        {selected ? <img className={shared.image} src={selected.src} alt={selected.alt} /> : null}
      </Dialog>
    </section>
  );
}
