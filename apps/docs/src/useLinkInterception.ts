import { useEffect } from 'react';
import { useNavigate } from 'react-router';

/**
 * Turns plain same-origin `<a href>` clicks (e.g. CardLink, links inside guides) into client-side
 * navigations. Library links already use RAC's RouterProvider; this covers native anchors.
 */
export function useLinkInterception() {
  const navigate = useNavigate();
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      event.preventDefault();
      void navigate(`${url.pathname}${url.search}${url.hash}`);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
}