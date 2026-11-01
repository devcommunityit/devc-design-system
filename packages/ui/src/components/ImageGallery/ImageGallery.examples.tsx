import { ImageGallery } from '@devcommunityit/ui';

const image = (color: string) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='320'%3E%3Crect width='100%25' height='100%25' fill='${color}'/%3E%3C/svg%3E`;

export function Gallery() {
  return <ImageGallery aria-label="Galleria" images={[
    { id: 'one', src: image('steelblue'), alt: 'Campione blu', caption: 'Blu' },
    { id: 'two', src: image('seagreen'), alt: 'Campione verde', caption: 'Verde' },
  ]} />;
}
