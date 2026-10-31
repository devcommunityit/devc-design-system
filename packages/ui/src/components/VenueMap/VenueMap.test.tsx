import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { VenueMap, venueMapEmbedUrl, venueMapLinks } from './VenueMap';

const props = { name: 'Centro Congressi', address: 'Piazza Gae Aulenti 1, Milano', latitude: 45.48386, longitude: 9.19005 };

describe('VenueMap', () => {
  it('does not contact OpenStreetMap before consent', async () => {
    const { container } = render(<VenueMap {...props} />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByText('Piazza Gae Aulenti 1, Milano')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('loads the embed after pressing the load button', async () => {
    const user = userEvent.setup();
    const onLoadedChange = vi.fn();
    render(<VenueMap {...props} onLoadedChange={onLoadedChange} />);
    await user.click(screen.getByRole('button', { name: 'Load map' }));
    expect(onLoadedChange).toHaveBeenCalledWith(true);
    const frame = screen.getByTitle('Map of Centro Congressi');
    expect(frame.getAttribute('src')).toContain('marker=45.483860%2C9.190050');
    expect(frame).toHaveAttribute('loading', 'lazy');
    expect(frame).toHaveAttribute('sandbox');
    expect(frame).toHaveFocus();
  });

  it('respects the controlled isLoaded prop', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<VenueMap {...props} isLoaded={false} />);
    await user.click(screen.getByRole('button', { name: 'Load map' }));
    expect(container.querySelector('iframe')).toBeNull();
    rerender(<VenueMap {...props} isLoaded />);
    expect(container.querySelector('iframe')).not.toBeNull();
  });

  it('renders the selected direction links', () => {
    render(<VenueMap {...props} directions={['google']} />);
    const link = screen.getByRole('link', { name: /Directions with Google Maps/ });
    expect(link).toHaveAttribute('href', venueMapLinks(props.latitude, props.longitude, props.name).google);
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.queryByRole('link', { name: /Apple Maps/ })).toBeNull();
  });

  it('builds embed urls with a clamped zoom', () => {
    expect(venueMapEmbedUrl(45, 9, 30)).toBe(venueMapEmbedUrl(45, 9, 19));
    expect(venueMapEmbedUrl(45, 9, 16)).toContain('layer=mapnik');
  });
});
