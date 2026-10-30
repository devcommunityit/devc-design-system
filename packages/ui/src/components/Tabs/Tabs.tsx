import { forwardRef, type ReactNode } from 'react';
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  composeRenderProps,
  type TabListProps as RACTabListProps,
  type TabPanelProps as RACTabPanelProps,
  type TabProps as RACTabProps,
  type TabsProps as RACTabsProps,
} from 'react-aria-components';
import { cx } from '../../utils';
import styles from './Tabs.module.css';

export interface TabsProps extends RACTabsProps {
  /** `line`: underline indicator; `pill`: filled segment. @default 'line' */
  variant?: 'line' | 'pill';
  /** Tabs fill the available inline size. @default false */
  fullWidth?: boolean;
}

/**
 * Switch between related panels in the same context. Controlled (`selectedKey` + `onSelectionChange`)
 * or uncontrolled (`defaultSelectedKey`). Use `keyboardActivation="manual"` when panels are expensive to render.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs({ variant = 'line', fullWidth, className, ...rest }, ref) {
  return (
    <RACTabs
      ref={ref}
      data-variant={variant}
      data-full-width={fullWidth || undefined}
      className={composeRenderProps(className, (cn) => cx(styles.tabs, cn))}
      {...rest}
    />
  );
});

export type TabListProps<T extends object> = RACTabListProps<T>;

/** Container of Tab elements. Needs `aria-label` when there is no visible heading. Scrolls horizontally when it overflows. */
export function TabList<T extends object>({ className, ...rest }: TabListProps<T>) {
  return <RACTabList className={composeRenderProps(className, (cn) => cx(styles.list, cn))} {...rest} />;
}

export interface TabProps extends Omit<RACTabProps, 'children'> {
  children?: ReactNode;
  /** Decorative icon before the label. */
  icon?: ReactNode;
  /** Trailing content such as a Badge counter. */
  badge?: ReactNode;
}

export const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab({ icon, badge, children, className, ...rest }, ref) {
  return (
    <RACTab ref={ref} className={composeRenderProps(className, (cn) => cx(styles.tab, cn))} {...rest}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {badge}
    </RACTab>
  );
});

export type TabPanelProps = RACTabPanelProps;

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel({ className, ...rest }, ref) {
  return <RACTabPanel ref={ref} className={composeRenderProps(className, (cn) => cx(styles.panel, cn))} {...rest} />;
});