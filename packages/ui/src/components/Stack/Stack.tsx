import { createElement, forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx, type CSSVariables } from '../../utils';
import styles from './Stack.module.css';

/** Steps of the spacing scale (`--dc-space-N`). */
export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
/** Layout-neutral semantic elements a Stack/Inline may render. */
export type LayoutElement = 'div' | 'section' | 'ul' | 'ol' | 'nav' | 'header' | 'footer' | 'main' | 'aside' | 'article' | 'form' | 'fieldset' | 'span';

const alignMap: Record<FlexAlign, string> = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' };
const justifyMap: Record<FlexJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

interface FlexProps extends HTMLAttributes<HTMLElement> {
  /** Gap from the spacing scale. */
  gap?: SpaceStep;
  align?: FlexAlign;
  justify?: FlexJustify;
  /** Rendered element. @default 'div' */
  as?: LayoutElement;
}

function flexStyle(gap: SpaceStep, align: FlexAlign | undefined, justify: FlexJustify | undefined, style: CSSProperties | undefined): CSSVariables {
  return {
    ...style,
    '--_gap': `var(--dc-space-${gap})`,
    alignItems: align ? alignMap[align] : style?.alignItems,
    justifyContent: justify ? justifyMap[justify] : style?.justifyContent,
  };
}

export interface StackProps extends FlexProps {
  /** @default 4 */
  gap?: SpaceStep;
}

/** Vertical flow with consistent spacing between children. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { gap = 4, align, justify, as = 'div', className, style, ...rest },
  ref,
) {
  return createElement(as, { ref, className: cx(styles.stack, className), style: flexStyle(gap, align, justify, style), ...rest });
});

export interface InlineProps extends FlexProps {
  /** @default 2 */
  gap?: SpaceStep;
  /** @default 'center' */
  align?: FlexAlign;
  /** Wrap onto multiple lines when out of space. @default true */
  wrap?: boolean;
}

/** Horizontal flow (follows the writing direction) that wraps by default. */
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(
  { gap = 2, align = 'center', justify, wrap = true, as = 'div', className, style, ...rest },
  ref,
) {
  return createElement(as, {
    ref,
    className: cx(styles.inline, className),
    'data-wrap': wrap ? undefined : 'false',
    style: flexStyle(gap, align, justify, style),
    ...rest,
  });
});
