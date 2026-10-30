import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * Client-side navigations do not scroll by themselves: new pages start at the top and
 * `#fragment` links (sections, examples) scroll to their target once it is rendered,
 * including content that appears later through Suspense.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!hash) {
      if (navigationType !== 'POP') window.scrollTo({ top: 0 });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const reveal = () => {
      const target = document.getElementById(id);
      if (!target) return false;
      target.scrollIntoView({ block: 'start' });
      return true;
    };
    if (reveal()) return;
    const observer = new MutationObserver(() => {
      if (reveal()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [pathname, hash, navigationType]);
}
