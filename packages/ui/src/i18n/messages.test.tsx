import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, getInitials } from '../components/Avatar';
import { FileUpload } from '../components/FileUpload';
import { Pagination } from '../components/Pagination';
import { PasswordInput } from '../components/PasswordInput';
import { parseThemeJson } from '../theme/createTheme';
import type { ThemeIssueCode } from '../theme/types';
import { LocaleProvider, useLocale } from './LocaleProvider';
import { builtInMessages, getDefaultMessages, type BuiltInLanguage } from './builtIn';
import { formatThemeIssue, getCoreMessages, type Messages } from './messages';
import { pluralCategory } from './plural';

const LANGUAGES: BuiltInLanguage[] = ['en', 'it', 'es', 'fr', 'de', 'pt', 'ar'];

const ISSUE_CODES: ThemeIssueCode[] = [
  'invalid_json',
  'too_large',
  'invalid_type',
  'missing_field',
  'unsupported_version',
  'invalid_version',
  'unknown_key',
  'unknown_token',
  'unknown_preset',
  'invalid_name',
  'reserved_name',
  'invalid_color',
  'invalid_length',
  'invalid_font_family',
  'invalid_label',
];

/** Calls every function message with representative arguments. */
function renderFunctions(m: Messages): string[] {
  return [
    m.remove('Rome'),
    m.selectedCount(0),
    m.selectedCount(1),
    m.selectedCount(3),
    m.goToPage(2),
    m.pageOf(2, 5),
    m.rangeOf(1, 10, 42),
    m.stepOf(1, 3),
    m.moreItems(4),
    m.fileConstraints({ accept: '.pdf', maxSize: '5 MB', maxFiles: 1 }),
    m.fileConstraints({ maxFiles: 3 }),
    m.fileTooLarge('a.pdf', '5 MB'),
    m.fileInvalidType('a.exe'),
    m.tooManyFiles(1),
    m.tooManyFiles(3),
    ...Object.values(m.fileStatus),
    m.filesSelected(1),
    m.filesSelected(7),
    m.accountMenu('Giulia'),
    m.authPasswordTooShort(12),
    m.authPasswordHint(12),
    m.pinDigit(1, 6),
    m.ratingValue(1, 5),
    m.ratingValue(4, 5),
    m.moveUp('Item'),
    m.moveDown('Item'),
    m.itemMoved('Item', 2, 5),
    m.notificationsUnread(0),
    m.notificationsUnread(1),
    m.notificationsUnread(9),
    m.markAsRead('Report'),
    ...ISSUE_CODES.map((code) => m.themeIssue[code]({ value: '"x"', version: 9, supported: 1, allowed: ['aurora'], limitKb: 64, expected: 'string' })),
  ];
}

describe('built-in message bundles', () => {
  const reference = Object.keys(builtInMessages.en).sort();

  it.each(LANGUAGES)('%s has every key with non-empty strings', (lang) => {
    const bundle = builtInMessages[lang];
    expect(Object.keys(bundle).sort()).toEqual(reference);
    expect(Object.keys(bundle.themeIssue).sort()).toEqual([...ISSUE_CODES].sort());
    for (const [key, value] of Object.entries(bundle)) {
      if (typeof value === 'string') expect(value.trim(), `${lang}.${key}`).not.toBe('');
    }
    for (const text of renderFunctions(bundle)) {
      expect(text.trim()).not.toBe('');
      expect(text).not.toMatch(/undefined|NaN|\[object/);
    }
  });

  it('non-English bundles are actually translated', () => {
    for (const lang of LANGUAGES.filter((l) => l !== 'en')) {
      expect(builtInMessages[lang].close, lang).not.toBe(builtInMessages.en.close);
      expect(builtInMessages[lang].noResults, lang).not.toBe(builtInMessages.en.noResults);
    }
  });

  it('resolves bundles by language subtag with an English fallback', () => {
    expect(getDefaultMessages('es-MX')).toBe(builtInMessages.es);
    expect(getDefaultMessages('pt-PT')).toBe(builtInMessages.pt);
    expect(getDefaultMessages('de-AT')).toBe(builtInMessages.de);
    expect(getDefaultMessages('fr-CA')).toBe(builtInMessages.fr);
    expect(getDefaultMessages('ar-EG')).toBe(builtInMessages.ar);
    expect(getDefaultMessages('ja-JP')).toBe(builtInMessages.en);
    expect(getDefaultMessages('constructor')).toBe(builtInMessages.en);
  });

  it('LocaleProvider defaults ship only the core bundles (it, en)', () => {
    expect(getCoreMessages('it-CH')).toBe(builtInMessages.it);
    expect(getCoreMessages('en-GB')).toBe(builtInMessages.en);
    expect(getCoreMessages('de-DE')).toBe(builtInMessages.en);
  });
});

describe('plurals', () => {
  it('follow CLDR rules instead of comparing with 1', () => {
    expect([0, 1, 2, 5, 11, 100].map((n) => pluralCategory('ar', n))).toEqual(['zero', 'one', 'two', 'few', 'many', 'other']);
    const { ar, fr, de, es } = builtInMessages;
    expect([0, 1, 2, 5, 11, 100].map(ar.filesSelected)).toEqual(['لا توجد ملفات', 'ملف واحد', 'ملفان', '5 ملفات', '11 ملفًا', '100 ملف']);
    // French treats 0 and 1 as singular.
    expect(fr.filesSelected(0)).toBe('0 fichier');
    expect(fr.filesSelected(2)).toBe('2 fichiers');
    expect(de.filesSelected(1)).toBe('1 Datei');
    expect(de.filesSelected(0)).toBe('0 Dateien');
    expect(es.selectedCount(1)).toBe('1 seleccionado');
    expect(es.selectedCount(2)).toBe('2 seleccionados');
  });
});

describe('formatThemeIssue', () => {
  it('localizes parse errors with their parameters', () => {
    const bad = parseThemeJson('{ not json');
    expect(bad.success).toBe(false);
    if (bad.success) return;
    const [issue] = bad.issues;
    expect(issue?.code).toBe('invalid_json');
    if (!issue) return;
    expect(formatThemeIssue(issue, builtInMessages.it)).toBe('Il file non è un JSON valido.');
    expect(formatThemeIssue(issue, builtInMessages.de)).toBe('Die Datei ist kein gültiges JSON.');

    const future = parseThemeJson(JSON.stringify({ schemaVersion: 99, name: 'acme' }));
    expect(future.success).toBe(false);
    if (future.success) return;
    const versionIssue = future.issues.find((i) => i.code === 'unsupported_version');
    expect(versionIssue?.params).toEqual({ version: 99, supported: 1 });
    if (!versionIssue) return;
    expect(formatThemeIssue(versionIssue, builtInMessages.fr)).toContain('99');
    expect(formatThemeIssue(versionIssue, builtInMessages.es)).toMatch(/versión de esquema 99 .*máximo 1/);
  });
});

describe('components under built-in locales', () => {
  it('use German strings and plural forms', () => {
    render(
      <LocaleProvider locale="de-DE" messages={builtInMessages.de}>
        <PasswordInput label="Passwort" />
        <Pagination totalPages={4} />
        <FileUpload label="Anhänge" maxFiles={1} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Passwort anzeigen' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Seitennavigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nächste Seite' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dateien durchsuchen' })).toHaveAccessibleDescription(/bis zu 1 Datei$/);
  });

  it('use Arabic strings and right-to-left direction', () => {
    function Direction() {
      return <output>{useLocale().direction}</output>;
    }
    render(
      <LocaleProvider locale="ar-EG" messages={builtInMessages.ar}>
        <Direction />
        <Pagination totalPages={4} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('rtl');
    expect(screen.getByRole('navigation', { name: 'ترقيم الصفحات' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'الصفحة التالية' })).toBeInTheDocument();
  });

  it('upper-cases avatar initials with the provider locale', () => {
    expect(getInitials('ilker yılmaz', 'tr-TR')).toBe('İY');
    expect(getInitials('ilker yılmaz', 'en-US')).toBe('IY');
    render(
      <LocaleProvider locale="tr-TR">
        <Avatar name="ilker irmak" />
      </LocaleProvider>,
    );
    expect(screen.getByText('İİ')).toBeInTheDocument();
  });
});
