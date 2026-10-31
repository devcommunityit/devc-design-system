import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from '../../../test/axe';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ImageCropper } from './ImageCropper';

function mockCanvasContext() {
  const drawImage = vi.fn<(image: CanvasImageSource, ...coordinates: number[]) => void>();
  const context: Pick<CanvasRenderingContext2D, 'drawImage'> = { drawImage };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as CanvasRenderingContext2D);
  return drawImage;
}

afterEach(() => vi.restoreAllMocks());

describe('ImageCropper', () => {
  it('exports the chosen source pixels as a blob and exposes keyboard controls', async () => {
    const drawImage = mockCanvasContext();
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(new Blob(['image'], { type: 'image/png' })));
    const onCrop = vi.fn();
    const { container } = render(<LocaleProvider locale="en-US"><ImageCropper aria-label="Crop photo" src="/photo.png" alt="Photo" defaultCrop={{ x: 10, y: 20, width: 40, height: 30 }} onCrop={onCrop} /></LocaleProvider>);
    const image = screen.getByRole('img', { name: 'Photo' });
    expect(image).toHaveAttribute('crossorigin', 'anonymous');
    Object.defineProperties(image, { naturalWidth: { value: 100 }, naturalHeight: { value: 80 } });
    fireEvent.load(image);
    expect(screen.getByRole('textbox', { name: 'Crop width' })).toHaveValue('40');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Crop image' }));
    await waitFor(() => expect(onCrop).toHaveBeenCalledOnce());
    expect(onCrop.mock.calls[0]![0].crop).toEqual({ x: 10, y: 20, width: 40, height: 30 });
    expect(drawImage).toHaveBeenCalledWith(image, 10, 20, 40, 30, 0, 0, 40, 30);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('reports image loading failures', () => {
    const onError = vi.fn();
    render(<LocaleProvider locale="en-US"><ImageCropper aria-label="Crop" src="/broken.png" alt="Broken" onCrop={() => undefined} onError={onError} /></LocaleProvider>);
    fireEvent.error(screen.getByRole('img', { name: 'Broken' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Could not crop the image');
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Crop image' })).toBeDisabled();
  });

  it('reports canvas encoding failures instead of returning an empty result', async () => {
    mockCanvasContext();
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(null));
    const onCrop = vi.fn();
    const onError = vi.fn();
    render(<LocaleProvider locale="en-US"><ImageCropper aria-label="Crop" src="/photo.png" alt="Photo" onCrop={onCrop} onError={onError} /></LocaleProvider>);
    const image = screen.getByRole('img', { name: 'Photo' });
    Object.defineProperties(image, { naturalWidth: { value: 100 }, naturalHeight: { value: 80 } });
    fireEvent.load(image);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Crop image' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not crop the image');
    expect(onError).toHaveBeenCalledOnce();
    expect(onCrop).not.toHaveBeenCalled();
  });
});
