import { useState } from 'react';
import { ColorPicker, Stack, Text, parseColor, type Color } from '@dev-community/ui';

export function Basic() {
  return <ColorPicker label="Colore etichetta" defaultValue="#0f62fe" />;
}

export function Controlled() {
  const [color, setColor] = useState<Color>(parseColor('#7c3aed'));
  return (
    <Stack gap={2}>
      <ColorPicker
        label="Colore brand"
        value={color}
        onChange={setColor}
        swatches={['#0f62fe', '#7c3aed', '#0d9488', '#e11d48', '#ca8a04']}
        description="Esadecimale, area colore o campioni."
      />
      <Text variant="body-sm" tone="secondary">
        HEX {color.toString('hex')} · {color.toString('rgb')}
      </Text>
    </Stack>
  );
}

export function States() {
  return (
    <Stack gap={3}>
      <ColorPicker label="Sola lettura" defaultValue="#16a34a" isReadOnly />
      <ColorPicker label="Disabilitato" defaultValue="#64748b" isDisabled />
      <ColorPicker label="Non valido" defaultValue="#ffff00" isInvalid errorMessage="Contrasto insufficiente sullo sfondo chiaro." />
    </Stack>
  );
}