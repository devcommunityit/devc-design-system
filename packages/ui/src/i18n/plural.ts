const cache = new Map<string, Intl.PluralRules>();

/** CLDR plural category for `count` in `language`. Rules are created lazily, never at import time. */
export function pluralCategory(language: string, count: number): Intl.LDMLPluralRule {
  let rules = cache.get(language);
  if (!rules) {
    rules = new Intl.PluralRules(language);
    cache.set(language, rules);
  }
  return rules.select(count);
}

/** Picks a form by plural category; `other` is the required fallback. */
export function plural(language: string, count: number, forms: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }): string {
  return forms[pluralCategory(language, count)] ?? forms.other;
}
