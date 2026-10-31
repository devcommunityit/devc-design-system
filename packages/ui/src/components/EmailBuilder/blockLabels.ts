import { Columns2, Heading, Image, MousePointerClick, Minus, MoveVertical, PanelBottom, Share2, Type, type LucideIcon } from 'lucide-react';
import type { Messages } from '../../i18n/messages';
import type { EmailBlockType } from './emailDocument';

export const blockIcons: Record<EmailBlockType, LucideIcon> = {
  heading: Heading,
  text: Type,
  button: MousePointerClick,
  image: Image,
  divider: Minus,
  spacer: MoveVertical,
  columns: Columns2,
  social: Share2,
  footer: PanelBottom,
};

export function blockName(type: EmailBlockType, t: Messages): string {
  const names: Record<EmailBlockType, string> = {
    heading: t.emailBlockHeading,
    text: t.emailBlockText,
    button: t.emailBlockButton,
    image: t.emailBlockImage,
    divider: t.emailBlockDivider,
    spacer: t.emailBlockSpacer,
    columns: t.emailBlockColumns,
    social: t.emailBlockSocial,
    footer: t.emailBlockFooter,
  };
  return names[type];
}
