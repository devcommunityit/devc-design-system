import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { DiffViewer, diffLines } from './DiffViewer';

describe('DiffViewer', () => {
  it('computes additions, removals and stable line numbers', () => {
    expect(diffLines('a\nb', 'a\nc')).toEqual([
      { kind: 'unchanged', text: 'a', beforeLine: 1, afterLine: 1 },
      { kind: 'removed', text: 'b', beforeLine: 2 },
      { kind: 'added', text: 'c', afterLine: 2 },
    ]);
  });

  it('switches between unified and side-by-side views without interpreting markup', async () => {
    const user = userEvent.setup();
    const { container } = render(<LocaleProvider locale="en-US"><DiffViewer aria-label="Changes" before={'a\nold'} after={'a\n<script>'} /></LocaleProvider>);
    expect(screen.getByText('<script>')).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Diff view' }), 'split');
    expect(screen.getByRole('columnheader', { name: 'Before' })).toBeInTheDocument();
    expect(screen.getByText('old')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rejects inputs that exceed the comparison limit', () => {
    expect(() => diffLines('a\n'.repeat(1001), 'b\n'.repeat(1001))).toThrow(/too large/);
  });
});
