import { MapPin, Navigation } from 'lucide-react';
import { forwardRef, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button/Button';
import styles from './VenueMap.module.css';

export type VenueMapDirections = 'google' | 'apple' | 'osm';

export interface VenueMapProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Venue name: used in the iframe title, the placeholder and the external links. */
  name: string;
  address?: ReactNode;
  latitude: number;
  longitude: number;
  /** OpenStreetMap zoom level, from 3 (country) to 19 (building). */
  zoom?: number;
  /** Controlled consent: the OpenStreetMap iframe is rendered only when true. */
  isLoaded?: boolean;
  defaultLoaded?: boolean;
  onLoadedChange?: (isLoaded: boolean) => void;
  /** External links shown below the map; pass an empty array to hide them. */
  directions?: readonly VenueMapDirections[];
  /** CSS aspect-ratio of the map area. */
  aspectRatio?: string;
  /** Custom content of the placeholder shown before consent (for example a static image of the area). */
  placeholder?: ReactNode;
  /** Replaces the default privacy note shown next to the load button. */
  consentNote?: ReactNode;
}

const clampZoom = (zoom: number) => Math.min(19, Math.max(3, Math.round(zoom)));
const fixed = (value: number) => value.toFixed(6);

/** OpenStreetMap embed URL centred on the venue, with a marker. The bounding box approximates `zoom` for a ~16:9 frame. */
export function venueMapEmbedUrl(latitude: number, longitude: number, zoom = 16): string {
  const lonDelta = 360 / 2 ** clampZoom(zoom) / 2;
  const latDelta = lonDelta * Math.cos((latitude * Math.PI) / 180) * 0.6;
  const bbox = [longitude - lonDelta, latitude - latDelta, longitude + lonDelta, latitude + latDelta].map(fixed).join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${fixed(latitude)},${fixed(longitude)}`)}`;
}

/** Links to external map apps for the venue coordinates. */
export function venueMapLinks(latitude: number, longitude: number, name: string, zoom = 16): Record<VenueMapDirections, string> {
  const lat = fixed(latitude);
  const lon = fixed(longitude);
  return {
    osm: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${clampZoom(zoom)}/${lat}/${lon}`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
    apple: `https://maps.apple.com/?daddr=${lat},${lon}&q=${encodeURIComponent(name)}`,
  };
}

const DEFAULT_DIRECTIONS: readonly VenueMapDirections[] = ['osm', 'google', 'apple'];

/**
 * Venue location map. Nothing is requested from OpenStreetMap until the user presses "Load map" (or `isLoaded` is
 * true): before that a static placeholder with the venue and the privacy note is shown.
 */
export const VenueMap = forwardRef<HTMLElement, VenueMapProps>(function VenueMap(
  {
    name,
    address,
    latitude,
    longitude,
    zoom = 16,
    isLoaded,
    defaultLoaded = false,
    onLoadedChange,
    directions = DEFAULT_DIRECTIONS,
    aspectRatio = '16 / 9',
    placeholder,
    consentNote,
    className,
    style,
    ...rest
  },
  ref,
) {
  const messages = useMessages();
  const t = messages.components;
  const [loaded, setLoaded] = useControllableState(isLoaded, defaultLoaded, onLoadedChange, 'isLoaded');
  // The load button unmounts on press: hand focus to the map so keyboard users do not land on <body>.
  const focusFrame = useRef(false);
  const links = venueMapLinks(latitude, longitude, name, zoom);
  const linkLabels: Record<VenueMapDirections, string> = { osm: t.venueMapOpen, google: t.venueMapGoogle, apple: t.venueMapApple };

  return (
    <figure ref={ref} className={cx(styles.root, className)} style={{ ...style, '--dc-venue-map-ratio': aspectRatio } as CSSProperties} {...rest}>
      <div className={styles.frame}>
        {loaded ? (
          <iframe
            ref={(node) => {
              if (node && focusFrame.current) {
                focusFrame.current = false;
                node.focus();
              }
            }}
            className={styles.iframe}
            title={t.venueMapFrame(name)}
            src={venueMapEmbedUrl(latitude, longitude, zoom)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className={styles.placeholder}>
            {placeholder ?? (
              <div className={styles.illustration} aria-hidden="true">
                <MapPin className={styles.pin} />
              </div>
            )}
            <div className={styles.consent}>
              <p className={styles.venue}>{name}</p>
              <p className={styles.note}>{consentNote ?? t.venueMapConsent}</p>
              <Button variant="secondary" size="sm" startIcon={<Navigation />} onPress={() => {
                  focusFrame.current = true;
                  setLoaded(true);
                }}>
                {t.venueMapLoad}
              </Button>
            </div>
          </div>
        )}
      </div>
      {address || directions.length ? (
        <figcaption className={styles.caption}>
          {address ? <address className={styles.address}>{address}</address> : null}
          {directions.length ? (
            <ul className={styles.links}>
              {directions.map((key) => (
                <li key={key}>
                  <a className={styles.link} href={links[key]} target="_blank" rel="noreferrer">
                    {linkLabels[key]}
                    <span className={styles.srOnly}> {messages.opensInNewTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
});
