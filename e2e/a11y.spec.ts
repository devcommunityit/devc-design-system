import { DOC_PAGES, SHOWCASE_PAGES, componentSlugs, expect, expectNoA11yViolations, guideSlugs, open, test } from './fixtures';

/**
 * Automated checks only: they catch a subset of WCAG failures (names, roles, contrast of rendered
 * pairs, ARIA misuse). Keyboard, focus and overlay behaviour are covered by the other specs;
 * conformance still requires manual review (see /guide/accessibilita).
 */
const pages = [
  ...new Set([
    ...DOC_PAGES,
    ...guideSlugs().map((slug) => `/guide/${slug}`),
    ...SHOWCASE_PAGES.map((slug) => `/showcase/${slug}`),
    ...componentSlugs().map((slug) => `/componenti/${slug}`),
  ]),
];

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`axe, tema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of pages) {
      test(path, async ({ page }) => {
        await open(page, path);
        await expect(page.locator('html')).toHaveAttribute('data-dc-resolved-scheme', scheme);
        await expectNoA11yViolations(page);
      });
    }
  });
}
