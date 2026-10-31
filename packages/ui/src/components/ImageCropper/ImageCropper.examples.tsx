import { useState } from 'react';
import { ImageCropper, type ImageCropResult } from '@dev-community/ui/widgets';

const sample = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='320'%3E%3Crect width='100%25' height='100%25' fill='steelblue'/%3E%3Ccircle cx='240' cy='160' r='90' fill='white'/%3E%3C/svg%3E";

export function Crop() {
  const [size, setSize] = useState('');
  const onCrop = ({ crop }: ImageCropResult) => setSize(`${crop.width} × ${crop.height} px`);
  return <><ImageCropper aria-label="Ritaglia immagine" src={sample} alt="Cerchio su sfondo blu" onCrop={onCrop} />{size ? <p>Ritaglio: {size}</p> : null}</>;
}
