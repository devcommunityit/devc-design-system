import { test, expect, open, expectNoA11yViolations, expectNoHorizontalOverflow } from './fixtures';

test('Kanban drag and drop changes status, reorders and supports explicit controls', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await open(page, '/showcase/kanban');
  const source = page.getByRole('grid', { name: 'Schede Backlog', exact: true });
  const target = page.getByRole('grid', { name: 'Schede In revisione', exact: true });
  await source.getByRole('row', { name: 'Interviste agli utenti', exact: true }).dragTo(target, { sourcePosition: { x: 15, y: 15 } });
  await expect(target.getByRole('row', { name: /Interviste agli utenti/ })).toHaveCount(1);
  await expect(page.getByRole('combobox', { name: 'Stato Interviste agli utenti', exact: true })).toHaveValue('review');
  await expect(page.getByRole('status').filter({ hasText: 'Interviste agli utenti: Backlog → In revisione' })).toBeVisible();
  const doing = page.getByRole('grid', { name: 'Schede In corso', exact: true });
  await target.getByRole('row', { name: 'Interviste agli utenti', exact: true }).dragTo(doing.getByRole('row').first(), { sourcePosition: { x: 15, y: 15 }, targetPosition: { x: 80, y: 2 } });
  await expect(page.getByRole('combobox', { name: 'Stato Interviste agli utenti', exact: true })).toHaveValue('doing');
  await page.getByRole('combobox', { name: 'Stato Interviste agli utenti', exact: true }).selectOption('backlog');
  await expect(source.getByRole('row').first()).toContainText('Definire le metriche');
  await source.getByRole('row', { name: 'Interviste agli utenti', exact: true }).dragTo(source.getByRole('row').first(), { sourcePosition: { x: 15, y: 15 }, targetPosition: { x: 80, y: 2 } });
  await expect(source.getByRole('row').first()).toContainText('Interviste agli utenti');
  await expectNoA11yViolations(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await expectNoHorizontalOverflow(page);
});

test('Kanban keyboard dragging can be cancelled without changing status', async ({ page }) => {
  await open(page, '/showcase/kanban');
  const handle = page.getByRole('button', { name: 'Trascina Interviste agli utenti', exact: true });
  await handle.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('combobox', { name: 'Stato Interviste agli utenti', exact: true })).toHaveValue('backlog');
});

test('Kanban keyboard dragging can move a card to another column', async ({ page }) => {
  await open(page, '/showcase/kanban');
  await page.getByRole('button', { name: 'Trascina Interviste agli utenti', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('grid', { name: 'Schede Da fare', exact: true }).getByRole('row', { name: 'Interviste agli utenti', exact: true })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Stato Interviste agli utenti', exact: true })).toHaveValue('todo');
  await expect(page.getByRole('status').filter({ hasText: 'Interviste agli utenti: Backlog → Da fare' })).toBeVisible();
});
