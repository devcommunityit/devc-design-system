/**
 * Documentation metadata shared by the docs site and Storybook (single source).
 * Not part of the published package.
 */
export type ComponentCategory =
  | 'layout'
  | 'typography'
  | 'actions'
  | 'navigation'
  | 'forms'
  | 'data'
  | 'charts'
  | 'dashboard'
  | 'ai'
  | 'website'
  | 'community'
  | 'editor'
  | 'feedback'
  | 'overlay'
  | 'patterns';

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface ComponentDoc {
  /** Package subpath the exports live in, when not the root entry (e.g. 'editor' → '@devcommunityit/ui/editor'). */
  entry?: 'editor' | 'patterns' | 'widgets';
  /** Export name(s) documented on this page, e.g. ['Tabs', 'TabList', 'Tab', 'TabPanel']. */
  exports: string[];
  /** Page title. */
  name: string;
  /** URL slug. */
  slug: string;
  category: ComponentCategory;
  /** Italian prose. */
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  /** Props of the main export(s). Inherited DOM/react-aria props are summarized in `inherits`. */
  props: PropDoc[];
  /** What else is accepted and forwarded. */
  inherits?: string;
  keyboard: Array<{ keys: string; action: string }>;
  accessibility: string[];
  responsive: string[];
  customization: string[];
  commonMistakes: string[];
  /** Example export names from the sibling *.examples.tsx file, in display order. */
  examples: Array<{ name: string; title: string; description?: string }>;
  status: {
    implemented: boolean;
    documented: boolean;
    /** Test files covering it (relative to packages/ui/src). */
    tests: string[];
    limits: string[];
  };
  /** WAI-ARIA APG pattern URL, if relevant. */
  apg?: string;
}
