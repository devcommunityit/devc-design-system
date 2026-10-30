import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../../test/axe';
import { Tag, TagGroup } from './Tag';

describe('TagGroup', () => {
  it('removes tags with the button and with Delete', async () => {
    const user = userEvent.setup();
    function Removable() {
      const [tags, setTags] = useState([
        { id: 'a', name: 'React' },
        { id: 'b', name: 'TypeScript' },
        { id: 'c', name: 'CSS' },
      ]);
      return (
        <TagGroup label="Skills" items={tags} onRemove={(keys) => setTags((t) => t.filter((x) => !keys.has(x.id)))}>
          {(t) => <Tag id={t.id}>{t.name}</Tag>}
        </TagGroup>
      );
    }
    const { container } = render(<Removable />);
    expect(screen.getByRole('grid', { name: 'Skills' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Remove React/ }));
    expect(screen.queryByText('React')).not.toBeInTheDocument();
    await user.tab();
    await user.keyboard('{Delete}');
    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports selectable filter chips', async () => {
    const user = userEvent.setup();
    render(
      <TagGroup aria-label="Filters" selectionMode="multiple" defaultSelectedKeys={['open']}>
        <Tag id="open">Open</Tag>
        <Tag id="closed">Closed</Tag>
      </TagGroup>,
    );
    const closed = screen.getByRole('row', { name: 'Closed' });
    await user.click(closed);
    expect(closed).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('row', { name: 'Open' })).toHaveAttribute('aria-selected', 'true');
  });
});