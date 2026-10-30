import { forwardRef, type ReactNode } from 'react';
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  composeRenderProps,
  type DisclosureGroupProps,
  type DisclosureProps,
} from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils';
import styles from './Accordion.module.css';

export interface CollapsibleProps extends Omit<DisclosureProps, 'children'> {
  /** Text of the trigger button. */
  title: ReactNode;
  /** Heading level wrapping the trigger (APG accordion pattern). @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Extra content on the trigger row (e.g. Badge). Non-interactive. */
  meta?: ReactNode;
  children?: ReactNode;
  /** @default 'default' */
  variant?: 'default' | 'plain';
}

/**
 * Single show/hide section (APG Disclosure). Controlled with `isExpanded`/`onExpandedChange`
 * or uncontrolled with `defaultExpanded`. Inside an Accordion it becomes an accordion item:
 * give it an `id` to control which items are expanded.
 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { title, headingLevel = 3, meta, children, variant = 'default', className, ...rest },
  ref,
) {
  return (
    <Disclosure ref={ref} data-variant={variant} className={composeRenderProps(className, (cn) => cx(styles.item, cn))} {...rest}>
      <Heading level={headingLevel} className={styles.heading}>
        <Button slot="trigger" className={styles.trigger}>
          <span className={styles.title}>{title}</span>
          {meta ? <span className={styles.meta}>{meta}</span> : null}
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </Button>
      </Heading>
      <DisclosurePanel className={styles.panel}>
        <div className={styles.panelInner}>{children}</div>
      </DisclosurePanel>
    </Disclosure>
  );
});

/** Item of an Accordion (same API as Collapsible; `id` identifies it in expandedKeys). */
export const AccordionItem = Collapsible;
export type AccordionItemProps = CollapsibleProps;

export interface AccordionProps extends Omit<DisclosureGroupProps, 'children'> {
  children: ReactNode;
}

/**
 * Group of Collapsible/AccordionItem sections. Single expansion by default;
 * `allowsMultipleExpanded` lets several stay open. Controlled via `expandedKeys`.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion({ className, ...rest }, ref) {
  return <DisclosureGroup ref={ref} className={composeRenderProps(className, (cn) => cx(styles.group, cn))} {...rest} />;
});