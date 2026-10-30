import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders a labelled nav with an ordered list and the current page', async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
        <BreadcrumbItem>Atlas</BreadcrumbItem>
      </Breadcrumb>,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.querySelector('ol')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByText('Atlas')).toHaveAttribute('aria-current', 'page');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('collapses middle items and expands them on demand (Italian strings)', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="it-IT">
        <Breadcrumb maxItems={3}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/a">A</BreadcrumbItem>
          <BreadcrumbItem href="/b">B</BreadcrumbItem>
          <BreadcrumbItem href="/c">C</BreadcrumbItem>
          <BreadcrumbItem>Corrente</BreadcrumbItem>
        </Breadcrumb>
      </LocaleProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Percorso' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'A' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'C' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'altri 2' }));
    expect(screen.getByRole('link', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'B' })).toBeInTheDocument();
  });
});