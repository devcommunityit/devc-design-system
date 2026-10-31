import { generateHTML, type JSONContent } from '@tiptap/core';
import { forwardRef, useMemo, useSyncExternalStore, type HTMLAttributes } from 'react';
import { cx } from '../../utils';
import { contentExtensions, resolveFeatures } from './extensions';
import styles from './RichTextEditor.module.css';

export interface RichTextContentProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /**
   * Stored HTML, injected as-is. It MUST be trusted or sanitized (pass `sanitize`, e.g. DOMPurify): no sanitizer is bundled.
   * Ignored when `json` is provided.
   */
  html?: string;
  /**
   * Tiptap JSON (`onChange().json`). Rendered through the editor schema, so unknown nodes/attributes are dropped and
   * unsafe link protocols are neutralised. Preferred over `html` for user-generated content. Rendered on the client only.
   */
  json?: JSONContent;
  /** Applied to `html` before injecting it. */
  sanitize?: (html: string) => string;
  /** @default 'div' */
  as?: 'div' | 'article' | 'section';
}

const ALL_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const subscribe = () => () => {};

/** Renders saved editor content with the same typography as `RichTextEditor`. */
export const RichTextContent = forwardRef<HTMLElement, RichTextContentProps>(function RichTextContent(
  { html, json, sanitize, as: Tag = 'div', className, ...rest },
  ref,
) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const markup = useMemo(() => {
    if (json) {
      if (!isClient) return '';
      try {
        return generateHTML(json, contentExtensions(resolveFeatures(), ALL_LEVELS));
      } catch {
        return '';
      }
    }
    const value = html ?? '';
    return sanitize ? sanitize(value) : value;
  }, [html, json, sanitize, isClient]);

  return <Tag ref={ref as never} className={cx(styles.prose, className)} dangerouslySetInnerHTML={{ __html: markup }} {...rest} />;
});
