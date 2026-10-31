import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Skeleton } from './Skeleton';
import { SkeletonGroup } from './SkeletonGroup';
import {
  SkeletonAvatar,
  SkeletonCard,
  SkeletonChart,
  SkeletonForm,
  SkeletonKpi,
  SkeletonList,
  SkeletonPage,
  SkeletonTable,
  SkeletonText,
} from './SkeletonPresets';

describe('Skeleton', () => {
  it('is hidden from assistive tech and renders the requested lines', () => {
    const { container } = render(<Skeleton lines={4} data-testid="sk" />);
    const sk = screen.getByTestId('sk');
    expect(sk).toHaveAttribute('aria-hidden', 'true');
    expect(sk.children).toHaveLength(4);
    expect(sk.lastElementChild).toHaveAttribute('data-last');
    expect(container.querySelectorAll('[data-last]')).toHaveLength(1);
  });

  it('defaults to pulse and accepts wave/none and radius', () => {
    const { rerender } = render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('data-animation', 'pulse');
    rerender(<Skeleton data-testid="sk" animation="wave" shape="rect" radius="control" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('data-animation', 'wave');
    expect(screen.getByTestId('sk')).toHaveAttribute('data-radius', 'control');
    rerender(<Skeleton data-testid="sk" animation="none" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('data-animation', 'none');
  });
});

describe('SkeletonGroup', () => {
  it('marks the region busy, exposes one status from i18n and propagates the animation', async () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <SkeletonGroup animation="wave" data-testid="region">
          <Skeleton data-testid="a" />
          <SkeletonText lines={2} />
        </SkeletonGroup>
      </LocaleProvider>,
    );
    expect(screen.getByTestId('region')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Caricamento…');
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByTestId('a')).toHaveAttribute('data-animation', 'wave');
    container.querySelectorAll('[data-animation]').forEach((el) => expect(el).toHaveAttribute('data-animation', 'wave'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses the English string and a custom label', () => {
    const { rerender } = render(
      <LocaleProvider locale="en-US">
        <SkeletonGroup />
      </LocaleProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    rerender(
      <LocaleProvider locale="en-US">
        <SkeletonGroup label="Loading posts…" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading posts…');
  });

  it('swaps the skeleton for the content when loading ends', () => {
    const ui = (isLoading: boolean) => (
      <LocaleProvider locale="it-IT">
        <SkeletonGroup data-testid="region" isLoading={isLoading} skeleton={<SkeletonCard data-testid="sk" />} loadedLabel="Profilo caricato">
          <p>Contenuto reale</p>
        </SkeletonGroup>
      </LocaleProvider>
    );
    const { rerender } = render(ui(true));
    expect(screen.getByTestId('sk')).toBeInTheDocument();
    expect(screen.queryByText('Contenuto reale')).not.toBeInTheDocument();
    act(() => rerender(ui(false)));
    expect(screen.queryByTestId('sk')).not.toBeInTheDocument();
    expect(screen.getByText('Contenuto reale')).toBeInTheDocument();
    expect(screen.getByTestId('region')).not.toHaveAttribute('aria-busy');
    expect(screen.getByRole('status')).toHaveTextContent('Profilo caricato');
  });
});

describe('Skeleton presets', () => {
  it('are decorative and accept className', () => {
    const { container } = render(
      <>
        <SkeletonText className="x" heading />
        <SkeletonAvatar className="x" lines={2} size="lg" />
        <SkeletonCard className="x" media actions={2} />
        <SkeletonList className="x" />
        <SkeletonTable className="x" />
        <SkeletonKpi className="x" sparkline icon />
        <SkeletonChart className="x" />
        <SkeletonForm className="x" textarea />
        <SkeletonPage className="x" cards={2} />
      </>,
    );
    const roots = container.querySelectorAll(':scope > [data-skeleton]');
    expect(roots).toHaveLength(9);
    roots.forEach((el) => {
      expect(el).toHaveAttribute('aria-hidden', 'true');
      expect(el).toHaveClass('x');
    });
  });

  it('renders text lines with a heading and a shorter last line', () => {
    const { container } = render(<SkeletonText lines={5} heading />);
    expect(container.querySelectorAll('[data-shape="text"]')).toHaveLength(6);
  });

  it('renders a table of rows × columns with a header row', () => {
    const { container } = render(<SkeletonTable rows={6} columns={3} />);
    expect(container.querySelectorAll('[data-part="header"]')).toHaveLength(1);
    const rows = container.querySelectorAll('[data-part="row"]');
    expect(rows).toHaveLength(6);
    rows.forEach((row) => expect(row.querySelectorAll('[data-part="cell"]')).toHaveLength(3));
    expect(container.querySelectorAll('[data-extra]')).toHaveLength(7);
  });

  it('renders list rows and form fields', () => {
    const { container } = render(
      <>
        <SkeletonList rows={3} leading="icon" trailing />
        <SkeletonForm fields={2} textarea />
      </>,
    );
    expect(container.querySelectorAll('[data-skeleton="list"] [data-part="row"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-part="field"]')).toHaveLength(3);
  });

  it.each(['bar', 'line', 'area', 'donut'] as const)('renders the %s chart variant', (variant) => {
    const { container } = render(<SkeletonChart variant={variant} bars={5} />);
    const root = container.querySelector('[data-skeleton="chart"]');
    expect(root).toHaveAttribute('data-variant', variant);
    if (variant === 'bar') expect(container.querySelectorAll('[data-part="bar"]')).toHaveLength(5);
    if (variant === 'line') expect(container.querySelectorAll('svg path')).toHaveLength(1);
    if (variant === 'area') expect(container.querySelectorAll('svg path')).toHaveLength(2);
    if (variant === 'donut') expect(container.querySelector('[data-part="ring"]')).toBeInTheDocument();
  });

  it('produces deterministic markup (SSR hydration safe)', () => {
    const tree = (
      <SkeletonGroup label="Caricamento">
        <SkeletonPage cards={3} />
        <SkeletonTable rows={4} columns={5} />
        <SkeletonChart variant="area" />
        <SkeletonList rows={6} />
      </SkeletonGroup>
    );
    expect(renderToString(tree)).toBe(renderToString(tree));
  });
});
