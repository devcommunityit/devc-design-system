import axeCore, { type AxeResults, type RunOptions } from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core on a jsdom container. jsdom cannot compute layout/colors, so
 * color-contrast is disabled here and verified in Playwright against real browsers.
 */
export async function axe(container: Element, options: RunOptions = {}): Promise<AxeResults> {
  return axeCore.run(container, {
    ...options,
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false }, ...options.rules },
  });
}

expect.extend({
  toHaveNoViolations(results: AxeResults) {
    const violations = results.violations;
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? 'Expected axe violations, found none'
          : `Expected no axe violations, found ${violations.length}:\n${violations
              .map((v) => `- [${v.id}] ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`)
              .join('\n')}`,
    };
  },
});

declare module 'vitest' {
  // Type parameters must match vitest 5's own declaration exactly.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    toHaveNoViolations(): R;
  }
}
