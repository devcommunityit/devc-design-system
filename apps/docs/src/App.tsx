import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Route, Routes, useHref, useNavigate } from 'react-router';
import { LocaleProvider, RouterProvider, Spinner, ThemeProvider, ToastProvider, messagesEn, messagesIt } from '@dev-community/ui';
import { DocsLayout } from './components/DocsLayout';
import { DocsSettingsProvider, useDocsSettings } from './settings';
import { Home } from './pages/Home';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { GuidePage } from './pages/GuidePage';
import { NotFound } from './pages/NotFound';
import { PatternsIndex } from './pages/PatternsIndex';
import { useLinkInterception } from './useLinkInterception';

const ThemeBuilder = lazy(() => import('./theme-builder/ThemeBuilder').then((m) => ({ default: m.ThemeBuilder })));
const Showcase = lazy(() => import('./showcase/ShowcaseRoutes').then((m) => ({ default: m.ShowcaseRoutes })));

function Localized({ children }: { children: ReactNode }) {
  const { language, rtl } = useDocsSettings();
  const locale = rtl ? 'ar-EG' : language === 'it' ? 'it-IT' : 'en-US';
  useEffect(() => {
    document.documentElement.lang = rtl ? 'ar' : language;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  }, [language, rtl]);
  return (
    <LocaleProvider locale={locale} messages={language === 'it' ? messagesIt : messagesEn}>
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
  useLinkInterception();
  const routerNavigate = (path: string) => {
    const url = new URL(path, window.location.href);
    // Same-page fragment: let the browser scroll to (and move the focus start point to) the target.
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
      window.location.hash = url.hash;
      return;
    }
    void navigate(path);
  };
  return (
    <RouterProvider navigate={routerNavigate} useHref={useRouterHref}>
      <ThemeProvider applyToDocument persistence={{ keys: ['mode', 'theme', 'density'] }} defaultMode="system">
        <DocsSettingsProvider>
          <Localized>
            <ToastProvider>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="showcase/*" element={<Showcase />} />
                  <Route element={<DocsLayout />}>
                    <Route index element={<Home />} />
                    <Route path="guide/:slug" element={<GuidePage />} />
                    <Route path="componenti" element={<ComponentsIndex />} />
                    <Route path="componenti/:slug" element={<ComponentPage />} />
                    <Route path="theme-builder" element={<ThemeBuilder />} />
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