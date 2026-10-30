import type { Locator, Page } from '@playwright/test';
import { expect, expectNoA11yViolations, expectNoHorizontalOverflow, open, test } from './fixtures';

async function isFocused(locator: Locator): Promise<boolean> {
  return locator.evaluate((el) => el === document.activeElement);
}

async function scrollLocked(page: Page): Promise<boolean> {
  return page.evaluate(() => getComputedStyle(document.documentElement).overflow === 'hidden' || getComputedStyle(document.body).overflow === 'hidden');
}

async function openPreferences(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: 'Preferenze di visualizzazione' }).click();
  const dialog = page.getByRole('dialog', { name: 'Preferenze' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe('navigazione mobile', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('il drawer della documentazione si apre, contiene il focus, si chiude con Escape e naviga', async ({ page }) => {
    await open(page, '/');
    const menuButton = page.getByRole('button', { name: 'Apri menu' });
    await menuButton.click();
    const drawer = page.getByRole('dialog', { name: 'Documentazione' });
    await expect(drawer).toBeVisible();
    expect(await drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    expect(await scrollLocked(page)).toBe(true);

    for (let i = 0; i < 40; i++) await page.keyboard.press('Tab');
    expect(await drawer.evaluate((el) => el.contains(document.activeElement)), 'focus stays inside the modal drawer').toBe(true);

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect.poll(() => isFocused(page.getByRole('button', { name: 'Apri menu' }))).toBe(true);

    await page.getByRole('button', { name: 'Apri menu' }).click();
    await drawer.getByRole('link', { name: 'Theme Builder' }).click();
    await expect(page).toHaveURL(/\/theme-builder$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Theme Builder' })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Documentazione' })).toBeHidden();
    await expectNoHorizontalOverflow(page);
  });

  test('il SiteHeader della landing apre il menu mobile e segue le ancore', async ({ page }) => {
    await open(page, '/showcase/landing');
    await page.getByRole('button', { name: 'Apri menu' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    const firstLink = drawer.getByRole('link').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toContain('#');
    await firstLink.click();
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${(href ?? '').replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}$`));
  });

  test('il portale dimostrativo usa la barra laterale nel drawer', async ({ page }) => {
    await open(page, '/showcase/dashboard');
    await page.getByRole('button', { name: 'Apri menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Clienti' }).click();
    await expect(page).toHaveURL(/\/showcase\/elenco$/);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe('ricerca e collegamenti', () => {
  test('Ctrl+K apre la ricerca e porta alla pagina scelta', async ({ page }) => {
    await open(page, '/');
    await page.keyboard.press('Control+k');
    const palette = page.getByRole('dialog');
    await expect(palette).toBeVisible();
    await page.keyboard.type('DatePicker');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/componenti\/date-picker$/);
  });

  test('i collegamenti interni della documentazione portano a pagine esistenti e ad ancore presenti', async ({ page }) => {
    test.setTimeout(240_000);
    const seeds = ['/', '/componenti', '/pattern', '/guide/quick-start', '/guide/integrazione', '/guide/temi', '/guide/personalizzazione', '/guide/contribuire', '/guide/figma', '/componenti/dialog'];
    const targets = new Set<string>();
    for (const seed of seeds) {
      await open(page, seed);
      const hrefs = await page.locator('a[href^="/"], a[href^="#"]').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
      for (const href of hrefs) {
        expect(href, `external URL rewritten as a route on ${seed}`).not.toMatch(/\/[a-z]+:\//i);
        targets.add(href.startsWith('#') ? `${seed}${href}` : href);
      }
    }
    const broken: string[] = [];
    for (const target of targets) {
      const [path = '/', hash] = target.split('#');
      await open(page, path);
      if ((await page.getByRole('heading', { level: 1, name: 'Pagina non trovata' }).count()) > 0) broken.push(target);
      else if (hash) {
        const anchor = page.locator(`[id="${decodeURIComponent(hash)}"]`);
        const found = await anchor.first().waitFor({ state: 'attached', timeout: 5_000 }).then(() => true, () => false);
        if (!found) broken.push(`${target} (anchor missing)`);
      }
    }
    expect(broken).toEqual([]);
    expect(targets.size).toBeGreaterThan(50);
  });

  test('gli indirizzi sconosciuti mostrano la pagina 404', async ({ page }) => {
    await open(page, '/non-esiste');
    await expect(page.getByRole('heading', { level: 1, name: 'Pagina non trovata' })).toBeVisible();
    await expect(page).toHaveTitle(/Pagina non trovata/);
    await open(page, '/showcase/non-esiste');
    await expect(page.getByRole('heading', { level: 1, name: 'Pagina non trovata' })).toBeVisible();
  });
});

test.describe('tema, persistenza e RTL', () => {
  test.use({ colorScheme: 'light' });

  test('modalità, palette e densità sono applicate e salvate', async ({ page }) => {
    await open(page, '/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-dc-resolved-scheme', 'light');
    const prefs = await openPreferences(page);
    await prefs.getByRole('radio', { name: 'Scuro' }).or(prefs.getByRole('button', { name: 'Scuro' })).click();
    await expect(html).toHaveAttribute('data-dc-resolved-scheme', 'dark');
    await expect(html).toHaveAttribute('data-dc-scheme', 'dark');

    const before = await html.getAttribute('data-dc-palette');
    await prefs.getByRole('button', { name: /Palette/ }).click();
    const options = page.getByRole('option');
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      if ((await options.nth(i).getAttribute('data-key')) !== before && (await options.nth(i).getAttribute('aria-selected')) !== 'true') {
        await options.nth(i).click();
        break;
      }
    }
    await expect(html).not.toHaveAttribute('data-dc-palette', before ?? '');
    const palette = await html.getAttribute('data-dc-palette');
    await prefs.getByRole('switch', { name: 'Densità compatta' }).check({ force: true });
    await expect(html).toHaveAttribute('data-dc-density', 'compact');

    await page.reload();
    await page.getByRole('heading', { level: 1 }).first().waitFor();
    await expect(html).toHaveAttribute('data-dc-resolved-scheme', 'dark');
    await expect(html).toHaveAttribute('data-dc-palette', palette ?? '');
    await expect(html).toHaveAttribute('data-dc-density', 'compact');
  });

  test('lo stile espressivo è indipendente dalla palette, si salva e arriva agli overlay in portal', async ({ page }) => {
    await open(page, '/componenti/button');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-dc-look', 'expressive');
    const primary = page.locator('main button[data-variant="primary"]').first();
    const box = await primary.boundingBox();
    const gradients = (el: Element) => getComputedStyle(el).backgroundImage.split('gradient(').length - 1;
    expect(await primary.evaluate(gradients), 'state layer + two-tone fill').toBe(2);

    const prefs = await openPreferences(page);
    const portal = prefs.locator('xpath=ancestor::*[@data-dc-portal][1]');
    await expect(portal).toHaveAttribute('data-dc-look', 'expressive');
    const palette = await html.getAttribute('data-dc-palette');
    await prefs.getByRole('switch', { name: /Stile espressivo/ }).uncheck({ force: true });
    await expect(html).toHaveAttribute('data-dc-look', 'standard');
    await expect(portal).toHaveAttribute('data-dc-look', 'standard');
    await expect(html).toHaveAttribute('data-dc-palette', palette ?? '');
    await page.keyboard.press('Escape');
    await expect(prefs).toBeHidden();

    expect(await primary.evaluate(gradients), 'state layer only').toBe(1);
    const standardBox = await primary.boundingBox();
    expect(standardBox?.height).toBe(box?.height);
    expect(standardBox?.width).toBe(box?.width);
    await expectNoA11yViolations(page);

    await page.reload();
    await page.getByRole('heading', { level: 1 }).first().waitFor();
    await expect(html).toHaveAttribute('data-dc-look', 'standard');
  });
  test('il cambio di palette mantiene struttura e dimensioni', async ({ page }) => {
    await open(page, '/componenti/button');
    const sample = page.locator('main button[data-variant="primary"]').first();
    const before = await sample.boundingBox();
    const bgBefore = await sample.evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.evaluate(() => {
      const next = document.documentElement.getAttribute('data-dc-palette') === 'ember' ? 'lagoon' : 'ember';
      for (const el of [document.documentElement, ...document.querySelectorAll('[data-dc-theme]')]) el.setAttribute('data-dc-palette', next);
    });
    const after = await sample.boundingBox();
    expect(after).toEqual(before);
    expect(await sample.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(bgBefore);
  });

  test('RTL inverte la direzione senza overflow, anche su mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 });
    await open(page, '/');
    const prefs = await openPreferences(page);
    await prefs.getByRole('switch', { name: 'Anteprima RTL' }).check({ force: true });
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.keyboard.press('Escape');
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: /menu/i }).first().click();
    const drawer = page.getByRole('dialog').first();
    await expect(drawer).toBeVisible();
    const box = await drawer.boundingBox();
    const width = page.viewportSize()?.width ?? 0;
    expect(box && box.x + box.width).toBeGreaterThan(width - 2);
  });

  test('la lingua dei testi di sistema cambia le etichette della libreria; l’arabo attiva RTL', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 });
    await open(page, '/');
    await expect(page.getByRole('button', { name: 'Apri menu' })).toBeVisible();
    let prefs = await openPreferences(page);
    await prefs.getByRole('button', { name: /Lingua dei testi di sistema/ }).click();
    await page.getByRole('option', { name: 'Deutsch' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Menü öffnen' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    prefs = await openPreferences(page);
    await prefs.getByRole('button', { name: /Lingua dei testi di sistema/ }).click();
    await page.getByRole('option', { name: 'العربية' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'فتح القائمة' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expectNoHorizontalOverflow(page);
  });
});

test.describe('overlay', () => {
  test('dialoghi annidati: focus iniziale, Escape un livello alla volta, ripristino del focus, scroll bloccato', async ({ page }) => {
    await open(page, '/componenti/dialog');
    const openFirst = page.getByRole('button', { name: 'Apri primo livello' });
    await openFirst.click();
    const first = page.getByRole('dialog', { name: 'Primo livello' });
    await expect(first).toBeVisible();
    expect(await first.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    expect(await scrollLocked(page)).toBe(true);

    const openSecond = first.getByRole('button', { name: 'Apri secondo livello' });
    await openSecond.press('Enter');
    const second = page.getByRole('dialog', { name: 'Secondo livello' });
    await expect(second).toBeVisible();
    expect(await second.evaluate((el) => el.contains(document.activeElement))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(second).toBeHidden();
    await expect(first).toBeVisible();
    await expect.poll(() => isFocused(openSecond)).toBe(true);

    await page.keyboard.press('Escape');
    await expect(first).toBeHidden();
    await expect.poll(() => isFocused(openFirst)).toBe(true);
    expect(await scrollLocked(page)).toBe(false);
  });

  test('AlertDialog e Drawer ripristinano il focus sull’attivatore', async ({ page }) => {
    for (const slug of ['alert-dialog', 'drawer']) {
      await open(page, `/componenti/${slug}`);
      const trigger = page.locator('main .docs-example button').first();
      await trigger.click();
      const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog')).first();
      await expect(dialog).toBeVisible();
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect.poll(() => isFocused(trigger)).toBe(true);
    }
  });

  test('gli overlay in portal ereditano il tema del provider annidato (Theme Builder)', async ({ page }) => {
    await open(page, '/theme-builder');
    await expect(page.locator('html')).toHaveAttribute('data-dc-resolved-scheme', 'light');
    const preview = page.locator('.tb-preview[data-scheme="dark"]');
    await expect(preview).toHaveAttribute('data-dc-resolved-scheme', 'dark');
    const palette = await preview.getAttribute('data-dc-palette');

    const inheritsFrom = async (overlay: Locator) =>
      overlay.evaluate((el) => {
        const host = el.closest('[data-dc-portal]');
        return host ? { scheme: host.getAttribute('data-dc-resolved-scheme'), palette: host.getAttribute('data-dc-palette') } : null;
      });

    await preview.getByRole('button', { name: 'Apri dialogo' }).click();
    const dialog = page.getByRole('dialog', { name: /Dialogo nel tema/ });
    await expect(dialog).toBeVisible();
    expect(await inheritsFrom(dialog)).toEqual({ scheme: 'dark', palette });
    const surface = await dialog.evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    await preview.getByRole('button', { name: 'Notifiche' }).click();
    const popover = page.getByRole('dialog', { name: 'Notifiche' });
    await expect(popover).toBeVisible();
    expect(await inheritsFrom(popover)).toEqual({ scheme: 'dark', palette });
    await page.keyboard.press('Escape');

    await page.locator('.tb-preview[data-scheme="light"]').getByRole('button', { name: 'Apri dialogo' }).click();
    const lightDialog = page.getByRole('dialog', { name: /Dialogo nel tema/ });
    expect((await inheritsFrom(lightDialog))?.scheme).toBe('light');
    expect(await lightDialog.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(surface);
    await page.keyboard.press('Escape');
  });

  test('i tooltip sono raggiungibili da tastiera, non solo con hover', async ({ page }) => {
    await open(page, '/componenti/tooltip');
    const trigger = page.locator('main .docs-example button').first();
    // Tooltips open on keyboard focus (focus-visible), so reach the trigger with Tab.
    await trigger.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect.poll(() => isFocused(trigger)).toBe(true);
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).toBeHidden();
  });
});

test.describe('Theme Builder: importazione', () => {
  const paste = async (page: Page, text: string) => {
    await page.getByLabel('Oppure incolla il JSON').fill(text);
    await page.getByRole('button', { name: 'Importa dal testo' }).click();
  };

  test('JSON non valido, schema sconosciuto e valori CSS non ammessi sono rifiutati con errori comprensibili', async ({ page }) => {
    await open(page, '/theme-builder');
    const failure = page.getByText('Importazione non riuscita');
    const before = await page.locator('.tb-preview[data-scheme="light"]').getAttribute('data-dc-palette');

    await paste(page, '{ non è json');
    await expect(failure.first()).toBeVisible();
    await paste(page, '{"schemaVersion":99,"name":"futuro"}');
    await expect(failure.first()).toBeVisible();
    await paste(page, '{"schemaVersion":1,"name":"x","colors":{"light":{"text.primary":"red;}body{display:none"}}}');
    await expect(failure.first()).toBeVisible();
    expect(await page.locator('.tb-preview[data-scheme="light"]').getAttribute('data-dc-palette')).toBe(before);
    expect(await page.evaluate(() => getComputedStyle(document.body).display)).not.toBe('none');
  });

  test('un JSON valido viene importato e la configurazione è esportabile', async ({ page }) => {
    await open(page, '/theme-builder');
    await paste(page, '{"schemaVersion":1,"name":"prova-e2e","label":"Prova E2E","extends":"lagoon"}');
    await expect(page.getByText('Tema importato').first()).toBeVisible();
    await expect(page.getByLabel('Identificativo')).toHaveValue('prova-e2e');
    await expect(page.locator('.tb-preview[data-scheme="light"]')).toHaveAttribute('data-dc-palette', 'prova-e2e');
  });
});

test.describe('form e template', () => {
  test('login dimostrativo da tastiera: errori, errore del server simulato, successo', async ({ page }) => {
    await open(page, '/showcase/accesso');
    const submit = page.getByRole('button', { name: 'Accedi', exact: true });
    await submit.click();
    const email = page.getByLabel(/^Email/);
    await expect(email).toHaveAttribute('aria-invalid', 'true');

    await email.focus();
    await page.keyboard.type('giulia@northwind.example');
    await page.keyboard.press('Tab');
    await page.keyboard.type('errata');
    await page.keyboard.press('Enter');
    await expect(page.getByText(/Email o password non corretti/)).toBeVisible();

    await page.getByLabel(/^Password/).fill('una-password-lunga');
    await submit.click();
    await expect(page.getByText('Template dimostrativo')).toBeVisible();
  });

  test('registrazione e recupero password mostrano esiti simulati dichiarati', async ({ page }) => {
    await open(page, '/showcase/accesso?vista=recupero');
    await page.getByLabel(/^Email/).fill('ada@example.com');
    await page.getByRole('button', { name: /Invia|link/i }).first().click();
    await expect(page.getByText(/Simulazione: nessuna email è stata inviata/)).toBeVisible();
  });

  test('il form articolato porta il focus al riepilogo errori e da lì al campo', async ({ page }) => {
    await open(page, '/showcase/modulo');
    await page.getByRole('button', { name: /Invia/ }).last().click();
    const summary = page.locator('#form-errors');
    await expect(summary).toBeVisible();
    await expect.poll(() => isFocused(summary)).toBe(true);
    await summary.getByRole('button').first().click();
    await expect.poll(() => page.evaluate(() => document.activeElement?.closest('[data-field="company"]') !== null)).toBe(true);
    await expect(page.locator('[data-field="company"] input')).toHaveAttribute('aria-invalid', 'true');
  });

  test('menu utente da tastiera: apertura, frecce, Escape con ripristino del focus, uscita', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await open(page, '/showcase/dashboard');
    const trigger = page.getByRole('button', { name: /Giulia Bianchi/ });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await page.keyboard.press('ArrowDown');
    expect(await menu.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect.poll(() => isFocused(trigger)).toBe(true);

    await trigger.click();
    await page.getByRole('menuitem', { name: /Esci/ }).click();
    await expect(page).toHaveURL(/\/showcase\/accesso$/);
  });

  test('DataTable: filtro, nessun risultato e ripristino', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page, '/showcase/elenco');
    const search = page.getByRole('searchbox').first();
    await search.fill('zzzz-nessun-cliente');
    await expect(page.getByText(/Nessun/).first()).toBeVisible();
    await search.fill('');
    await expect(page.getByRole('row').nth(1)).toBeVisible();
  });
});
