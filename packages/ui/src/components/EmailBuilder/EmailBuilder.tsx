import { ArrowDown, ArrowUp, Copy, Download, GripVertical, ImageOff, MailPlus, Settings2, Trash2 } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from 'react';
import { Button as RACButton, DropIndicator, GridList, GridListItem, useDragAndDrop, type Key, type Selection } from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import type { Messages } from '../../i18n/messages';
import { cx, useControllableState, type CSSVariables } from '../../utils';
import { Button } from '../Button/Button';
import { EmptyState } from '../EmptyState/EmptyState';
import { IconButton } from '../IconButton/IconButton';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs/Tabs';
import { Toggle, ToggleGroup } from '../Toggle/Toggle';
import { Toolbar } from '../Toolbar/Toolbar';
import { Heading } from '../Typography/Typography';
import { blockIcons, blockName } from './blockLabels';
import { EmailInlineEditor } from './EmailInlineEditor';
import { EmailInspector } from './EmailInspector';
import {
  createEmailBlock,
  createEmailDocument,
  duplicateEmailBlock,
  emailBlockTypes,
  emailRichTextToPlain,
  getEmailBlockPadding,
  insertEmailBlock,
  moveEmailBlock,
  removeEmailBlock,
  updateEmailBlock,
  type EmailBlock,
  type EmailBlockType,
  type EmailDocument,
} from './emailDocument';
import { getEmailTextStyle, renderEmailBlockHtml, renderEmailHtml } from './renderEmailHtml';
import styles from './EmailBuilder.module.css';

export type EmailBuilderMode = 'edit' | 'preview';
export type EmailPreviewDevice = 'desktop' | 'mobile';

export interface EmailBuilderProps {
  /** Controlled document. */
  value?: EmailDocument;
  /** Initial document (uncontrolled). @default createEmailDocument() */
  defaultValue?: EmailDocument;
  /** Called with the new (immutable) document after every change. */
  onChange?: (doc: EmailDocument) => void;
  /** Shows an "Export HTML" button; receives the email-safe HTML and the document. */
  onExport?: (html: string, doc: EmailDocument) => void;
  /** Visible title above the builder. When omitted, pass `aria-label`. */
  label?: ReactNode;
  'aria-label'?: string;
  /** Disables editing: canvas, inspector and preview stay readable. @default false */
  isReadOnly?: boolean;
  /** Block types offered in the palette. @default all types */
  blockTypes?: readonly EmailBlockType[];
  /** Controlled mode (edit canvas or sandboxed preview). */
  mode?: EmailBuilderMode;
  /** @default 'edit' */
  defaultMode?: EmailBuilderMode;
  onModeChange?: (mode: EmailBuilderMode) => void;
  /** Controlled viewport for canvas and preview. */
  previewDevice?: EmailPreviewDevice;
  /** @default 'desktop' */
  defaultPreviewDevice?: EmailPreviewDevice;
  onPreviewDeviceChange?: (device: EmailPreviewDevice) => void;
  /** `lang` of the exported/previewed HTML. @default current locale */
  emailLang?: string;
  className?: string;
}

const BLOCK_TYPE_MIME = 'application/x-dc-email-block';
const MOBILE_WIDTH = 375;
const WIDE_LAYOUT = 1200;
const TEXT_BLOCKS = new Set<EmailBlockType>(['heading', 'text', 'footer']);

function firstKey(selection: Selection): string | null {
  if (selection === 'all') return null;
  const [key] = selection;
  return key === undefined ? null : String(key);
}

function blockSummary(block: EmailBlock, t: Messages): string {
  switch (block.type) {
    case 'heading':
    case 'text':
    case 'footer':
      return emailRichTextToPlain(block.content).slice(0, 80);
    case 'button':
      return block.label;
    case 'image':
      return block.alt;
    case 'social':
      return block.links.map((link) => link.network).join(', ');
    default:
      return blockName(block.type, t);
  }
}

function isBlockEmpty(block: EmailBlock): boolean {
  if (block.type === 'image') return !block.src;
  if (TEXT_BLOCKS.has(block.type) && 'content' in block) return emailRichTextToPlain(block.content).trim() === '';
  if (block.type === 'social') return block.links.length === 0;
  return false;
}

function localizedBlock(type: EmailBlockType, t: Messages): EmailBlock {
  if (type === 'button') return createEmailBlock('button', { label: t.emailBlockButton });
  return createEmailBlock(type);
}

/**
 * Block-based email builder: palette, WYSIWYG canvas (reorderable grid), inspector and sandboxed preview.
 * The document is plain data (`EmailDocument`); `renderEmailHtml` turns it into email-client-safe HTML.
 */
export function EmailBuilder({
  value,
  defaultValue,
  onChange,
  onExport,
  label,
  'aria-label': ariaLabel,
  isReadOnly = false,
  blockTypes = emailBlockTypes,
  mode: modeProp,
  defaultMode = 'edit',
  onModeChange,
  previewDevice: deviceProp,
  defaultPreviewDevice = 'desktop',
  onPreviewDeviceChange,
  emailLang,
  className,
}: EmailBuilderProps) {
  const t = useMessages();
  const { locale, direction } = useLocale();
  const [initialDoc] = useState(() => defaultValue ?? createEmailDocument());
  const [doc, setDocState] = useControllableState(value, initialDoc, onChange, 'value');
  const [mode, setMode] = useControllableState(modeProp, defaultMode, onModeChange, 'mode');
  const [device, setDevice] = useControllableState(deviceProp, defaultPreviewDevice, onPreviewDeviceChange, 'previewDevice');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [width, setWidth] = useState(0);
  const [compactTab, setCompactTab] = useState<Key>('canvas');
  const rootRef = useRef<HTMLDivElement>(null);
  const docRef = useRef(doc);
  const titleId = useId();
  const inspectorHeadingId = useId();

  const commit = (next: EmailDocument) => {
    docRef.current = next;
    setDocState(next);
  };

  const announce = (message: string) => {
    // Re-setting the same text would not be re-announced: clear first.
    setAnnouncement('');
    requestAnimationFrame(() => setAnnouncement(message));
  };

  // Handlers read the latest document even when called from stale closures (editor, DnD callbacks).
  useLayoutEffect(() => {
    docRef.current = doc;
  }, [doc]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const selectedBlock = doc.blocks.find((block) => block.id === selectedId) ?? null;
  const allowedTypes = blockTypes.filter((type) => emailBlockTypes.includes(type));
  const compact = width > 0 && width < WIDE_LAYOUT;
  const canvasWidth = device === 'mobile' ? MOBILE_WIDTH : doc.settings.width;
  const lang = emailLang ?? locale;
  const html = useMemo(() => renderEmailHtml(doc, { lang, dir: direction }), [doc, lang, direction]);

  const addBlock = (type: EmailBlockType, index?: number) => {
    if (isReadOnly) return;
    const current = docRef.current;
    const selectedIndex = current.blocks.findIndex((block) => block.id === selectedId);
    const at = index ?? (selectedIndex >= 0 ? selectedIndex + 1 : current.blocks.length);
    const block = localizedBlock(type, t);
    commit(insertEmailBlock(current, block, at));
    setSelectedId(block.id);
    announce(t.emailBlockAdded(blockName(type, t)));
    if (compact) setCompactTab('canvas');
  };

  const moveTo = (id: string, toIndex: number) => {
    const current = docRef.current;
    const next = moveEmailBlock(current, id, toIndex);
    if (next === current) return;
    commit(next);
    const index = next.blocks.findIndex((block) => block.id === id);
    const block = next.blocks[index];
    if (block) announce(t.emailBlockMoved(blockName(block.type, t), index + 1, next.blocks.length));
  };

  const moveBy = (id: string, delta: -1 | 1, from: Element) => {
    const current = docRef.current;
    const index = current.blocks.findIndex((block) => block.id === id);
    const target = index + delta;
    if (index < 0 || target < 0 || target >= current.blocks.length) return;
    moveTo(id, target);
    // At either end the pressed button becomes disabled: keep focus in the row on the other one.
    if (target === 0 || target === current.blocks.length - 1) {
      const row = from.closest('[role="row"]');
      requestAnimationFrame(() => row?.querySelector<HTMLElement>(`[data-move="${delta < 0 ? 'down' : 'up'}"]`)?.focus());
    }
  };

  const duplicate = (id: string) => {
    const current = docRef.current;
    const index = current.blocks.findIndex((block) => block.id === id);
    const next = duplicateEmailBlock(current, id);
    const copy = next.blocks[index + 1];
    if (!copy || next === current) return;
    commit(next);
    setSelectedId(copy.id);
    announce(t.emailBlockAdded(blockName(copy.type, t)));
  };

  const remove = (id: string) => {
    const current = docRef.current;
    const index = current.blocks.findIndex((block) => block.id === id);
    const block = current.blocks[index];
    if (!block) return;
    const next = removeEmailBlock(current, id);
    commit(next);
    const neighbour = next.blocks[Math.min(index, next.blocks.length - 1)];
    setSelectedId(neighbour?.id ?? null);
    announce(t.emailBlockRemoved(blockName(block.type, t)));
  };

  const changeBlock = (id: string, patch: Partial<EmailBlock>) => commit(updateEmailBlock(docRef.current, id, patch));

  const { dragAndDropHooks } = useDragAndDrop<EmailBlock>({
    getItems: (keys) =>
      [...keys].map((key) => {
        const block = docRef.current.blocks.find((candidate) => candidate.id === key);
        return { 'text/plain': block ? blockName(block.type, t) : String(key) };
      }),
    onReorder: (event) => {
      const id = String([...event.keys][0]);
      const rest = docRef.current.blocks.filter((block) => block.id !== id);
      const targetIndex = rest.findIndex((block) => block.id === event.target.key);
      if (targetIndex < 0) return;
      moveTo(id, event.target.dropPosition === 'before' ? targetIndex : targetIndex + 1);
    },
    onInsert: async (event) => {
      const type = await readDroppedType(event.items);
      if (!type) return;
      const targetIndex = docRef.current.blocks.findIndex((block) => block.id === event.target.key);
      addBlock(type, event.target.dropPosition === 'before' ? targetIndex : targetIndex + 1);
    },
    onRootDrop: async (event) => {
      const type = await readDroppedType(event.items);
      if (type) addBlock(type, docRef.current.blocks.length);
    },
    renderDropIndicator: (target) => <DropIndicator target={target} className={styles.dropIndicator} />,
  });

  async function readDroppedType(items: ReadonlyArray<{ kind: string; types?: Set<string>; getText?: (type: string) => Promise<string> }>) {
    for (const item of items) {
      if (item.kind === 'text' && item.types?.has(BLOCK_TYPE_MIME) && item.getText) {
        const type = (await item.getText(BLOCK_TYPE_MIME)) as EmailBlockType;
        if (allowedTypes.includes(type)) return type;
      }
    }
    return null;
  }

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      announce(t.emailHtmlCopied);
    } catch {
      // Clipboard unavailable (insecure context or denied): nothing to announce.
    }
  };

  const palette = (
    <section className={styles.palette} aria-labelledby={`${titleId}-palette`}>
      <Heading level={3} size="title-sm" id={`${titleId}-palette`} className={styles.panelTitle}>
        {t.emailAddBlock}
      </Heading>
      <ul className={styles.paletteList} aria-label={t.emailBlocks}>
        {allowedTypes.map((type) => {
          const Icon = blockIcons[type];
          return (
            <li
              key={type}
              className={styles.paletteItem}
              draggable={!isReadOnly && mode === 'edit'}
              onDragStart={(event: DragEvent<HTMLLIElement>) => {
                event.dataTransfer.setData(BLOCK_TYPE_MIME, type);
                event.dataTransfer.setData('text/plain', blockName(type, t));
                event.dataTransfer.effectAllowed = 'copy';
              }}
            >
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                startIcon={<Icon />}
                isDisabled={isReadOnly || mode !== 'edit'}
                onPress={() => addBlock(type)}
                className={styles.paletteButton}
              >
                {blockName(type, t)}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );

  const frameStyle: CSSVariables = {
    '--_email-width': `${canvasWidth}px`,
    backgroundColor: doc.settings.backgroundColor,
  };
  const contentStyle: CSSProperties = {
    backgroundColor: doc.settings.contentBackgroundColor,
    color: doc.settings.textColor,
    fontFamily: doc.settings.fontFamily,
  };

  const renderRow = (block: EmailBlock) => {
    const index = doc.blocks.findIndex((candidate) => candidate.id === block.id);
    const name = blockName(block.type, t);
    const summary = blockSummary(block, t);
    const isSelected = block.id === selectedId;
    const editable = isSelected && !isReadOnly && TEXT_BLOCKS.has(block.type) && 'content' in block;
    const padding = getEmailBlockPadding(block);
    const Icon = blockIcons[block.type];
    return (
      <GridListItem id={block.id} textValue={summary && summary !== name ? `${name}: ${summary}` : name} className={styles.blockRow}>
        <span className={styles.srOnly}>{`${name}, ${t.emailBlockPosition(index + 1, doc.blocks.length)}`}</span>
        {isSelected && !isReadOnly ? (
          <div className={styles.blockToolbarWrap}>
            <Toolbar aria-label={t.editorBlockActions} className={styles.blockToolbar}>
              <RACButton slot="drag" aria-label={t.editorDragBlock} className={styles.dragHandle}>
                <GripVertical aria-hidden="true" />
              </RACButton>
              <span className={styles.blockBadge} aria-hidden="true">
                <Icon />
                {name}
              </span>
              <IconButton
                size="sm"
                data-move="up"
                label={t.editorMoveUp}
                icon={<ArrowUp />}
                isDisabled={index === 0}
                onPress={(event) => moveBy(block.id, -1, event.target)}
              />
              <IconButton
                size="sm"
                data-move="down"
                label={t.editorMoveDown}
                icon={<ArrowDown />}
                isDisabled={index === doc.blocks.length - 1}
                onPress={(event) => moveBy(block.id, 1, event.target)}
              />
              <IconButton size="sm" label={t.editorDuplicate} icon={<Copy />} onPress={() => duplicate(block.id)} />
              <IconButton size="sm" label={t.editorDelete} icon={<Trash2 />} onPress={() => remove(block.id)} />
            </Toolbar>
          </div>
        ) : isReadOnly ? null : (
          <RACButton slot="drag" aria-label={t.editorDragBlock} className={`${styles.dragHandle} ${styles.dragHandleIdle}`}>
            <GripVertical aria-hidden="true" />
          </RACButton>
        )}
        {editable ? (
          <div
            className={styles.blockContent}
            style={{
              padding: `${padding.block}px ${padding.inline}px`,
              backgroundColor: block.backgroundColor,
            }}
          >
            <EmailInlineEditor
              variant={block.type === 'heading' ? 'heading' : 'text'}
              label={name}
              placeholder={t.editorPlaceholder}
              value={block.content}
              onChange={(content) => changeBlock(block.id, { content })}
              contentStyle={textStyleFor(block, doc)}
            />
          </div>
        ) : isBlockEmpty(block) ? (
          <div className={styles.blockPlaceholder} style={{ margin: `${padding.block}px ${padding.inline}px` }}>
            {block.type === 'image' ? <ImageOff aria-hidden="true" /> : <Icon aria-hidden="true" />}
            <span>{block.type === 'image' ? t.editorImageUrl : t.editorPlaceholder}</span>
          </div>
        ) : (
          <div
            className={styles.blockContent}
            // Output of the whitelist renderer: every text and attribute is escaped, links are inert.
            dangerouslySetInnerHTML={{ __html: renderEmailBlockHtml(block, doc.settings, { dir: direction, interactive: false }) }}
          />
        )}
      </GridListItem>
    );
  };

  const canvas = (
    <section className={styles.canvasArea} aria-label={t.emailCanvas}>
      {mode === 'preview' ? (
        <div className={styles.canvasScroller}>
          <iframe
            className={styles.previewFrame}
            style={{ '--_email-width': `${device === 'mobile' ? MOBILE_WIDTH : Math.max(doc.settings.width + 40, 640)}px` } as CSSVariables}
            title={t.emailPreview}
            sandbox=""
            srcDoc={html}
          />
        </div>
      ) : (
        <div className={styles.canvasScroller}>
          <div className={styles.canvasFrame} style={frameStyle} dir={direction} data-device={device}>
            <div className={styles.canvasContent} style={contentStyle}>
              <GridList
                aria-label={t.emailCanvas}
                items={doc.blocks}
                dependencies={[doc, selectedId, isReadOnly, direction, t]}
                selectionMode="single"
                selectionBehavior="replace"
                keyboardNavigationBehavior="tab"
                selectedKeys={selectedId ? [selectedId] : []}
                onSelectionChange={(keys) => setSelectedId(firstKey(keys))}
                dragAndDropHooks={isReadOnly ? undefined : dragAndDropHooks}
                className={styles.blockList}
                renderEmptyState={() => (
                  <EmptyState
                    size="sm"
                    headingLevel={3}
                    icon={<MailPlus />}
                    title={t.emailEmpty}
                    className={styles.empty}
                    description={isReadOnly ? undefined : t.emailAddBlock}
                  />
                )}
              >
                {renderRow}
              </GridList>
            </div>
          </div>
        </div>
      )}
    </section>
  );

  const inspector = (
    <aside className={styles.inspector} aria-labelledby={inspectorHeadingId}>
      {selectedBlock ? (
        <Button variant="ghost" size="sm" startIcon={<Settings2 />} onPress={() => setSelectedId(null)} className={styles.backToSettings}>
          {t.emailSettings}
        </Button>
      ) : null}
      <EmailInspector doc={doc} block={selectedBlock} headingId={inspectorHeadingId} isReadOnly={isReadOnly} onDocChange={commit} onBlockChange={changeBlock} />
    </aside>
  );

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, className)}
      data-compact={compact || undefined}
      role="group"
      aria-label={label ? undefined : (ariaLabel ?? t.emailEditor)}
      aria-labelledby={label ? titleId : undefined}
    >
      <div className={styles.topBar}>
        {label ? (
          <Heading level={2} size="title-md" id={titleId} className={styles.title}>
            {label}
          </Heading>
        ) : null}
        <ToggleGroup
          aria-label={t.emailEditor}
          disallowEmptySelection
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (next === 'edit' || next === 'preview') setMode(next);
          }}
        >
          <Toggle id="edit" size="sm">
            {t.emailEdit}
          </Toggle>
          <Toggle id="preview" size="sm">
            {t.emailPreview}
          </Toggle>
        </ToggleGroup>
        <ToggleGroup
          aria-label={t.emailViewport}
          disallowEmptySelection
          selectedKeys={[device]}
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (next === 'desktop' || next === 'mobile') setDevice(next);
          }}
        >
          <Toggle id="desktop" size="sm">
            {t.emailDesktop}
          </Toggle>
          <Toggle id="mobile" size="sm">
            {t.emailMobile}
          </Toggle>
        </ToggleGroup>
        <div className={styles.topActions}>
          <Button variant="secondary" size="sm" startIcon={<Copy />} onPress={() => void copyHtml()}>
            {t.emailCopyHtml}
          </Button>
          {onExport ? (
            <Button
              variant="primary"
              size="sm"
              startIcon={<Download />}
              onPress={() => onExport(renderEmailHtml(docRef.current, { lang, dir: direction }), docRef.current)}
            >
              {t.emailExportHtml}
            </Button>
          ) : null}
        </div>
      </div>
      {compact ? (
        <Tabs selectedKey={compactTab} onSelectionChange={setCompactTab} className={styles.compactTabs}>
          <TabList aria-label={t.emailEditor}>
            <Tab id="canvas">{t.emailCanvas}</Tab>
            <Tab id="blocks">{t.emailBlocks}</Tab>
            <Tab id="settings">{selectedBlock ? t.emailBlockSettings : t.emailSettings}</Tab>
          </TabList>
          <TabPanel id="canvas">{canvas}</TabPanel>
          <TabPanel id="blocks">{palette}</TabPanel>
          <TabPanel id="settings">{inspector}</TabPanel>
        </Tabs>
      ) : (
        <div className={styles.layout}>
          {palette}
          {canvas}
          {inspector}
        </div>
      )}
      <div role="status" aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {announcement}
      </div>
    </div>
  );
}

function textStyleFor(block: EmailBlock, doc: EmailDocument): CSSVariables {
  const style = getEmailTextStyle(block, doc.settings);
  const align = 'align' in block ? block.align : 'start';
  return {
    fontFamily: doc.settings.fontFamily,
    fontSize: `${style.fontSize}px`,
    lineHeight: `${style.lineHeight}px`,
    fontWeight: style.fontWeight,
    color: style.color,
    textAlign: align,
    '--_email-gap': `${style.gap}px`,
    '--_email-link': doc.settings.accentColor,
  };
}
