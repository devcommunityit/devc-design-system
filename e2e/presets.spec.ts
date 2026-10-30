import { PRESET_NAMES } from '../packages/ui/src/tokens/generated';
import { expect, expectNoA11yViolations, open, test } from './fixtures';

/** Every built-in preset, in both schemes, on pages that exercise most color roles. */
const paths = ['/showcase/dashboard', '/showcase/modulo', '/componenti/alert', '/componenti/calendar'];

for (const preset of PRESET_NAMES) {
  for (const scheme of ['light', 'dark'] as const) {
    test.describe(`axe, preset ${preset} ${scheme}`, () => {
      test.use({ colorScheme: scheme });
      for (const path of paths) {
        test(path, async ({ page }) => {
          await page.addInitScript((theme) => localStorage.setItem('dc-theme', JSON.stringify({ theme })), preset);
          await open(page, path);
          await expect(page.locator('html')).toHaveAttribute('data-dc-palette', preset);
          await expectNoA11yViolations(page);
        });
      }
    });
  }
}
