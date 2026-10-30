import { expect, expectNoHorizontalOverflow, open, test } from './fixtures';

test('assistente locale: suggerimento, invio da tastiera, fonti e feedback', async ({ page }) => {
  await open(page, '/guide/ai-content');
  await page.getByRole('button', { name: 'Scelta del tema', exact: true }).click();
  const input = page.getByRole('textbox', { name: 'Richiesta all’assistente dimostrativo' });
  await expect(input).toHaveValue('Come posso personalizzare il tema?');
  await input.press('Enter');
  await expect(input).toHaveValue('');
  await expect(page.getByRole('article', { name: 'Tu', exact: true })).toContainText('Come posso personalizzare il tema?');
  const assistant = page.getByRole('article', { name: 'Assistente', exact: true });
  await expect(assistant).toContainText('Risposta dimostrativa');
  await expect(assistant.getByRole('link', { name: 'Guida ai temi' })).toHaveAttribute('href', '/guide/temi');
  const helpful = assistant.getByRole('button', { name: 'Utile', exact: true });
  await helpful.click();
  await expect(helpful).toHaveAttribute('aria-pressed', 'true');
  await helpful.click();
  await expect(helpful).toHaveAttribute('aria-pressed', 'false');
});

test('composer: newline, generazione locale e interruzione', async ({ page }) => {
  await open(page, '/componenti/prompt-composer');
  const basic = page.locator('section[aria-labelledby="esempio-basic"]');
  const input = basic.getByRole('textbox', { name: 'Richiesta di esempio' });
  await input.fill('Prima riga');
  await input.press('Shift+Enter');
  await expect(input).toHaveValue('Prima riga\n');
  const generation = page.locator('section[aria-labelledby="esempio-generationstate"]');
  await generation.getByRole('button', { name: 'Simula generazione' }).click();
  await generation.getByRole('button', { name: 'Interrompi generazione' }).click();
  await expect(generation.getByRole('status')).toHaveText('Stato locale: pronto');
});

test('workflow editoriale e selezione collettiva mantengono stato e focus', async ({ page }) => {
  await open(page, '/componenti/publish-status');
  const workflow = page.locator('section[aria-labelledby="esempio-workflow"]');
  await workflow.getByRole('button', { name: 'Pubblica localmente' }).click();
  await expect(workflow.locator('[data-publish-status]')).toHaveAttribute('data-publish-status', 'published');
  await workflow.getByRole('button', { name: 'Torna a bozza' }).click();
  await expect(workflow.locator('[data-publish-status]')).toHaveAttribute('data-publish-status', 'draft');
  await open(page, '/componenti/bulk-action-bar');
  const basic = page.locator('section[aria-labelledby="esempio-basic"]');
  await basic.getByRole('button', { name: 'Archivia', exact: true }).click();
  await expect(basic.getByRole('group')).toHaveCount(0);
  await expect(basic.getByRole('button', { name: 'Seleziona tre pagine' })).toBeFocused();
  const selection = page.locator('section[aria-labelledby="esempio-withselection"]');
  const homepage = selection.getByRole('checkbox', { name: 'Homepage' });
  await homepage.focus();
  await page.keyboard.press('Space');
  await expect(homepage).toBeChecked();
  await selection.getByRole('button', { name: 'Richiedi revisione' }).click();
  await expect(selection.getByText('Revisione locale richiesta: Homepage')).toBeVisible();
  await selection.getByRole('button', { name: 'Cancella', exact: true }).click();
  await expect(selection.getByRole('group', { name: 'Pagine da selezionare' })).toBeFocused();
});

test('anteprima SEO segue i campi senza modificare il titolo del documento', async ({ page }) => {
  await open(page, '/guide/ai-content');
  const originalTitle = await page.title();
  await page.getByRole('textbox', { name: 'Titolo SEO dimostrativo' }).fill('Nuovo titolo editoriale');
  await page.getByRole('textbox', { name: 'Descrizione SEO dimostrativa' }).fill('Descrizione aggiornata localmente');
  const preview = page.getByRole('figure', { name: 'Anteprima del risultato di ricerca' });
  await expect(preview).toContainText('Nuovo titolo editoriale');
  await expect(preview).toContainText('Descrizione aggiornata localmente');
  expect(await page.title()).toBe(originalTitle);
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test.describe(`AI e CMS a ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });
    for (const path of ['/guide/ai-content', '/componenti/prompt-composer', '/componenti/bulk-action-bar', '/componenti/seo-preview']) {
      test(`nessun overflow: ${path}`, async ({ page }) => {
        await open(page, path);
        await page.locator('.docs-guide-body, .docs-example-preview').first().waitFor();
        await expectNoHorizontalOverflow(page);
      });
    }
  });
}
