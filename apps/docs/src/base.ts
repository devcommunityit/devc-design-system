/**
 * Deployment base path. `/` in development and for root deployments; `/<repo>/` on GitHub Pages
 * project sites (set at build time via `DOCS_BASE`, see vite.config.ts). Always ends with `/`.
 */
export const BASE_URL = import.meta.env.BASE_URL;

/** react-router `basename`: the base path without the trailing slash (`/` stays `/`). */
export const ROUTER_BASENAME = BASE_URL.replace(/\/$/, '') || '/';

/** Router-relative path of the static Storybook published next to the site (only in Pages builds). */
export const STORYBOOK_PATH = '/storybook/';
export const HAS_STORYBOOK = import.meta.env.VITE_STORYBOOK === 'true';

function isStatic(appPath: string): boolean {
  return appPath === '/storybook' || appPath.startsWith(STORYBOOK_PATH);
}

const APP_PATHS = ['/', '/componenti', '/foundations', '/guide', '/pattern', '/showcase', '/theme-builder', '/theme-designer'];

/**
 * Maps a browser pathname to a router path, or `null` when it is outside the SPA
 * (another base path, or static content such as Storybook that the browser must load itself).
 * Internal links authored from the domain root also map to the app when deployed under a base path.
 */
export function toAppPath(pathname: string): string | null {
  const isUnderBase = pathname === ROUTER_BASENAME || pathname.startsWith(BASE_URL);
  const isRootAppPath =
    BASE_URL !== '/' &&
    APP_PATHS.some((path) => path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`));
  if (!isUnderBase && !isRootAppPath) return null;
  const appPath = isUnderBase ? `/${pathname.slice(BASE_URL.length)}` : pathname;
  return isStatic(appPath) ? null : appPath;
}

/** True for router paths (e.g. `/storybook/`) that must be loaded with a full page navigation. */
export function isStaticAppPath(path: string): boolean {
  return isStatic(new URL(path, 'http://app.invalid/').pathname);
}
