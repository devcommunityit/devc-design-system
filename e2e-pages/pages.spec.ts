import { expect, open, test } from '../e2e/fixtures';
import { PAGES_BASE } from '../playwright.pages.config';

const url = (path: string) => `${PAGES_BASE}${path.replace(/^\//, '')}`;

test.describe('GitHub Pages (sotto-percorso)', () => {
  test('la home carica asset, script del tema e favicon dal percorso base', async ({ page }) => {
    const response = await page.goto(url('/'));
    expect(response?.status()).toBe(200);
    await page.getByRole('heading', { level: 1 }).first().waitFor();
    await expect(page.locator('script[src$="theme-init.js"]')).toHaveAttribute('src', url('/theme-init.js'));
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', url('/favicon.svg'));
    await expect(page.locator('html')).toHaveAttribute('data-dc-palette', /.+/);
  });

  for (const path of ['/componenti/button', '/guide/temi', '/theme-builder', '/showcase/dashboard', '/showcase/elenco', '/pattern']) {
    test(`link diretto ${path} risponde 200 e mostra la pagina`, async ({ page }) => {
      const response = await page.goto(url(path));
      expect(response?.status()).toBe(200);
      await page.getByRole('heading', { level: 1 }).first().waitFor();
      expect(new URL(page.url()).pathname).toBe(url(path));
    });
  }

  test('la navigazione interna resta sotto il percorso base e sopravvive al ricaricamento', async ({ page }) => {
    await open(page, url('/'));
    await page.getByRole('navigation', { name: 'Documentazione' }).getByRole('link', { name: 'Theme Builder' }).click();
    await expect(page).toHaveURL(new RegExp(`${url('/theme-builder')}$`));
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Theme Builder/i);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Theme Builder/i);
  });

  test('il Theme Builder è interattivo sotto il percorso base', async ({ page }) => {
    await open(page, url('/theme-builder'));
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Theme Builder/i);
    const select = page.getByRole('button', { name: /Preset di partenza/ });
    await select.click();
    const option = page.getByRole('option').nth(4);
    const label = (await option.getAttribute('aria-label')) ?? (await option.locator('[slot="label"]').first().textContent()) ?? '';
    await option.click();
    await expect(select).toContainText(label.trim());
    await expect(page.getByRole('button', { name: 'Ripristina il preset' })).toBeVisible();
  });

  test('i link alle sezioni aggiornano solo il frammento', async ({ page }) => {
    await open(page, url('/guide/installazione'));
    await page.locator('a.docs-anchor').first().click();
    const location = new URL(page.url());
    expect(location.pathname).toBe(url('/guide/installazione'));
    expect(location.hash).not.toBe('');
  });

  test('un percorso sconosciuto risponde 404 con il fallback dell’app', async ({ browser, request }) => {
    const response = await request.get(url('/non-esiste'));
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain(url('/theme-init.js'));
    // Separate page: Chrome logs the document's own 404 status, which is the expected outcome here.
    const page = await browser.newPage();
    const problems: string[] = [];
    page.on('console', (m) => {
      if ((m.type() === 'error' || m.type() === 'warning') && !(m.text().includes('status of 404') && m.location().url.endsWith('/non-esiste'))) {
        problems.push(m.text());
      }
    });
    page.on('pageerror', (error) => problems.push(error.message));
    await page.goto(url('/non-esiste'));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pagina non trovata');
    expect(problems).toEqual([]);
    await page.close();
  });

  test('Storybook è pubblicato accanto al sito e collegato nel footer', async ({ page, request }) => {
    for (const file of ['storybook/', 'storybook/iframe.html', 'storybook/index.json']) {
      const response = await request.get(url(file));
      expect(response.status(), file).toBe(200);
    }
    await open(page, url('/'));
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Storybook' })).toHaveAttribute('href', url('/storybook/'));
  });

  test('Storybook renderizza una storia sotto il percorso base', async ({ browser, request }) => {
    const index = (await (await request.get(url('/storybook/index.json'))).json()) as { entries: Record<string, { id: string; type: string }> };
    const story = Object.values(index.entries).find((e) => e.type === 'story' && e.id.includes('button'));
    expect(story, 'a Button story in index.json').toBeDefined();
    // Storybook's own runtime warnings are not part of this site's console contract.
    const page = await browser.newPage();
    const failed: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(url(`/storybook/iframe.html?id=${story?.id ?? ''}&viewMode=story`));
    await expect(page.locator('#storybook-root').getByRole('button').first()).toBeVisible();
    expect(failed).toEqual([]);
    // From the docs footer: full navigation to the static Storybook, not the SPA 404 route.
    await page.goto(url('/'));
    await page.getByRole('contentinfo').getByRole('link', { name: 'Storybook' }).click();
    await expect(page).toHaveURL(new RegExp(`${url('/storybook/')}`));
    await expect(page).toHaveTitle(/Storybook/i);
    await page.close();
  });
});
