import { test, expect, open, expectNoA11yViolations, expectNoHorizontalOverflow } from './fixtures';

test('new composite components are discoverable and their examples render', async ({ page }) => {
  test.setTimeout(180_000);
  const components = [
    ['event-calendar', 'EventCalendar'], ['file-browser', 'FileBrowser'], ['form-wizard', 'FormWizard'],
    ['comment-thread', 'CommentThread'], ['diff-viewer', 'DiffViewer'], ['image-cropper', 'ImageCropper'],
    ['image-gallery', 'ImageGallery'], ['onboarding-tour', 'OnboardingTour'], ['permission-matrix', 'PermissionMatrix'],
    ['notification-preferences', 'NotificationPreferences'], ['privacy-preferences', 'PrivacyPreferences'],
  ] as const;
  for (const [slug, name] of components) {
    await open(page, `/componenti/${slug}`);
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    await expect(page.locator('.docs-example-preview').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test('image cropper draws a source-pixel selection and exports it', async ({ page }) => {
  await open(page, '/componenti/image-cropper');
  const image = page.getByRole('img', { name: 'Cerchio su sfondo blu' });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element) => element instanceof HTMLImageElement ? element.naturalWidth : 0)).toBe(480);
  await image.scrollIntoViewIfNeeded();
  const box = await image.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Cropper image has no visible bounds.');
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.75, { steps: 8 });
  await page.mouse.up();
  const width = Number(await page.getByLabel('Larghezza ritaglio').inputValue());
  const height = Number(await page.getByLabel('Altezza ritaglio').inputValue());
  expect(width).toBeGreaterThanOrEqual(238);
  expect(width).toBeLessThanOrEqual(243);
  expect(height).toBeGreaterThanOrEqual(158);
  expect(height).toBeLessThanOrEqual(163);
  await page.getByRole('button', { name: 'Ritaglia immagine' }).click();
  await expect(page.getByText(`Ritaglio: ${width} × ${height} px`)).toBeVisible();
  await expectNoA11yViolations(page);
});

test('gallery and onboarding are navigable and dismissible with the keyboard', async ({ page }) => {
  await open(page, '/componenti/image-gallery');
  await page.getByRole('button', { name: 'Apri immagine Campione blu' }).click();
  await expect(page.getByRole('dialog', { name: 'Blu' })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog', { name: 'Verde' })).toBeVisible();
  await expectNoA11yViolations(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await open(page, '/componenti/onboarding-tour');
  await page.getByRole('button', { name: 'Avvia guida' }).click();
  await expect(page.getByRole('dialog', { name: 'Benvenuto' })).toBeVisible();
  await page.getByRole('button', { name: 'Avanti' }).click();
  await expect(page.getByRole('dialog', { name: 'Azione' })).toBeVisible();
  await expectNoA11yViolations(page);
  await page.getByRole('button', { name: 'Salta guida' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('privacy controls require an explicit choice for optional categories', async ({ page }) => {
  await open(page, '/componenti/privacy-preferences');
  const optional = page.getByRole('checkbox', { name: 'Statistiche' });
  await expect(optional).not.toBeChecked();
  await page.getByRole('button', { name: 'Accetta tutti' }).click();
  await expect(optional).toBeChecked();
  await expect(page.getByText('Salvato: essential, analytics')).toBeVisible();
  await page.getByRole('button', { name: 'Rifiuta facoltativi' }).click();
  await expect(optional).not.toBeChecked();
  await expect(page.getByText('Salvato: essential', { exact: true })).toBeVisible();
  await expectNoA11yViolations(page);
});
