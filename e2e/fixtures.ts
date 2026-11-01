import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AxeBuilder } from '@axe-core/playwright';
import { test as base, expect, type Page } from '@playwright/test';

/** Every test fails if the page logs a console error/warning or throws an uncaught exception. */
export const test = base.extend<{ consoleGuard: void }>({
  consoleGuard: [
    async ({ page }, use) => {
      const problems: string[] = [];
      await page.route('https://picsum.photos/**', (route) =>
        route.fulfill({
          contentType: 'image/svg+xml',
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" />',
        }),
      );
      page.on('console', (message) => {
        const text = message.text();
        // The script-disabled preview frame intentionally blocks Axe's injected runner.
        if (text === "Blocked script execution in 'about:srcdoc' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.") return;
        if (message.type() === 'error' || message.type() === 'warning') problems.push(`${message.type()}: ${text}`);
      });
      page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
      await use();
      expect(problems, 'console errors or warnings').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Navigates and waits for the lazily loaded route to render its main heading. */
export async function open(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.getByRole('heading', { level: 1 }).first().waitFor();
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(size.scroll, 'the page must not scroll horizontally').toBeLessThanOrEqual(size.client);
}

/**
 * axe on WCAG 2.0–2.2 A/AA rules, with two targeted exemptions verified per node in the browser:
 * - `color-contrast` on inactive controls, which WCAG 1.4.3 excludes ("text that is part of an
 *   inactive user interface component"); axe skips disabled elements but not every inactive
 *   descendant (e.g. a slider output).
 * - `label-content-name-mismatch` (experimental heuristic) on options whose name is their visible
 *   label and whose extra text is a description linked with aria-describedby: the label is in the
 *   name, so WCAG 2.5.3 is met.
 */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  // Axe cannot inject into intentionally script-disabled frames; their isolation is tested separately.
  const results = await new AxeBuilder({ page })
    .exclude('iframe[sandbox]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const report: string[] = [];
  for (const violation of results.violations) {
    for (const node of violation.nodes) {
      const selector = node.target[0];
      if (typeof selector === 'string' && (await isExempt(page, violation.id, selector))) continue;
      report.push(`${violation.id}: ${node.target.join(' ')} — ${node.failureSummary ?? violation.help}`);
    }
  }
  expect(report, 'axe violations').toEqual([]);
}

async function isExempt(page: Page, rule: string, selector: string): Promise<boolean> {
  const target = page.locator(selector).first();
  if (rule === 'color-contrast') {
    return target.evaluate((el) => el.closest(':disabled, [aria-disabled="true"], [data-disabled]') !== null);
  }
  if (rule === 'label-content-name-mismatch') {
    return target.evaluate((el) => {
      const text = (ids: string | null) =>
        (ids ?? '')
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
          .join(' ')
          .trim();
      const label = text(el.getAttribute('aria-labelledby'));
      const description = text(el.getAttribute('aria-describedby'));
      const visible = (el.textContent ?? '').replace(/\s+/g, '');
      return el.getAttribute('role') === 'option' && label !== '' && description !== '' && visible === `${label}${description}`.replace(/\s+/g, '');
    });
  }
  return false;
}

/** Component slugs read from the metadata files, so a new component page is covered automatically. */
export function componentSlugs(): string[] {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'ui', 'src');
  const slugs: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.meta.ts')) {
        const match = /\bslug:\s*'([^']+)'/.exec(readFileSync(path, 'utf8'));
        if (match?.[1]) slugs.push(match[1]);
      }
    }
  };
  walk(root);
  return slugs.sort();
}

export const SHOWCASE_PAGES = ['dashboard', 'admin', 'kanban', 'elenco', 'dettaglio', 'modulo', 'impostazioni', 'account', 'errori', 'accesso', 'landing'];
export const DOC_PAGES = [
  '/',
  '/componenti',
  '/pattern',
  '/theme-builder',
  '/theme-designer',
  '/guide/quick-start',
  '/guide/temi',
  '/guide/token',
  '/guide/accessibilita',
  '/guide/grafici-dashboard',
  '/guide/stati-di-caricamento',
  '/guide/ai-content',
  '/foundations/typography',
  '/foundations/spacing',
  '/foundations/rounded',
  '/foundations/colors',
  '/foundations/shadows',
];

/** Guide slugs read from the docs registry (apps/docs/src/content/guides.ts). */
export function guideSlugs(): string[] {
  const file = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'docs', 'src', 'content', 'guides.ts');
  return [...readFileSync(file, 'utf8').matchAll(/\{ slug: '([^']+)'/g)].flatMap((m) => (m[1] ? [m[1]] : []));
}