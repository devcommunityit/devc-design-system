import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Route, Routes, useHref, useLocation, useNavigate } from 'react-router';
import { LocaleProvider, RouterProvider, Spinner, ThemeProvider, ToastProvider, builtInMessages } from '@dev-community/ui';
import { BASE_URL, isStaticAppPath } from './base';
import { DocsLayout } from './components/DocsLayout';
import { DOCS_DEFAULT_LOOK, DOCS_DEFAULT_THEME } from './docs-defaults';
import { DocsSettingsProvider, docsLocale, useDocsSettings } from './settings';
import { Home } from './pages/Home';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { GuidePage } from './pages/GuidePage';
import { FoundationPage } from './pages/FoundationPage';
import { NotFound } from './pages/NotFound';
import { PatternsIndex } from './pages/PatternsIndex';
import { useLinkInterception } from './useLinkInterception';

const ThemeBuilder = lazy(() => import('./theme-builder/ThemeBuilder').then((m) => ({ default: m.ThemeBuilder })));
const ThemeDesigner = lazy(() => import('./theme-designer/ThemeDesigner').then((m) => ({ default: m.ThemeDesigner })));
const Showcase = lazy(() => import('./showcase/ShowcaseRoutes').then((m) => ({ default: m.ShowcaseRoutes })));

function Localized({ children }: { children: ReactNode }) {
  const { language, rtl } = useDocsSettings();
  const isRtl = rtl || language === 'ar';
  const locale = rtl && language !== 'ar' ? 'ar-EG' : docsLocale(language);
  useEffect(() => {
    document.documentElement.lang = rtl ? 'ar' : language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, rtl, isRtl]);
  return (
    <LocaleProvider locale={locale} messages={builtInMessages[language]}>
      {children}
    </LocaleProvider>
  );
}

/**
 * react-router's useHref resolves every value as a route path, which would turn
 * `https://example.com` into `/current/https:/example.com`. External URLs pass through.
 */
function useRouterHref(href: string): string {
  const isExternal = /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//');
  const resolved = useHref(isExternal ? '.' : href);
  return isExternal ? href : resolved;
}

function Loading() {
  return (
    <div className="docs-loading">
      <Spinner label="Caricamento" />
    </div>
  );
}

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useLinkInterception();
  const routerNavigate = (path: string) => {
    // Static content published next to the SPA (Storybook) is not a route.
    if (isStaticAppPath(path)) {
      window.location.assign(`${BASE_URL}${path.replace(/^\//, '')}`);
      return;
    }
    // Router paths are relative to the base path: compare against the router location, not window.location.
    const current = new URL(`${location.pathname}${location.search}`, 'http://app.invalid');
    const url = new URL(path, current);
    // Same-page fragment: let the browser scroll to (and move the focus start point to) the target.
    if (url.pathname === current.pathname && url.search === current.search && url.hash) {
      window.location.hash = url.hash;
      return;
    }
    void navigate(path);
  };
  return (
    <RouterProvider navigate={routerNavigate} useHref={useRouterHref}>
      <ThemeProvider
        applyToDocument
        persistence={{ keys: ['mode', 'theme', 'density', 'look'] }}
        defaultMode="system"
        defaultTheme={DOCS_DEFAULT_THEME}
        defaultLook={DOCS_DEFAULT_LOOK}
      >
        <DocsSettingsProvider>
          <Localized>
            <ToastProvider>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="showcase/*" element={<Showcase />} />
                  <Route element={<DocsLayout />}>
                    <Route index element={<Home />} />
                    <Route path="guide/:slug" element={<GuidePage />} />
                    <Route path="foundations/:slug" element={<FoundationPage />} />
                    <Route path="componenti" element={<ComponentsIndex />} />
                    <Route path="componenti/:slug" element={<ComponentPage />} />
                    <Route path="theme-builder" element={<ThemeBuilder />} />
                    <Route path="theme-designer" element={<ThemeDesigner />} />
                    <Route path="pattern" element={<PatternsIndex />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </ToastProvider>
          </Localized>
        </DocsSettingsProvider>
      </ThemeProvider>
    </RouterProvider>
  );
}