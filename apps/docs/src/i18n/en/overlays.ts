import type { ComponentOverlay, OverlayMap } from '../componentDocs';

const modules = import.meta.glob<ComponentOverlay>('./components/*.json', { eager: true, import: 'default' });

export const OVERLAYS: OverlayMap = Object.fromEntries(
  Object.entries(modules).map(([path, overlay]) => [path.slice('./components/'.length, -'.json'.length), overlay]),
);
