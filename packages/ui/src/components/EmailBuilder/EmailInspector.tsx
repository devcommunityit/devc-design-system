import { AlignCenter, AlignLeft, AlignRight, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { Button } from '../Button/Button';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { Fieldset } from '../Fieldset/Fieldset';
import { IconButton } from '../IconButton/IconButton';
import { ListBoxItem } from '../ListBox/ListBox';
import { NumberInput } from '../NumberInput/NumberInput';
import { Select } from '../Select/Select';
import { TextField } from '../TextField/TextField';
import { Toggle, ToggleGroup } from '../Toggle/Toggle';
import { Text } from '../Typography/Typography';
import { blockName } from './blockLabels';
import { EmailInlineEditor } from './EmailInlineEditor';
import {
  createEmailBlock,
  emailColumnChildTypes,
  emailFontStacks,
  getEmailBlockPadding,
  type EmailAlign,
  type EmailBlock,
  type EmailColumnChild,
  type EmailDocument,
  type EmailSettings,
} from './emailDocument';
import { getEmailSocialLabel, getEmailTextStyle } from './renderEmailHtml';
import styles from './EmailBuilder.module.css';

const socialNetworkIds = [
  'github',
  'linkedin',
  'youtube',
  'x',
  'discord',
  'instagram',
  'facebook',
  'twitch',
  'mastodon',
  'bluesky',
  'telegram',
  'whatsapp',
  'rss',
  'email',
  'website',
];

function AlignField({ value, onChange, isDisabled }: { value: EmailAlign; onChange: (value: EmailAlign) => void; isDisabled?: boolean }) {
  const t = useMessages();
  const { direction } = useLocale();
  const startIcon = direction === 'rtl' ? <AlignRight /> : <AlignLeft />;
  const endIcon = direction === 'rtl' ? <AlignLeft /> : <AlignRight />;
  return (
    <div className={styles.fieldGroup}>
      <Text as="span" variant="label-md">
        {t.editorAlign}
      </Text>
      <ToggleGroup
        aria-label={t.editorAlign}
        selectedKeys={[value]}
        disallowEmptySelection
        isDisabled={isDisabled}
        onSelectionChange={(keys) => {
          const next = [...keys][0];
          if (next) onChange(next as EmailAlign);
        }}
      >
        <Toggle id="start" size="sm" aria-label={t.editorAlignStart} icon={startIcon} />
        <Toggle id="center" size="sm" aria-label={t.editorAlignCenter} icon={<AlignCenter />} />
        <Toggle id="end" size="sm" aria-label={t.editorAlignEnd} icon={endIcon} />
      </ToggleGroup>
    </div>
  );
}

function ColorField({ label, value, onChange, isReadOnly }: { label: string; value: string; onChange: (hex: string) => void; isReadOnly?: boolean }) {
  return <ColorPicker label={label} value={value} isReadOnly={isReadOnly} onChange={(color) => onChange(color.toString('hex'))} />;
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  isReadOnly,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  isReadOnly?: boolean;
}) {
  return (
    <NumberInput
      label={label}
      value={value}
      minValue={min}
      maxValue={max}
      step={step}
      isReadOnly={isReadOnly}
      onChange={(next) => {
        if (Number.isFinite(next)) onChange(next);
      }}
    />
  );
}

interface ChildFieldsProps {
  block: EmailColumnChild;
  settings: EmailSettings;
  onChange: (patch: Partial<EmailColumnChild>) => void;
  isReadOnly?: boolean;
}

function ContentFields({
  block,
  settings,
  onChange,
  isReadOnly,
}: {
  block: EmailBlock;
  settings: EmailSettings;
  onChange: (patch: Partial<EmailBlock>) => void;
  isReadOnly?: boolean;
}) {
  const t = useMessages();
  switch (block.type) {
    case 'heading':
    case 'text':
    case 'footer':
      return null;
    case 'button':
      return (
        <>
          <TextField label={t.emailButtonLabel} value={block.label} isReadOnly={isReadOnly} onChange={(label) => onChange({ label })} />
          <TextField label={t.emailLinkUrl} type="url" value={block.href} isReadOnly={isReadOnly} onChange={(href) => onChange({ href })} />
          <ColorField
            label={t.emailBackground}
            value={block.buttonColor ?? settings.accentColor}
            isReadOnly={isReadOnly}
            onChange={(buttonColor) => onChange({ buttonColor })}
          />
          <ColorField label={t.emailTextColor} value={block.textColor ?? '#ffffff'} isReadOnly={isReadOnly} onChange={(textColor) => onChange({ textColor })} />
        </>
      );
    case 'image':
      return (
        <>
          <TextField label={t.editorImageUrl} type="url" value={block.src} isReadOnly={isReadOnly} onChange={(src) => onChange({ src })} />
          <TextField
            label={t.editorImageAlt}
            value={block.alt}
            isRequired
            isReadOnly={isReadOnly}
            isInvalid={!block.alt.trim()}
            onChange={(alt) => onChange({ alt })}
          />
          <TextField label={t.emailLinkUrl} type="url" value={block.href ?? ''} isReadOnly={isReadOnly} onChange={(href) => onChange({ href })} />
          <NumberField
            label={t.emailWidth}
            value={block.width}
            min={16}
            max={settings.width}
            step={8}
            isReadOnly={isReadOnly}
            onChange={(width) => onChange({ width })}
          />
        </>
      );
    case 'divider':
      return (
        <>
          <ColorField label={t.emailBlockDivider} value={block.color} isReadOnly={isReadOnly} onChange={(color) => onChange({ color })} />
          <NumberField
            label={t.emailHeight}
            value={block.thickness}
            min={1}
            max={12}
            isReadOnly={isReadOnly}
            onChange={(thickness) => onChange({ thickness })}
          />
        </>
      );
    case 'spacer':
      return (
        <NumberField
          label={t.emailHeight}
          value={block.height}
          min={4}
          max={200}
          step={4}
          isReadOnly={isReadOnly}
          onChange={(height) => onChange({ height })}
        />
      );
    default:
      return null;
  }
}

function ColumnChildEditor({ block, settings, onChange, onRemove, isReadOnly }: ChildFieldsProps & { onRemove: () => void }) {
  const t = useMessages();
  const name = blockName(block.type, t);
  return (
    <div className={styles.childCard}>
      <div className={styles.childHeader}>
        <Text as="span" variant="label-md">
          {name}
        </Text>
        {!isReadOnly ? <IconButton size="sm" label={`${t.editorDelete}: ${name}`} icon={<Trash2 />} onPress={onRemove} /> : null}
      </div>
      {block.type === 'heading' || block.type === 'text' ? (
        <EmailInlineEditor
          label={name}
          variant={block.type === 'heading' ? 'heading' : 'text'}
          value={block.content}
          isReadOnly={isReadOnly}
          className={styles.inspectorEditor}
          contentStyle={{ fontFamily: settings.fontFamily, color: getEmailTextStyle(block, settings).color, backgroundColor: settings.contentBackgroundColor }}
          onChange={(content) => onChange({ content })}
        />
      ) : null}
      <ContentFields block={block} settings={settings} isReadOnly={isReadOnly} onChange={onChange as (patch: Partial<EmailBlock>) => void} />
      {block.type !== 'image' ? <AlignField value={block.align} isDisabled={isReadOnly} onChange={(align) => onChange({ align })} /> : null}
    </div>
  );
}

export interface EmailInspectorProps {
  doc: EmailDocument;
  block: EmailBlock | null;
  onDocChange: (doc: EmailDocument) => void;
  onBlockChange: (id: string, patch: Partial<EmailBlock>) => void;
  isReadOnly?: boolean;
  headingId?: string;
}

/** Right panel: settings of the selected block, or of the whole email when nothing is selected. */
export function EmailInspector({ doc, block, onDocChange, onBlockChange, isReadOnly, headingId }: EmailInspectorProps) {
  const t = useMessages();
  const { settings } = doc;
  const setSettings = (patch: Partial<EmailSettings>) => onDocChange({ ...doc, settings: { ...settings, ...patch } });

  if (!block) {
    return (
      <section className={styles.inspectorBody} aria-labelledby={headingId}>
        <h3 id={headingId} className={styles.panelTitle}>
          {t.emailSettings}
        </h3>
        <Text tone="secondary" variant="body-sm">
          {t.emailNoSelection}
        </Text>
        <TextField label={t.emailSubject} value={doc.subject ?? ''} isReadOnly={isReadOnly} onChange={(subject) => onDocChange({ ...doc, subject })} />
        <TextField label={t.emailPreheader} value={doc.preheader ?? ''} isReadOnly={isReadOnly} onChange={(preheader) => onDocChange({ ...doc, preheader })} />
        <Select
          label={t.emailFont}
          selectedKey={emailFontStacks.find((f) => f.stack === settings.fontFamily)?.id ?? null}
          isDisabled={isReadOnly}
          onSelectionChange={(key) => {
            const font = emailFontStacks.find((f) => f.id === key);
            if (font) setSettings({ fontFamily: font.stack });
          }}
          items={emailFontStacks}
        >
          {(font) => (
            <ListBoxItem id={font.id} textValue={font.label}>
              <span style={{ fontFamily: font.stack }}>{font.label}</span>
            </ListBoxItem>
          )}
        </Select>
        <NumberField
          label={t.emailWidth}
          value={settings.width}
          min={480}
          max={800}
          step={10}
          isReadOnly={isReadOnly}
          onChange={(width) => setSettings({ width })}
        />
        <ColorField
          label={t.emailBackground}
          value={settings.backgroundColor}
          isReadOnly={isReadOnly}
          onChange={(backgroundColor) => setSettings({ backgroundColor })}
        />
        <ColorField
          label={t.emailContentBackground}
          value={settings.contentBackgroundColor}
          isReadOnly={isReadOnly}
          onChange={(contentBackgroundColor) => setSettings({ contentBackgroundColor })}
        />
        <ColorField label={t.emailTextColor} value={settings.textColor} isReadOnly={isReadOnly} onChange={(textColor) => setSettings({ textColor })} />
        <ColorField label={t.emailAccentColor} value={settings.accentColor} isReadOnly={isReadOnly} onChange={(accentColor) => setSettings({ accentColor })} />
      </section>
    );
  }

  const update = (patch: Partial<EmailBlock>) => onBlockChange(block.id, patch);
  const padding = getEmailBlockPadding(block);
  let specific: ReactNode = null;

  if (block.type === 'heading') {
    specific = (
      <div className={styles.fieldGroup}>
        <Text as="span" variant="label-md">
          {t.editorTextStyle}
        </Text>
        <ToggleGroup
          aria-label={t.editorTextStyle}
          selectedKeys={[String(block.level)]}
          disallowEmptySelection
          isDisabled={isReadOnly}
          onSelectionChange={(keys) => {
            const level = Number([...keys][0]);
            if (level === 1 || level === 2 || level === 3) update({ level });
          }}
        >
          {[1, 2, 3].map((level) => (
            <Toggle key={level} id={String(level)} size="sm" aria-label={t.editorHeading(level)}>
              {`H${level}`}
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
    );
  } else if (block.type === 'columns') {
    const setColumns = (columns: EmailColumnChild[][]) => update({ columns } as Partial<EmailBlock>);
    specific = (
      <>
        <div className={styles.fieldGroup}>
          <Text as="span" variant="label-md">
            {t.emailBlockColumns}
          </Text>
          <ToggleGroup
            aria-label={t.emailBlockColumns}
            selectedKeys={[String(block.columns.length)]}
            disallowEmptySelection
            isDisabled={isReadOnly}
            onSelectionChange={(keys) => {
              const count = Number([...keys][0]);
              if (count !== 2 && count !== 3) return;
              const next = block.columns.slice(0, count);
              while (next.length < count) next.push([createEmailBlock('text', { padding: { block: 0, inline: 0 } })]);
              setColumns(next);
            }}
          >
            <Toggle id="2" size="sm">
              2
            </Toggle>
            <Toggle id="3" size="sm">
              3
            </Toggle>
          </ToggleGroup>
        </div>
        {block.columns.map((column, columnIndex) => (
          <Fieldset key={columnIndex} legend={`${t.emailBlockColumns} ${columnIndex + 1}`} legendVariant="label" className={styles.columnFieldset}>
            {column.map((child, childIndex) => (
              <ColumnChildEditor
                key={child.id}
                block={child}
                settings={settings}
                isReadOnly={isReadOnly}
                onChange={(patch) =>
                  setColumns(
                    block.columns.map((col, ci) =>
                      ci === columnIndex ? col.map((c, i) => (i === childIndex ? ({ ...c, ...patch } as EmailColumnChild) : c)) : col,
                    ),
                  )
                }
                onRemove={() => setColumns(block.columns.map((col, ci) => (ci === columnIndex ? col.filter((_, i) => i !== childIndex) : col)))}
              />
            ))}
            {!isReadOnly ? (
              <div className={styles.addChild}>
                {emailColumnChildTypes.map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant="ghost"
                    startIcon={<Plus />}
                    aria-label={`${t.emailAddBlock}: ${blockName(type, t)} (${t.emailBlockColumns} ${columnIndex + 1})`}
                    onPress={() =>
                      setColumns(
                        block.columns.map((col, ci) =>
                          ci === columnIndex
                            ? [
                                ...col,
                                createEmailBlock(type, {
                                  padding: { block: 6, inline: 0 },
                                  ...(type === 'button' ? { label: t.emailBlockButton } : {}),
                                  ...(type === 'image' ? { width: 260 } : {}),
                                }),
                              ]
                            : col,
                        ),
                      )
                    }
                  >
                    {blockName(type, t)}
                  </Button>
                ))}
              </div>
            ) : null}
          </Fieldset>
        ))}
      </>
    );
  } else if (block.type === 'social') {
    const setLinks = (links: typeof block.links) => update({ links } as Partial<EmailBlock>);
    specific = (
      <>
        {block.links.map((link, index) => (
          <div key={index} className={styles.childCard}>
            <Select
              label={t.emailBlockSocial}
              selectedKey={link.network}
              isDisabled={isReadOnly}
              onSelectionChange={(key) => setLinks(block.links.map((l, i) => (i === index ? { ...l, network: String(key) } : l)))}
              items={(socialNetworkIds.includes(link.network) ? socialNetworkIds : [...socialNetworkIds, link.network]).map((id) => ({ id }))}
            >
              {(item) => (
                <ListBoxItem id={item.id} textValue={getEmailSocialLabel(item.id)}>
                  {getEmailSocialLabel(item.id)}
                </ListBoxItem>
              )}
            </Select>
            <TextField
              label={t.emailLinkUrl}
              type="url"
              value={link.href}
              isReadOnly={isReadOnly}
              onChange={(href) => setLinks(block.links.map((l, i) => (i === index ? { ...l, href } : l)))}
            />
            {!isReadOnly ? (
              <Button size="sm" variant="ghost" startIcon={<Trash2 />} onPress={() => setLinks(block.links.filter((_, i) => i !== index))}>
                {t.editorDelete}
              </Button>
            ) : null}
          </div>
        ))}
        {!isReadOnly ? (
          <Button size="sm" variant="secondary" startIcon={<Plus />} onPress={() => setLinks([...block.links, { network: 'website', href: 'https://' }])}>
            {t.emailAddBlock}
          </Button>
        ) : null}
      </>
    );
  }

  const hasAlign =
    block.type === 'heading' ||
    block.type === 'text' ||
    block.type === 'footer' ||
    block.type === 'button' ||
    block.type === 'image' ||
    block.type === 'social';
  const hasColor = block.type === 'heading' || block.type === 'text' || block.type === 'footer';

  return (
    <section className={styles.inspectorBody} aria-labelledby={headingId}>
      <h3 id={headingId} className={styles.panelTitle}>
        {t.emailBlockSettings}: {blockName(block.type, t)}
      </h3>
      {specific}
      <ContentFields block={block} settings={settings} isReadOnly={isReadOnly} onChange={update} />
      {hasAlign ? <AlignField value={block.align} isDisabled={isReadOnly} onChange={(align) => update({ align })} /> : null}
      {hasColor ? (
        <ColorField
          label={t.emailTextColor}
          value={getEmailTextStyle(block, settings).color}
          isReadOnly={isReadOnly}
          onChange={(color) => update({ color } as Partial<EmailBlock>)}
        />
      ) : null}
      <ColorField
        label={t.emailBackground}
        value={block.backgroundColor ?? settings.contentBackgroundColor}
        isReadOnly={isReadOnly}
        onChange={(backgroundColor) => update({ backgroundColor })}
      />
      {block.type !== 'spacer' ? (
        <Fieldset legend={t.emailPadding} legendVariant="label" className={styles.paddingFieldset}>
          <NumberField
            label={t.emailHeight}
            value={padding.block}
            min={0}
            max={120}
            step={4}
            isReadOnly={isReadOnly}
            onChange={(value) => update({ padding: { ...padding, block: value } })}
          />
          <NumberField
            label={t.emailWidth}
            value={padding.inline}
            min={0}
            max={120}
            step={4}
            isReadOnly={isReadOnly}
            onChange={(value) => update({ padding: { ...padding, inline: value } })}
          />
        </Fieldset>
      ) : null}
    </section>
  );
}
