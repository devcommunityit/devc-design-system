import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button';
import { NumberInput } from '../NumberInput';
import shared from '../composite/Composite.module.css';
import styles from './ImageCropper.module.css';

/** Coordinates and dimensions are integer pixels in the original image. */
export interface ImageCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageCropResult {
  crop: ImageCrop;
  blob: Blob;
}

export interface ImageCropperProps {
  'aria-label': string;
  src: string;
  alt: string;
  /** CORS mode for remote images. Defaults to anonymous; credentials are opt-in. */
  crossOrigin?: 'anonymous' | 'use-credentials';
  crop?: ImageCrop;
  defaultCrop?: ImageCrop;
  onCropChange?: (crop: ImageCrop) => void;
  onCrop: (result: ImageCropResult) => void | Promise<void>;
  onError?: (error: unknown) => void;
  mimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
  className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(value)));

function isValidCrop(crop: ImageCrop, width: number, height: number): boolean {
  return [crop.x, crop.y, crop.width, crop.height].every(Number.isInteger)
    && crop.x >= 0 && crop.y >= 0 && crop.width > 0 && crop.height > 0
    && crop.x + crop.width <= width && crop.y + crop.height <= height;
}

function CropperContent({
  'aria-label': ariaLabel, src, alt, crossOrigin = 'anonymous', crop: controlledCrop, defaultCrop, onCropChange, onCrop, onError,
  mimeType = 'image/png', quality, className,
}: ImageCropperProps) {
  const t = useMessages().components;
  const imageRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; previous: ImageCrop } | null>(null);
  const mounted = useRef(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [crop, setCrop] = useControllableState<ImageCrop | null>(controlledCrop, defaultCrop ?? null, (next) => {
    if (next) onCropChange?.(next);
  }, 'crop');
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const active = dimensions ? crop ?? { x: 0, y: 0, width: dimensions.width, height: dimensions.height } : null;
  if (quality !== undefined && (!Number.isFinite(quality) || quality < 0 || quality > 1)) {
    throw new RangeError('ImageCropper: quality must be between 0 and 1.');
  }
  if (active && dimensions && !isValidCrop(active, dimensions.width, dimensions.height)) {
    throw new RangeError('ImageCropper: crop must contain positive integer dimensions within the image.');
  }
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const point = (event: PointerEvent<HTMLDivElement>) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect || !dimensions || rect.width <= 0 || rect.height <= 0) return null;
    return {
      x: clamp((event.clientX - rect.left) / rect.width * dimensions.width, 0, dimensions.width - 1),
      y: clamp((event.clientY - rect.top) / rect.height * dimensions.height, 0, dimensions.height - 1),
    };
  };
  const updateDrag = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    const end = point(event);
    if (!start || start.pointerId !== event.pointerId || !end) return;
    setCrop({
      x: Math.min(start.x, end.x), y: Math.min(start.y, end.y),
      width: Math.abs(start.x - end.x) + 1, height: Math.abs(start.y - end.y) + 1,
    });
  };
  const updateField = (field: keyof ImageCrop, value: number) => {
    if (!active || !dimensions || !Number.isFinite(value)) return;
    const next = { ...active };
    if (field === 'x') {
      next.x = clamp(value, 0, dimensions.width - 1);
      next.width = Math.min(next.width, dimensions.width - next.x);
    } else if (field === 'y') {
      next.y = clamp(value, 0, dimensions.height - 1);
      next.height = Math.min(next.height, dimensions.height - next.y);
    } else if (field === 'width') next.width = clamp(value, 1, dimensions.width - next.x);
    else next.height = clamp(value, 1, dimensions.height - next.y);
    setCrop(next);
  };
  const fail = (reason: unknown) => {
    if (mounted.current) setError(true);
    onError?.(reason);
  };
  const apply = async () => {
    const image = imageRef.current;
    if (!image || !active || pending) return;
    setPending(true);
    setError(false);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = active.width;
      canvas.height = active.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('ImageCropper: canvas is unavailable.');
      context.drawImage(image, active.x, active.y, active.width, active.height, 0, 0, active.width, active.height);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => {
        if (!result) reject(new Error('ImageCropper: image encoding failed.'));
        else if (result.type !== mimeType) reject(new Error(`ImageCropper: encoding as ${mimeType} is not supported.`));
        else resolve(result);
      }, mimeType, quality));
      if (mounted.current) await onCrop({ crop: active, blob });
    } catch (reason) {
      fail(reason);
    } finally {
      if (mounted.current) setPending(false);
    }
  };
  return (
    <section className={cx(shared.root, className)} aria-label={ariaLabel}>
      <div>
        <div
          className={styles.stage}
          onPointerDown={(event) => {
            if (event.button !== 0 || !active || pending) return;
            const start = point(event);
            if (!start) return;
            event.preventDefault();
            drag.current = { pointerId: event.pointerId, ...start, previous: active };
            event.currentTarget.setPointerCapture?.(event.pointerId);
            updateDrag(event);
          }}
          onPointerMove={updateDrag}
          onPointerUp={(event) => { updateDrag(event); drag.current = null; }}
          onPointerCancel={() => {
            if (drag.current) setCrop(drag.current.previous);
            drag.current = null;
          }}
        >
          <img
            ref={imageRef}
            className={styles.image}
            crossOrigin={crossOrigin}
            src={src}
            alt={alt}
            draggable={false}
            onLoad={(event) => {
              const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
              if (!width || !height) {
                fail(new Error('ImageCropper: image has no dimensions.'));
                return;
              }
              setDimensions({ width, height });
              setError(false);
            }}
            onError={() => fail(new Error('ImageCropper: image failed to load.'))}
          />
          {active && dimensions ? (
            <span aria-hidden="true" className={styles.selection} style={{
              left: `${active.x / dimensions.width * 100}%`, top: `${active.y / dimensions.height * 100}%`,
              width: `${active.width / dimensions.width * 100}%`, height: `${active.height / dimensions.height * 100}%`,
            }} />
          ) : null}
        </div>
      </div>
      {!dimensions && !error ? <div role="status">{t.cropLoading}</div> : null}
      {error ? <div role="alert">{t.cropFailed}</div> : null}
      {active && dimensions ? (
        <div className={styles.controls}>
          <NumberInput label={t.cropX} value={active.x} minValue={0} maxValue={dimensions.width - 1} isDisabled={pending} onChange={(value) => updateField('x', value)} />
          <NumberInput label={t.cropY} value={active.y} minValue={0} maxValue={dimensions.height - 1} isDisabled={pending} onChange={(value) => updateField('y', value)} />
          <NumberInput label={t.cropWidth} value={active.width} minValue={1} maxValue={dimensions.width - active.x} isDisabled={pending} onChange={(value) => updateField('width', value)} />
          <NumberInput label={t.cropHeight} value={active.height} minValue={1} maxValue={dimensions.height - active.y} isDisabled={pending} onChange={(value) => updateField('height', value)} />
        </div>
      ) : null}
      <div><Button isDisabled={!active} isPending={pending} onPress={() => { void apply(); }}>{t.cropApply}</Button></div>
    </section>
  );
}

/** Draw a crop with a pointer or specify source-pixel bounds with keyboard-accessible fields. */
export function ImageCropper(props: ImageCropperProps) {
  return <CropperContent key={`${props.crossOrigin ?? 'anonymous'}:${props.src}`} {...props} />;
}
