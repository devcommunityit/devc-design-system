import '@dev-community/ui/reset.css';
import '@dev-community/ui/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { BASE_URL, ROUTER_BASENAME } from './base';
import './docs.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

// Static hosts (GitHub Pages) redirect `/route` to `/route/` when the route is a folder with index.html:
// restore the canonical URL without the trailing slash before the router reads it.
const { pathname, search, hash } = window.location;
if (pathname.length > BASE_URL.length && pathname.endsWith('/')) {
  window.history.replaceState(window.history.state, '', `${pathname.replace(/\/+$/, '')}${search}${hash}`);
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);