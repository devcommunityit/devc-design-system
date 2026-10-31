import {
  getEmailBlockPadding,
  type EmailAlign,
  type EmailBlock,
  type EmailColumnChild,
  type EmailDocument,
  type EmailRichText,
  type EmailSettings,
} from './emailDocument';

export interface EmailRenderOptions {
  /** `lang` of the HTML document. @default 'en' */
  lang?: string;
  /** Text direction; `start`/`end` alignments follow it. @default 'ltr' */
  dir?: 'ltr' | 'rtl';
}

export interface EmailBlockRenderOptions {
  dir?: 'ltr' | 'rtl';
  /** When false, links are rendered as styled `<span>`s (editor canvas). @default true */
  interactive?: boolean;
}

interface Ctx {
  settings: EmailSettings;
  dir: 'ltr' | 'rtl';
  interactive: boolean;
}

/** Typography of rich-text blocks, shared by the HTML renderer and the editor canvas. */
export interface EmailTextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  color: string;
  /** Space after paragraphs and lists in pixels. */
  gap: number;
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
// A merge tag, optionally followed by a path/query/fragment (e.g. `{{site_url}}/events?id=1`).
const MERGE_TAG = /^\{\{\s*[\w.-]+\s*\}\}(?:[/?#].*)?$/;
const SAFE_SCHEME = /^(?:https?:\/\/|mailto:|tel:)/i;
const HEADING_SIZES = { 1: 32, 2: 24, 3: 20 } as const;

const socialLabels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X',
  discord: 'Discord',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitch: 'Twitch',
  mastodon: 'Mastodon',
  bluesky: 'Bluesky',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  rss: 'RSS',
  email: 'Email',
  website: 'Web',
};

/** Display name of a social network id (brand spelling; unknown ids are capitalised). */
export function getEmailSocialLabel(network: string): string {
  if (Object.prototype.hasOwnProperty.call(socialLabels, network)) return socialLabels[network]!;
  return network.charAt(0).toUpperCase() + network.slice(1);
}

/** Escapes text and attribute values (`& < > " '`). */
export function escapeEmailHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Allows only `http(s)://`, `mailto:`, `tel:` and `{{merge_tag}}` placeholders (optionally followed by a path).
 * Anything else, including relative and `javascript:` URLs, becomes `#`.
 */
export function sanitizeEmailUrl(url: string | undefined | null): string {
  const value = Array.from(String(url ?? ''))
    .filter((char) => char.charCodeAt(0) > 31 && char.charCodeAt(0) !== 127)
    .join('')
    .trim();
  if (!value || /\s/.test(value.replace(/\{\{[^}]*\}\}/g, ''))) return '#';
  if (MERGE_TAG.test(value) || SAFE_SCHEME.test(value)) return value;
  return '#';
}

/** Image sources: only `http(s)://` and merge tags. Returns '' when unsafe. */
function sanitizeImageSrc(src: string): string {
  const value = sanitizeEmailUrl(src);
  return value === '#' || /^(?:mailto|tel):/i.test(value) ? '' : value;
}

function color(value: string | undefined, fallback: string): string {
  if (value && (HEX.test(value) || value === 'transparent')) return value;
  return HEX.test(fallback) ? fallback : '#000000';
}

function px(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return Math.round(Math.max(min, Math.min(max, n)));
}

function fontStack(value: string): string {
  return value.replace(/[;{}<>"\\]/g, '').trim() || 'Arial, Helvetica, sans-serif';
}

function physical(align: EmailAlign | undefined, dir: 'ltr' | 'rtl'): 'left' | 'center' | 'right' {
  if (align === 'center') return 'center';
  if (align === 'end') return dir === 'rtl' ? 'left' : 'right';
  return dir === 'rtl' ? 'right' : 'left';
}

const attr = (value: unknown) => escapeEmailHtml(value);
const css = (rules: Record<string, string | number | undefined>) =>
  attr(
    Object.entries(rules)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${k}:${v}`)
      .join(';'),
  );

/** Typography for heading/text/footer blocks. */
export function getEmailTextStyle(block: EmailBlock, settings: EmailSettings): EmailTextStyle {
  const textColor = color(settings.textColor, '#1f2328');
  if (block.type === 'heading') {
    const size = HEADING_SIZES[block.level] ?? 24;
    return { fontSize: size, lineHeight: 1.25, fontWeight: 700, color: color(block.color, textColor), gap: 0 };
  }
  if (block.type === 'footer') return { fontSize: 12, lineHeight: 1.5, fontWeight: 400, color: color(block.color, textColor), gap: 8 };
  if (block.type === 'text') return { fontSize: 16, lineHeight: 1.6, fontWeight: 400, color: color(block.color, textColor), gap: 12 };
  return { fontSize: 16, lineHeight: 1.6, fontWeight: 400, color: textColor, gap: 12 };
}

function textCss(ctx: Ctx, style: EmailTextStyle, align: string, extra: Record<string, string | number | undefined> = {}) {
  return css({
    margin: extra.margin ?? '0',
    'font-family': fontStack(ctx.settings.fontFamily),
    'font-size': `${style.fontSize}px`,
    'line-height': style.lineHeight,
    'font-weight': style.fontWeight,
    color: style.color,
    'text-align': align,
    'mso-line-height-rule': 'exactly',
    ...extra,
  });
}

function renderInline(nodes: EmailRichText[] | undefined, ctx: Ctx): string {
  return (nodes ?? [])
    .map((node) => {
      if (node.type === 'hardBreak') return '<br />';
      if (node.type !== 'text' || typeof node.text !== 'string') return '';
      let html = escapeEmailHtml(node.text);
      const marks = Array.isArray(node.marks) ? node.marks : [];
      const has = (type: string) => marks.some((m) => m && m.type === type);
      if (has('bold')) html = `<strong style="font-weight:700">${html}</strong>`;
      if (has('italic')) html = `<em style="font-style:italic">${html}</em>`;
      if (has('underline')) html = `<u style="text-decoration:underline">${html}</u>`;
      if (has('strike')) html = `<s style="text-decoration:line-through">${html}</s>`;
      const link = marks.find((m) => m && m.type === 'link');
      if (link) {
        const linkStyle = css({ color: color(ctx.settings.accentColor, '#0b5cad'), 'text-decoration': 'underline' });
        html = ctx.interactive
          ? `<a href="${attr(sanitizeEmailUrl(link.attrs?.href as string))}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">${html}</a>`
          : `<span style="${linkStyle}">${html}</span>`;
      }
      return html;
    })
    .join('');
}

function renderList(node: EmailRichText, ctx: Ctx, style: EmailTextStyle, align: string, margin: string): string {
  const tag = node.type === 'orderedList' ? 'ol' : 'ul';
  const items = (node.content ?? [])
    .filter((item) => item.type === 'listItem')
    .map((item) => {
      const parts = (item.content ?? []).map((child) => {
        if (child.type === 'paragraph') return renderInline(child.content, ctx);
        if (child.type === 'bulletList' || child.type === 'orderedList') return renderList(child, ctx, style, align, '4px 0 0');
        return '';
      });
      return `<li style="${css({ margin: '0 0 4px' })}">${parts.filter(Boolean).join('<br />') || '&nbsp;'}</li>`;
    })
    .join('');
  const indent = ctx.dir === 'rtl' ? 'padding-right' : 'padding-left';
  return `<${tag} style="${textCss(ctx, style, align, { margin, padding: '0', [indent]: '24px' })}">${items}</${tag}>`;
}

/**
 * Renders Tiptap JSON through a whitelist (paragraph, heading, bullet/ordered lists, hard breaks and the
 * bold/italic/underline/strike/link marks). Unknown nodes are dropped; all text is escaped.
 */
export function renderEmailRichText(
  content: EmailRichText | undefined,
  options: { settings: EmailSettings; style?: EmailTextStyle; align?: EmailAlign; dir?: 'ltr' | 'rtl'; interactive?: boolean; headingLevel?: 1 | 2 | 3 },
): string {
  const ctx: Ctx = { settings: options.settings, dir: options.dir ?? 'ltr', interactive: options.interactive ?? true };
  const align = physical(options.align, ctx.dir);
  const nodes = content?.type === 'doc' ? (content.content ?? []) : content ? [content] : [];
  const style = options.style ?? { fontSize: 16, lineHeight: 24, fontWeight: 400, color: options.settings.textColor, gap: 16 };
  return nodes
    .map((node, index) => {
      const margin = index === nodes.length - 1 ? '0' : `0 0 ${style.gap}px`;
      if (node.type === 'paragraph') {
        const tag = options.headingLevel ? `h${options.headingLevel}` : 'p';
        return `<${tag} style="${textCss(ctx, style, align, { margin })}">${renderInline(node.content, ctx) || '&nbsp;'}</${tag}>`;
      }
      if (node.type === 'heading') {
        const raw = Number(node.attrs?.level);
        const level = raw === 1 || raw === 2 || raw === 3 ? raw : 3;
        const headingStyle: EmailTextStyle = { ...style, fontSize: HEADING_SIZES[level], lineHeight: 1.25, fontWeight: 700 };
        return `<h${level} style="${textCss(ctx, headingStyle, align, { margin: index === nodes.length - 1 ? '0' : '0 0 8px' })}">${renderInline(node.content, ctx) || '&nbsp;'}</h${level}>`;
      }
      if (node.type === 'bulletList' || node.type === 'orderedList') return renderList(node, ctx, style, align, margin);
      return '';
    })
    .join('');
}

function renderButton(block: Extract<EmailBlock, { type: 'button' }>, ctx: Ctx): string {
  const align = physical(block.align, ctx.dir);
  const fill = color(block.buttonColor, color(ctx.settings.accentColor, '#0b5cad'));
  const fg = color(block.textColor, '#ffffff');
  const radius = px(block.radius, 0, 40, 6);
  const label = escapeEmailHtml(block.label || ' ');
  const linkCss = css({
    display: 'inline-block',
    padding: '12px 24px',
    'font-family': fontStack(ctx.settings.fontFamily),
    'font-size': '16px',
    'font-weight': 700,
    'line-height': 1.2,
    color: fg,
    'text-decoration': 'none',
    'border-radius': `${radius}px`,
    'mso-padding-alt': '0',
    width: block.fullWidth ? '100%' : undefined,
    'box-sizing': block.fullWidth ? 'border-box' : undefined,
    'text-align': 'center',
  });
  const inner = ctx.interactive
    ? `<a href="${attr(sanitizeEmailUrl(block.href))}" target="_blank" rel="noopener noreferrer" style="${linkCss}"><!--[if mso]><i style="mso-font-width:300%;mso-text-raise:18pt">&#8202;</i><![endif]--><span style="mso-text-raise:9pt">${label}</span><!--[if mso]><i style="mso-font-width:300%">&#8202;</i><![endif]--></a>`
    : `<span style="${linkCss}">${label}</span>`;
  const tableAlign = align === 'center' ? 'center' : align;
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${block.fullWidth ? ' width="100%"' : ` align="${tableAlign}"`} style="${css({ 'border-collapse': 'separate', margin: align === 'center' ? '0 auto' : undefined })}">` +
    `<tr><td align="center" bgcolor="${attr(fill)}" style="${css({ 'border-radius': `${radius}px`, 'background-color': fill })}">${inner}</td></tr></table>`
  );
}

function renderImage(block: Extract<EmailBlock, { type: 'image' }>, ctx: Ctx, maxWidth: number): string {
  const src = sanitizeImageSrc(block.src);
  if (!src) return '';
  const width = px(block.width, 16, maxWidth, maxWidth);
  const align = physical(block.align, ctx.dir);
  const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0 auto 0 0';
  const img = `<img src="${attr(src)}" alt="${attr(block.alt ?? '')}" width="${width}" class="dc-fluid" style="${css({ display: 'block', width: '100%', 'max-width': `${width}px`, height: 'auto', border: '0', outline: 'none', 'text-decoration': 'none', margin })}" />`;
  const content =
    block.href && ctx.interactive
      ? `<a href="${attr(sanitizeEmailUrl(block.href))}" target="_blank" rel="noopener noreferrer" style="display:block">${img}</a>`
      : img;
  return `<div style="${css({ 'text-align': align })}">${content}</div>`;
}

function renderSocial(block: Extract<EmailBlock, { type: 'social' }>, ctx: Ctx): string {
  const align = physical(block.align, ctx.dir);
  const linkCss = css({ color: color(ctx.settings.accentColor, '#0b5cad'), 'text-decoration': 'underline', 'font-weight': 700 });
  const links = (block.links ?? [])
    .map((link) => {
      const label = escapeEmailHtml(getEmailSocialLabel(String(link.network ?? '')));
      return ctx.interactive
        ? `<a href="${attr(sanitizeEmailUrl(link.href))}" target="_blank" rel="noopener noreferrer" style="${linkCss}">${label}</a>`
        : `<span style="${linkCss}">${label}</span>`;
    })
    .join(`<span style="${css({ color: color(ctx.settings.textColor, '#1f2328'), padding: '0 8px' })}" aria-hidden="true">&middot;</span>`);
  const style: EmailTextStyle = { fontSize: 14, lineHeight: 1.5, fontWeight: 400, color: color(ctx.settings.textColor, '#1f2328'), gap: 0 };
  return `<p style="${textCss(ctx, style, align)}">${links || '&nbsp;'}</p>`;
}

function renderChild(child: EmailColumnChild, ctx: Ctx, maxWidth: number): string {
  const pad = child.padding ?? { block: 6, inline: 0 };
  const width = Math.max(16, maxWidth - pad.inline * 2);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="${css({ padding: `${px(pad.block, 0, 120, 6)}px ${px(pad.inline, 0, 120, 0)}px`, 'background-color': child.backgroundColor ? color(child.backgroundColor, '#ffffff') : undefined })}">${renderContent(child, ctx, width)}</td></tr></table>`;
}

function renderColumns(block: Extract<EmailBlock, { type: 'columns' }>, ctx: Ctx, innerWidth: number): string {
  const columns = (block.columns ?? []).slice(0, 3);
  if (!columns.length) return '';
  const gap = px(block.gap, 0, 64, 16);
  const colWidth = Math.floor(innerWidth / columns.length);
  const half = Math.floor(gap / 2);
  const cells = columns.map((column, i) => {
    const children = column.map((child) => renderChild(child, ctx, colWidth - gap)).join('');
    const ghost =
      i === 0
        ? `<!--[if mso]><table role="presentation" width="${innerWidth}" cellpadding="0" cellspacing="0" border="0" dir="${ctx.dir}"><tr><td width="${colWidth}" valign="top"><![endif]-->`
        : `<!--[if mso]></td><td width="${colWidth}" valign="top"><![endif]-->`;
    return (
      ghost +
      `<div class="dc-col" style="${css({ display: 'inline-block', width: '100%', 'max-width': `${colWidth}px`, 'vertical-align': 'top' })}">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="${css({ padding: `0 ${half}px` })}">${children || '&nbsp;'}</td></tr></table></div>`
    );
  });
  return `<div class="dc-columns" style="${css({ 'text-align': ctx.dir === 'rtl' ? 'right' : 'left', 'font-size': '0', 'line-height': '0' })}">${cells.join('')}<!--[if mso]></td></tr></table><![endif]--></div>`;
}

function renderContent(block: EmailBlock, ctx: Ctx, innerWidth: number): string {
  switch (block.type) {
    case 'heading':
      return renderEmailRichText(block.content, {
        settings: ctx.settings,
        style: getEmailTextStyle(block, ctx.settings),
        align: block.align,
        dir: ctx.dir,
        interactive: ctx.interactive,
        headingLevel: block.level,
      });
    case 'text':
    case 'footer':
      return renderEmailRichText(block.content, {
        settings: ctx.settings,
        style: getEmailTextStyle(block, ctx.settings),
        align: block.align,
        dir: ctx.dir,
        interactive: ctx.interactive,
      });
    case 'button':
      return renderButton(block, ctx);
    case 'image':
      return renderImage(block, ctx, innerWidth);
    case 'divider':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="${css({ 'border-top': `${px(block.thickness, 1, 12, 1)}px solid ${color(block.color, '#d0d7de')}`, 'font-size': '1px', 'line-height': '1px', height: '1px' })}">&nbsp;</td></tr></table>`;
    case 'spacer': {
      const height = px(block.height, 4, 200, 24);
      return `<div style="${css({ height: `${height}px`, 'line-height': `${height}px`, 'font-size': '1px' })}">&nbsp;</div>`;
    }
    case 'columns':
      return renderColumns(block, ctx, innerWidth);
    case 'social':
      return renderSocial(block, ctx);
    default:
      return '';
  }
}

function renderRow(block: EmailBlock, ctx: Ctx): string {
  const pad = getEmailBlockPadding(block);
  const padBlock = px(pad.block, 0, 120, 0);
  const padInline = px(pad.inline, 0, 120, 0);
  const width = px(ctx.settings.width, 320, 900, 600);
  const content = renderContent(block, ctx, width - padInline * 2);
  if (!content) return '';
  const bg = block.backgroundColor ? color(block.backgroundColor, '#ffffff') : undefined;
  return `<tr><td${bg ? ` bgcolor="${attr(bg)}"` : ''} style="${css({ padding: `${padBlock}px ${padInline}px`, 'background-color': bg })}">${content}</td></tr>`;
}

/** HTML of a single block wrapped in a presentation table (used by the editor canvas). */
export function renderEmailBlockHtml(block: EmailBlock, settings: EmailSettings, options: EmailBlockRenderOptions = {}): string {
  const row = renderRow(block, { settings, dir: options.dir ?? 'ltr', interactive: options.interactive ?? true });
  return row ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">${row}</table>` : '';
}

/**
 * Complete, email-client-safe HTML document: XHTML doctype, inline styles, centered table layout,
 * hidden preheader, Outlook (MSO) ghost tables for columns and a small media query for mobile.
 */
export function renderEmailHtml(doc: EmailDocument, options: EmailRenderOptions = {}): string {
  const dir = options.dir === 'rtl' ? 'rtl' : 'ltr';
  const lang = (options.lang ?? 'en').replace(/[^A-Za-z0-9-]/g, '') || 'en';
  const settings = doc.settings;
  const ctx: Ctx = { settings, dir, interactive: true };
  const width = px(settings.width, 320, 900, 600);
  const bg = color(settings.backgroundColor, '#f4f5f7');
  const contentBg = color(settings.contentBackgroundColor, '#ffffff');
  const font = fontStack(settings.fontFamily);
  const rows = (doc.blocks ?? []).map((block) => renderRow(block, ctx)).join('\n');
  const preheader = doc.preheader?.trim()
    ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all">${escapeEmailHtml(doc.preheader.trim())}${'&#847;&zwnj;&nbsp;'.repeat(40)}</div>\n`
    : '';
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="${attr(lang)}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeEmailHtml(doc.subject ?? '')}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style type="text/css">
body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
@media only screen and (max-width:${width + 20}px){
.dc-container{width:100%!important;max-width:100%!important}
.dc-col{display:block!important;width:100%!important;max-width:100%!important}
.dc-fluid{width:100%!important;max-width:100%!important;height:auto!important}
}
</style>
</head>
<body style="margin:0;padding:0;background-color:${bg}">
${preheader}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="background-color:${bg}" dir="${dir}">
<tr><td align="center" style="padding:24px 8px">
<!--[if mso]><table role="presentation" width="${width}" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="dc-container" width="${width}" cellpadding="0" cellspacing="0" border="0" bgcolor="${contentBg}" style="${css({ width: '100%', 'max-width': `${width}px`, margin: '0 auto', 'background-color': contentBg, 'font-family': font })}">
${rows}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>
`;
}

function richToText(node: EmailRichText | undefined): string {
  if (!node) return '';
  const inline = (nodes: EmailRichText[] | undefined) =>
    (nodes ?? [])
      .map((n) => {
        if (n.type === 'hardBreak') return '\n';
        if (n.type !== 'text') return '';
        const link = n.marks?.find((m) => m.type === 'link');
        const href = link ? sanitizeEmailUrl(link.attrs?.href as string) : '#';
        return link && href !== '#' && href !== n.text ? `${n.text} (${href})` : (n.text ?? '');
      })
      .join('');
  const list = (l: EmailRichText, depth: number): string =>
    (l.content ?? [])
      .map((item, i) => {
        const bullet = l.type === 'orderedList' ? `${i + 1}.` : '-';
        return (item.content ?? [])
          .map((c) =>
            c.type === 'paragraph'
              ? `${'  '.repeat(depth)}${bullet} ${inline(c.content)}`
              : c.type === 'bulletList' || c.type === 'orderedList'
                ? list(c, depth + 1)
                : '',
          )
          .filter(Boolean)
          .join('\n');
      })
      .join('\n');
  const nodes = node.type === 'doc' ? (node.content ?? []) : [node];
  return nodes
    .map((n) => (n.type === 'paragraph' || n.type === 'heading' ? inline(n.content) : n.type === 'bulletList' || n.type === 'orderedList' ? list(n, 0) : ''))
    .filter((s) => s.trim())
    .join('\n\n');
}

function blockToText(block: EmailBlock): string {
  switch (block.type) {
    case 'heading':
      return richToText(block.content).toUpperCase();
    case 'text':
    case 'footer':
      return richToText(block.content);
    case 'button': {
      const href = sanitizeEmailUrl(block.href);
      return href === '#' ? block.label : `${block.label}: ${href}`;
    }
    case 'image':
      return block.alt ? `[${block.alt}]${block.href && sanitizeEmailUrl(block.href) !== '#' ? ` ${sanitizeEmailUrl(block.href)}` : ''}` : '';
    case 'divider':
      return '----------';
    case 'columns':
      return block.columns
        .flatMap((column) => column.map(blockToText))
        .filter(Boolean)
        .join('\n\n');
    case 'social':
      return block.links.map((link) => `${getEmailSocialLabel(link.network)}: ${sanitizeEmailUrl(link.href)}`).join('\n');
    default:
      return '';
  }
}

/** Plain-text alternative (multipart/alternative): headings uppercase, links as `text (url)`. */
export function renderEmailText(doc: EmailDocument): string {
  return `${doc.blocks
    .map(blockToText)
    .filter((s) => s.trim())
    .join('\n\n')}\n`;
}
