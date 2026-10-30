import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { ScrollArea } from '../ScrollArea/ScrollArea';
import { Inline, Stack } from '../Stack/Stack';
import { AspectRatio, Container, Divider, Grid, GridItem, Section, Spacer } from './Layout';

describe('Stack / Inline', () => {
  it('renders the requested element with the gap token and forwards ref and props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Stack ref={ref} as="ul" gap={6} align="center" data-testid="s">
        <li>a</li>
      </Stack>,
    );
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('UL');
    expect(ref.current).toBe(el);
    expect(el.style.getPropertyValue('--_gap')).toBe('var(--dc-space-6)');
    expect(el.style.alignItems).toBe('center');
  });

  it('Inline can opt out of wrapping and supports justify', () => {
    render(<Inline data-testid="i" wrap={false} justify="between" />);
    const el = screen.getByTestId('i');
    expect(el).toHaveAttribute('data-wrap', 'false');
    expect(el.style.justifyContent).toBe('space-between');
  });
});

describe('Container', () => {
  it('applies size and gutters through data attributes', () => {
    render(<Container as="main" size="prose" disableGutters data-testid="c" />);
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('MAIN');
    expect(el).toHaveAttribute('data-size', 'prose');
    expect(el).toHaveAttribute('data-gutters', 'none');
  });
});

describe('Grid', () => {
  it('maps responsive columns to custom properties', () => {
    render(<Grid columns={{ base: 1, md: 2, lg: 4 }} gap={6} data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.style.getPropertyValue('--_cols-base')).toBe('1');
    expect(el.style.getPropertyValue('--_cols-md')).toBe('2');
    expect(el.style.getPropertyValue('--_cols-lg')).toBe('4');
  });

  it('supports auto-fit by minimum item width and GridItem spans', () => {
    render(
      <Grid minItemWidth="16rem" data-testid="g">
        <GridItem span={2} data-testid="item" />
      </Grid>,
    );
    expect(screen.getByTestId('g')).toHaveAttribute('data-mode', 'auto');
    expect(screen.getByTestId('item').style.getPropertyValue('--_span')).toBe('span 2');
  });
});

describe('Section', () => {
  it('is a region labelled by its heading at the requested level', async () => {
    const { container } = render(
      <Section title="Team" headingLevel={3} description="People with access" actions={<button type="button">Invite</button>}>
        <p>Content</p>
      </Section>,
    );
    const region = screen.getByRole('region', { name: 'Team' });
    expect(screen.getByRole('heading', { level: 3, name: 'Team' })).toBeInTheDocument();
    expect(region).toHaveTextContent('People with access');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders a plain section without title', () => {
    render(<Section data-testid="s">x</Section>);
    expect(screen.getByTestId('s').tagName).toBe('SECTION');
    expect(screen.getByTestId('s')).not.toHaveAttribute('aria-labelledby');
  });
});

describe('Divider / Spacer / AspectRatio', () => {
  it('Divider is a separator; vertical orientation is exposed', () => {
    render(
      <>
        <Divider />
        <Divider orientation="vertical" />
      </>,
    );
    const separators = screen.getAllByRole('separator');
    expect(separators).toHaveLength(2);
    expect(separators[1]).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('Divider with a label keeps the text readable', () => {
    render(<Divider label="oppure" />);
    expect(screen.getByText('oppure')).toBeInTheDocument();
  });

  it('Spacer is hidden from assistive technology', () => {
    render(<Spacer size={8} data-testid="sp" />);
    expect(screen.getByTestId('sp')).toHaveAttribute('aria-hidden', 'true');
  });

  it('AspectRatio sets the ratio variable', () => {
    render(<AspectRatio ratio={16 / 9} data-testid="ar" />);
    expect(screen.getByTestId('ar').style.getPropertyValue('--_ratio')).toBe(String(16 / 9));
  });
});

describe('ScrollArea', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is not focusable when the content fits', () => {
    render(
      <ScrollArea aria-label="Log" data-testid="sa">
        short
      </ScrollArea>,
    );
    const el = screen.getByTestId('sa');
    expect(el).not.toHaveAttribute('tabindex');
    expect(el).not.toHaveAttribute('role');
  });

  it('becomes a focusable named region when the content overflows', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(500);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100);
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref} aria-label="Log" maxHeight="10rem">
        long
      </ScrollArea>,
    );
    const region = screen.getByRole('region', { name: 'Log' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveAttribute('data-overflowing');
    expect(ref.current).toBe(region);
    expect(region.style.getPropertyValue('--_max-block')).toBe('10rem');
  });
});
