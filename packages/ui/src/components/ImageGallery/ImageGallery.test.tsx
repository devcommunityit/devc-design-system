import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ImageGallery } from './ImageGallery';

const images = [
  { id: 'a', src: '/a.png', alt: 'Lake', caption: 'Lake view' },
  { id: 'b', src: '/b.png', alt: 'Forest', caption: 'Forest view' },
];

describe('ImageGallery', () => {
  it('opens, navigates with the keyboard, and closes the viewer', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<LocaleProvider locale="en-US"><ImageGallery aria-label="Photos" images={images} onSelectionChange={onSelectionChange} /></LocaleProvider>);
    const opener = screen.getByRole('button', { name: 'Open image Lake' });
    await user.click(opener);
    expect(await screen.findByRole('dialog', { name: 'Lake view' })).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('dialog', { name: 'Forest view' })).toBeInTheDocument();
    expect(screen.getByText('Image 2 of 2')).toBeInTheDocument();
    expect(await axe(screen.getByRole('dialog', { name: 'Forest view' }))).toHaveNoViolations();
    await user.keyboard('{Escape}');
    expect(onSelectionChange).toHaveBeenLastCalledWith(null);
  });

  it('rejects duplicate ids instead of opening the wrong image', () => {
    expect(() => render(<ImageGallery aria-label="Photos" images={[images[0]!, images[0]!]} />)).toThrow(/duplicate image id/);
  });
});
