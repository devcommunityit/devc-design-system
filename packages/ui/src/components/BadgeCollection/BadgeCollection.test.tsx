import { render, screen } from '@testing-library/react';
import { Award, Mic } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { BadgeCollection } from './BadgeCollection';

describe('BadgeCollection', () => {
  it('composes the existing achievement badge list and badge components', () => {
    render(
      <LocaleProvider locale="en-US">
        <BadgeCollection
          label="Earned achievements"
          items={[
            { id: 'talk', icon: <Mic />, title: 'First talk', tier: 'gold' },
            { id: 'mentor', icon: <Award />, title: 'Mentor', tier: 'brand', tierLabel: 'Community' },
          ]}
        />
      </LocaleProvider>,
    );
    expect(screen.getByRole('list', { name: 'Earned achievements' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('First talk')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <LocaleProvider locale="en-US">
        <BadgeCollection items={[{ id: 'talk', icon: <Mic />, title: 'First talk', tier: 'gold' }]} />
      </LocaleProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
