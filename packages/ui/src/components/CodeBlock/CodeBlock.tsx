import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Button as RACButton } from 'react-aria-components';
import { Check, Copy, WrapText } from 'lucide-react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import { useCopyToClipboard } from '../CopyButton/CopyButton';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Source code shown verbatim (no syntax highlighting is applied). */
  code: string;
  /** Language label shown in the toolbar, e.g. `"tsx"`. */
  language?: string;
  /** Optional title (file name). */
  title?: ReactNode;
  /** Show the copy button. @default true */
  copyable?: boolean;
  /** Initial soft-wrap state; users can toggle it. @default false */
  defaultWrap?: boolean;
  /** Max block size before scrolling, e.g. `'24rem'`. */
  maxHeight?: string;
  /** Called after a successful copy. */
  onCopyCode?: (code: string) => void;
}

/**
 * Multi-line code in `<pre><code>` with copy and soft-wrap toggle.
 * The scrollable area is keyboard focusable and labelled. No highlighting dependency.
 */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { code, language, title, copyable = true, defaultWrap = false, maxHeight, onCopyCode, className, style, ...rest },
  ref,
) {
  const messages = useMessages();
  const [wrap, setWrap] = useState(defaultWrap);
  const { status, copy } = useCopyToClipboard({ onCopy: onCopyCode });
  const label = typeof title === 'string' ? title : language ? `${messages.codeBlock} ${language}` : messages.codeBlock;
  return (
    <div ref={ref} className={cx(styles.codeBlock, className)} data-wrap={wrap || undefined} style={style} {...rest}>
      <div className={styles.toolbar}>
        <span className={styles.title}>{title ?? language}</span>
        <div className={styles.tools}>
          <RACButton className={styles.tool} aria-pressed={wrap} onPress={() => setWrap((w) => !w)}>
            <WrapText aria-hidden="true" />
            <span className={styles.srOnly}>{messages.wrapLines}</span>
          </RACButton>
          {copyable ? (
            <RACButton className={styles.tool} onPress={() => void copy(code)}>
              {status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              <span className={styles.toolLabel}>{status === 'copied' ? messages.copied : messages.copy}</span>
            </RACButton>
          ) : null}
        </div>
      </div>
      {/* Scrollable region must be focusable for keyboard users (WCAG 2.1.1). */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable scroll container, named via aria-label */}
      <pre className={styles.pre} tabIndex={0} role="region" aria-label={label} style={maxHeight ? { maxBlockSize: maxHeight } : undefined}>
        <code className={styles.code}>{code}</code>
      </pre>
      <span className={styles.srOnly} role="status">
        {status === 'copied' ? messages.copied : status === 'error' ? messages.error : ''}
      </span>
    </div>
  );
});
