import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../test/axe';
import { LocaleProvider } from '../i18n/LocaleProvider';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Accordion, AccordionItem, Collapsible } from './Accordion';
import { Avatar, AvatarGroup, getInitials } from './Avatar';
import { Button } from './Button';
import { Card, CardBody, CardFooter, CardHeader, CardLink } from './Card';
import { DescriptionList } from './DescriptionList';
import { Statistic } from './Statistic';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from './Table';
import { Timeline, TimelineItem } from './Timeline';
import { Tooltip } from './Tooltip';

describe('Card', () => {
  it('renders semantic parts, heading level and a stretched link', async () => {
    const { container } = render(
      <Card as="article" isSelected aria-labelledby="c-title">
        <CardHeader id="c-title" title="Progetto Atlas" headingLevel={3} subtitle="Aggiornato oggi" />
        <CardBody>
          <CardLink href="#atlas">Apri progetto</CardLink>
        </CardBody>
        <CardFooter>
          <Button>Archivia</Button>
        </CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Progetto Atlas' })).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByRole('link', { name: 'Apri progetto' })).toHaveAttribute('href', '#atlas');
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Avatar', () => {
  it('computes initials and falls back when the image fails', () => {
    expect(getInitials('Giulia Bianchi')).toBe('GB');
    expect(getInitials('  maria  ')).toBe('M');
    render(<Avatar name="Giulia Bianchi" src="/broken.png" />);
    const avatar = screen.getByRole('img', { name: 'Giulia Bianchi' });
    const img = avatar.querySelector('img');
    expect(img).not.toBeNull();
    fireEvent.error(img!);
    expect(avatar.querySelector('img')).toBeNull();
    expect(avatar).toHaveTextContent('GB');
  });

  it('summarizes overflow in a group with a localized label', async () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <AvatarGroup aria-label="Team" max={2}>
          <Avatar name="Anna Rossi" />
          <Avatar name="Luca Verdi" />
          <Avatar name="Sara Neri" />
          <Avatar name="Paolo Blu" />
        </AvatarGroup>
      </LocaleProvider>,
    );
    const group = screen.getByRole('group', { name: 'Team' });
    expect(within(group).getAllByRole('img')).toHaveLength(3);
    expect(within(group).getByRole('img', { name: 'altri 2' })).toHaveTextContent('+2');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('can be decorative', () => {
    render(<Avatar name="Anna Rossi" isDecorative />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

describe('Tooltip', () => {
  it('shows on keyboard focus inside the themed portal and hides with Escape', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider defaultMode="dark" persistence={false}>
        <Tooltip content="Salva le modifiche" delay={0}>
          <Button>Salva</Button>
        </Tooltip>
      </ThemeProvider>,
    );
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Salva le modifiche');
    expect(screen.getByRole('button', { name: 'Salva' })).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tooltip.closest('[data-dc-portal]')).toHaveAttribute('data-dc-resolved-scheme', 'dark');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });
});

describe('Accordion / Collapsible', () => {
  it('expands one item at a time by default and works with the keyboard', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion>
        <AccordionItem id="a" title="Spedizione">Consegna in 48 ore.</AccordionItem>
        <AccordionItem id="b" title="Resi">Entro 30 giorni.</AccordionItem>
      </Accordion>,
    );
    const first = screen.getByRole('button', { name: 'Spedizione' });
    const second = screen.getByRole('button', { name: 'Resi' });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    first.focus();
    await user.keyboard('{Enter}');
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Consegna in 48 ore.')).toBeVisible();
    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('allows multiple expanded items and a standalone controlled Collapsible', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Accordion allowsMultipleExpanded defaultExpandedKeys={['a']}>
          <AccordionItem id="a" title="Uno">1</AccordionItem>
          <AccordionItem id="b" title="Due">2</AccordionItem>
        </Accordion>
        <Collapsible title="Dettagli avanzati" headingLevel={4} isExpanded>
          Contenuto
        </Collapsible>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Due' }));
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Due' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('heading', { level: 4, name: 'Dettagli avanzati' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dettagli avanzati' }));
    expect(screen.getByRole('button', { name: 'Dettagli avanzati' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('DescriptionList', () => {
  it('renders native term/description pairs with an empty-value fallback', async () => {
    const { container } = render(
      <DescriptionList
        items={[
          { term: 'Cliente', description: 'Acme S.p.A.' },
          { term: 'Partita IVA', description: null },
        ]}
        emptyValue="Non disponibile"
      />,
    );
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(screen.getByText('Acme S.p.A.').tagName).toBe('DD');
    expect(screen.getByText('Non disponibile')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Timeline', () => {
  it('renders an ordered list with machine-readable times and tone text', async () => {
    const { container } = render(
      <Timeline aria-label="Storico ordine">
        <TimelineItem title="Ordine creato" time="2 mar 2025" dateTime="2025-03-02" />
        <TimelineItem title="Pagamento rifiutato" tone="danger" />
      </Timeline>,
    );
    const list = screen.getByRole('list', { name: 'Storico ordine' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2025-03-02');
    expect(within(list).getAllByRole('listitem')[1]).toHaveTextContent(/Error|Danger/i);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Statistic', () => {
  it('formats numbers with Intl and announces the trend direction in text', () => {
    const { container } = render(
      <LocaleProvider locale="it-IT">
        <Statistic label="Ricavi" value={1234567.5} formatOptions={{ style: 'currency', currency: 'EUR' }} trend={{ direction: 'up', value: '12%', sentiment: 'positive' }} />
      </LocaleProvider>,
    );
    const expected = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(1234567.5);
    expect(container.textContent).toContain(expected);
    expect(screen.getByText('aumento')).toBeInTheDocument();
    expect(screen.getByText('12%')).toBeInTheDocument();
  });
});

describe('Table', () => {
  it('renders a native, captioned table in a labelled scroll region', async () => {
    const { container } = render(
      <Table striped scrollRegionLabel="Fatture">
        <TableCaption>Fatture recenti</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Numero</TableHeaderCell>
            <TableHeaderCell align="end">Importo</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow isSelected>
            <TableHeaderCell scope="row">F-001</TableHeaderCell>
            <TableCell numeric>120,00 €</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table', { name: 'Fatture recenti' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Numero' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('rowheader', { name: 'F-001' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});