import { createElement, forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils';
import styles from './GradientText.module.css';

export type GradientTextElement = 'span' | 'strong' | 'em' | 'b' | 'mark';

export type GradientTextTone = 'brand' | 'text' | 'inverse';

export interface GradientTextProps extends HTMLAttributes<HTMLElement> {
  /** Inline element to render. @default 'span' */
  as?: GradientTextElement;
  /**
   * `brand`: primary → accent (same as buttons and covers); `text`: link → accent, tuned for body text;
   * `inverse`: light tints for inverse (dark) surfaces such as a hero. @default 'brand'
   */
  tone?: GradientTextTone;
}

/**
 * Inline text filled with the brand gradient (`background-clip: text`), e.g. a highlighted part of a
 * hero title. Falls back to a solid colour where clipping is unsupported and in forced-colors mode.
 */
export const GradientText = forwardRef<HTMLElement, GradientTextProps>(function GradientText(
  { as = 'span', tone = 'brand', className, children, ...rest },
  ref,
) {
  return createElement(as, { ref, 'data-tone': tone, className: cx(styles.gradientText, className), ...rest }, children);
});
