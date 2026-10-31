import { createContext, useContext } from 'react';

export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

/** Shared by SkeletonGroup and the presets so a whole block animates the same way. */
export const SkeletonAnimationContext = createContext<SkeletonAnimation | null>(null);

export function useSkeletonAnimation(own?: SkeletonAnimation): SkeletonAnimation {
  const inherited = useContext(SkeletonAnimationContext);
  return own ?? inherited ?? 'pulse';
}
