import { Accessibility, Users, X } from 'lucide-react';
import { forwardRef, useId, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button/Button';
import { Toggle, ToggleGroup } from '../Toggle/Toggle';
import styles from './VenueFloorPlan.module.css';

export type VenueAreaKind = 'room' | 'stage' | 'booth' | 'food' | 'restroom' | 'entrance' | 'info' | 'service' | 'outdoor';

export type VenuePoint = readonly [x: number, y: number];

/** A rectangle or a polygon, in the plan's coordinate system (`width` × `height`). */
export type VenueAreaShape = { x: number; y: number; width: number; height: number; radius?: number } | { points: readonly VenuePoint[] };

export interface VenueArea {
  id: string;
  label: string;
  kind?: VenueAreaKind;
  shape: VenueAreaShape;
  /** Id of the level (floor) the area belongs to; defaults to the first level. */
  level?: string;
  description?: ReactNode;
  capacity?: number;
  isAccessible?: boolean;
  isDisabled?: boolean;
}

export interface VenueMarker {
  id: string;
  x: number;
  y: number;
  label: string;
  level?: string;
  tone?: 'brand' | 'danger';
}

export interface VenueLevel {
  id: string;
  label: string;
}

export interface VenueFloorPlanProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** Accessible name of the plan, for example "Floor plan of the Conference Center". */
  label: string;
  areas: readonly VenueArea[];
  /** Coordinate system of the plan (SVG viewBox). */
  width?: number;
  height?: number;
  /** Building outline drawn behind the areas; defaults to the whole plan. */
  outline?: readonly VenuePoint[];
  levels?: readonly VenueLevel[];
  level?: string;
  defaultLevel?: string;
  onLevelChange?: (level: string) => void;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (id: string | null) => void;
  /** Areas to emphasise without selecting them (search results, rooms of a track…). */
  highlightedIds?: readonly string[];
  markers?: readonly VenueMarker[];
  showLegend?: boolean;
  showLabels?: boolean;
  /** Replaces the default details of the selected area. */
  renderDetails?: (area: VenueArea) => ReactNode;
}

type Box = { x: number; y: number; width: number; height: number };

function boxOf(shape: VenueAreaShape): Box {
  if ('points' in shape) {
    const xs = shape.points.map((p) => p[0]);
    const ys = shape.points.map((p) => p[1]);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
  }
  return shape;
}

const centerOf = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

type Direction = 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp';

/** Nearest area in the pressed direction, weighting the off-axis distance so that aligned areas win. */
export function nextAreaInDirection(from: { x: number; y: number }, candidates: ReadonlyArray<{ id: string; x: number; y: number }>, direction: Direction): string | undefined {
  let best: { id: string; cost: number } | undefined;
  for (const c of candidates) {
    const dx = c.x - from.x;
    const dy = c.y - from.y;
    const [primary, secondary] = direction === 'ArrowRight' ? [dx, dy] : direction === 'ArrowLeft' ? [-dx, dy] : direction === 'ArrowDown' ? [dy, dx] : [-dy, dx];
    if (primary <= 0) continue;
    const cost = primary + Math.abs(secondary) * 2;
    if (!best || cost < best.cost) best = { id: c.id, cost };
  }
  return best?.id;
}

const KIND_ORDER: readonly VenueAreaKind[] = ['stage', 'room', 'booth', 'food', 'restroom', 'entrance', 'info', 'service', 'outdoor'];

/** Interactive venue floor plan: rooms, stages, booths and services as selectable SVG areas, with levels, legend and details. */
export const VenueFloorPlan = forwardRef<HTMLDivElement, VenueFloorPlanProps>(function VenueFloorPlan(
  {
    label,
    areas,
    width = 1000,
    height = 600,
    outline,
    levels,
    level,
    defaultLevel,
    onLevelChange,
    selectedId,
    defaultSelectedId = null,
    onSelectionChange,
    highlightedIds,
    markers,
    showLegend = true,
    showLabels = true,
    renderDetails,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages().components;
  const hintId = useId();
  const firstLevel = levels?.[0]?.id;
  const [currentLevel, setCurrentLevel] = useControllableState(level, defaultLevel ?? firstLevel ?? '', onLevelChange, 'level');
  const [selected, setSelected] = useControllableState<string | null>(selectedId, defaultSelectedId, onSelectionChange, 'selectedId');
  const onLevel = (item: { level?: string }) => !levels?.length || (item.level ?? firstLevel) === currentLevel;

  const visible = useMemo(
    () =>
      areas
        .filter((a) => !levels?.length || (a.level ?? firstLevel) === currentLevel)
        .map((area) => {
          const box = boxOf(area.shape);
          return { area, box, center: centerOf(box) };
        }),
    [areas, levels, firstLevel, currentLevel],
  );
  const selectedArea = visible.find((v) => v.area.id === selected)?.area;
  const highlighted = new Set(highlightedIds);
  const [focusedId, setFocusedId] = useState<string | undefined>();
  const tabStop = visible.some((v) => v.area.id === focusedId) ? focusedId : (selectedArea?.id ?? visible[0]?.area.id);
  const nodes = useRef(new Map<string, SVGGElement>());
  const kinds = KIND_ORDER.filter((kind) => visible.some((v) => (v.area.kind ?? 'room') === kind));

  const focusArea = (id: string | undefined) => {
    if (!id) return;
    setFocusedId(id);
    nodes.current.get(id)?.focus();
  };

  const select = (area: VenueArea) => {
    if (!area.isDisabled) setSelected(area.id);
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>, index: number) => {
    const current = visible[index];
    if (!current) return;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowDown':
      case 'ArrowUp': {
        const others = visible.filter((_, i) => i !== index).map((v) => ({ id: v.area.id, ...v.center }));
        focusArea(nextAreaInDirection(current.center, others, event.key));
        break;
      }
      case 'Home':
        focusArea(visible[0]?.area.id);
        break;
      case 'End':
        focusArea(visible.at(-1)?.area.id);
        break;
      case 'Enter':
      case ' ':
        select(current.area);
        break;
      case 'Escape':
        if (selected === null) return;
        setSelected(null);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const changeLevel = (next: string) => {
    setCurrentLevel(next);
    const stays = areas.some((a) => a.id === selected && (a.level ?? firstLevel) === next);
    if (!stays && selected !== null) setSelected(null);
  };

  return (
    <div ref={ref} className={cx(styles.root, className)} {...rest}>
      {levels && levels.length > 1 ? (
        <ToggleGroup
          aria-label={t.floorPlanLevel}
          className={styles.levels}
          selectedKeys={[currentLevel]}
          disallowEmptySelection
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (typeof next === 'string') changeLevel(next);
          }}
        >
          {levels.map((l) => (
            <Toggle key={l.id} id={l.id}>
              {l.label}
            </Toggle>
          ))}
        </ToggleGroup>
      ) : null}
      <div className={styles.body}>
        <div className={styles.planColumn}>
          <svg className={styles.plan} viewBox={`0 0 ${width} ${height}`} role="group" aria-label={label} aria-describedby={hintId}>
            {outline ? (
              <polygon className={styles.outline} points={outline.map((p) => p.join(',')).join(' ')} />
            ) : (
              <rect className={styles.outline} x={0} y={0} width={width} height={height} rx={12} />
            )}
            {visible.map(({ area, box, center }, index) => {
              const kind = area.kind ?? 'room';
              const isSelected = area.id === selected;
              const fontSize = Math.max(14, Math.min(40, box.width / Math.max(4, area.label.length * 0.62), box.height * 0.32));
              return (
                <g
                  key={area.id}
                  ref={(node) => {
                    if (node) nodes.current.set(area.id, node);
                    else nodes.current.delete(area.id);
                  }}
                  role="button"
                  tabIndex={area.id === tabStop ? 0 : -1}
                  aria-label={`${area.label}, ${t.floorPlanKind(kind)}`}
                  aria-pressed={isSelected}
                  aria-disabled={area.isDisabled || undefined}
                  className={styles.area}
                  data-kind={kind}
                  data-selected={isSelected || undefined}
                  data-highlighted={highlighted.has(area.id) || undefined}
                  data-disabled={area.isDisabled || undefined}
                  onClick={() => {
                    setFocusedId(area.id);
                    select(area);
                  }}
                  onFocus={() => setFocusedId(area.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  {'points' in area.shape ? (
                    <polygon className={styles.shape} points={area.shape.points.map((p) => p.join(',')).join(' ')} />
                  ) : (
                    <rect className={styles.shape} x={box.x} y={box.y} width={box.width} height={box.height} rx={area.shape.radius ?? 8} />
                  )}
                  {showLabels ? (
                    <text className={styles.label} x={center.x} y={center.y} fontSize={fontSize} textAnchor="middle" dominantBaseline="central" aria-hidden="true">
                      {area.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {markers?.filter(onLevel).map((marker) => (
              <g key={marker.id} role="img" aria-label={marker.label} className={styles.marker} data-tone={marker.tone ?? 'brand'}>
                <circle className={styles.markerHalo} cx={marker.x} cy={marker.y} r={18} />
                <circle className={styles.markerDot} cx={marker.x} cy={marker.y} r={8} />
                <text className={styles.markerLabel} x={marker.x} y={marker.y - 26} textAnchor="middle" aria-hidden="true">
                  {marker.label}
                </text>
              </g>
            ))}
          </svg>
          <p id={hintId} className={styles.hint}>
            {t.floorPlanHint}
          </p>
          {showLegend && kinds.length ? (
            <ul className={styles.legend} aria-label={t.floorPlanLegend}>
              {kinds.map((kind) => (
                <li key={kind} className={styles.legendItem}>
                  <span className={styles.swatch} data-kind={kind} aria-hidden="true" />
                  {t.floorPlanKind(kind)}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className={styles.details} aria-live="polite">
          {selectedArea ? (
            <>
              <div className={styles.detailsHeader}>
                <span className={styles.swatch} data-kind={selectedArea.kind ?? 'room'} aria-hidden="true" />
                <div className={styles.detailsTitle}>
                  <strong>{selectedArea.label}</strong>
                  <span className={styles.detailsKind}>{t.floorPlanKind(selectedArea.kind ?? 'room')}</span>
                </div>
              </div>
              {renderDetails ? (
                renderDetails(selectedArea)
              ) : (
                <>
                  {selectedArea.capacity !== undefined || selectedArea.isAccessible ? (
                    <ul className={styles.facts}>
                      {selectedArea.capacity !== undefined ? (
                        <li>
                          <Users aria-hidden="true" className={styles.factIcon} />
                          {t.floorPlanCapacity(selectedArea.capacity)}
                        </li>
                      ) : null}
                      {selectedArea.isAccessible ? (
                        <li>
                          <Accessibility aria-hidden="true" className={styles.factIcon} />
                          {t.floorPlanAccessible}
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                  {selectedArea.description ? <div className={styles.description}>{selectedArea.description}</div> : null}
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                startIcon={<X />}
                onPress={() => {
                  // The button disappears with the selection: return focus to the area it described.
                  focusArea(selectedArea.id);
                  setSelected(null);
                }}
                className={styles.clear}
              >
                {t.floorPlanClear}
              </Button>
            </>
          ) : (
            <p className={styles.empty}>{t.floorPlanEmpty}</p>
          )}
        </div>
      </div>
    </div>
  );
});
