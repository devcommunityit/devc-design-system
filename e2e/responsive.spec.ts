import { DOC_PAGES, SHOWCASE_PAGES, expect, expectNoHorizontalOverflow, open, test } from './fixtures';

const WIDTHS = [320, 375, 768, 1024, 1440];
const pages = [...DOC_PAGES, '/componenti/data-table', '/componenti/dialog', ...SHOWCASE_PAGES.map((slug) => `/showcase/${slug}`)];

for (const width of WIDTHS) {
  test.describe(`${width} CSS px`, () => {
    test.use({ viewport: { width, height: 800 } });
    for (const path of pages) {
      test(`nessun overflow orizzontale globale: ${path}`, async ({ page }) => {
        await open(page, path);
        await expectNoHorizontalOverflow(page);
      });
    }
  });
}

test.describe('zoom e reflow', () => {
  // A 1280px window at 200% zoom lays out at 640 CSS px; at 400% (WCAG 1.4.10 reflow) at 320 CSS px.
  // Chromium has no page-zoom API in Playwright: the CSS viewport is set to the equivalent width
  // with deviceScaleFactor 2, which is what the layout engine sees when zooming.
  for (const width of [640, 320]) {
    test.describe(`${width} CSS px, densità 2x`, () => {
      test.use({ viewport: { width, height: 400 }, deviceScaleFactor: 2 });
      for (const path of ['/', '/theme-builder', '/theme-designer', '/showcase/elenco', '/showcase/modulo', '/showcase/landing']) {
        test(path, async ({ page }) => {
          await open(page, path);
          await expectNoHorizontalOverflow(page);
        });
      }
    });
  }

  for (const path of ['/', '/theme-builder', '/theme-designer', '/showcase/landing', '/showcase/dashboard', '/showcase/modulo', '/showcase/accesso', '/showcase/account']) {
    test(`testo ingrandito al 200% (solo font) senza overflow globale: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await open(page, path);
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      await expectNoHorizontalOverflow(page);
    });
  }

  test('le tabelle scorrono nel proprio contenitore', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await open(page, '/showcase/elenco');
    const table = page.getByRole('grid', { name: 'Clienti' }).or(page.getByRole('table', { name: 'Clienti' })).first();
    await expect(table).toBeVisible();
    const scroller = await table.evaluate((el) => {
      for (let node = el.parentElement; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (/(auto|scroll)/.test(style.overflowX)) return { scroll: node.scrollWidth, client: node.clientWidth };
      }
      return null;
    });
    expect(scroller, 'the table must have its own horizontal scroll container').not.toBeNull();
    await expectNoHorizontalOverflow(page);
  });
});
