import { Confetti } from './Confetti';

export function Basic() {
  return (
    <div style={{ position: 'relative', minBlockSize: 'var(--dc-space-24)' }}>
      <Confetti />
    </div>
  );
}

export function FewerPieces() {
  return (
    <div style={{ position: 'relative', minBlockSize: 'var(--dc-space-24)' }}>
      <Confetti particleCount={6} />
    </div>
  );
}
