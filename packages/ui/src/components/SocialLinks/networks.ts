import {
  AtSign,
  BriefcaseBusiness,
  Camera,
  CirclePlay,
  Cloud,
  CodeXml,
  Globe,
  Link,
  Mail,
  MessageCircle,
  MessagesSquare,
  Phone,
  Rss,
  Send,
  ThumbsUp,
  Tv,
  type LucideIcon,
} from 'lucide-react';

export type KnownSocialNetwork =
  | 'github'
  | 'linkedin'
  | 'youtube'
  | 'x'
  | 'discord'
  | 'instagram'
  | 'facebook'
  | 'twitch'
  | 'mastodon'
  | 'bluesky'
  | 'telegram'
  | 'whatsapp'
  | 'rss'
  | 'email'
  | 'website';

/** A known network id, or any custom id (rendered with a generic link icon). */
export type SocialNetwork = KnownSocialNetwork | (string & {});

export interface SocialNetworkInfo {
  /** Display name (brand spelling). */
  name: string;
  /** Icon component; decorative, rendered with `aria-hidden`. */
  icon: LucideIcon;
}

/*
 * The installed lucide-react ships no brand logos, so every network uses a generic,
 * recognisable glyph. Pass `icon` on an item to use an official logo instead.
 */
export const socialNetworks: Record<KnownSocialNetwork, SocialNetworkInfo> = {
  github: { name: 'GitHub', icon: CodeXml },
  linkedin: { name: 'LinkedIn', icon: BriefcaseBusiness },
  youtube: { name: 'YouTube', icon: CirclePlay },
  x: { name: 'X', icon: AtSign },
  discord: { name: 'Discord', icon: MessagesSquare },
  instagram: { name: 'Instagram', icon: Camera },
  facebook: { name: 'Facebook', icon: ThumbsUp },
  twitch: { name: 'Twitch', icon: Tv },
  mastodon: { name: 'Mastodon', icon: MessageCircle },
  bluesky: { name: 'Bluesky', icon: Cloud },
  telegram: { name: 'Telegram', icon: Send },
  whatsapp: { name: 'WhatsApp', icon: Phone },
  rss: { name: 'RSS', icon: Rss },
  email: { name: 'Email', icon: Mail },
  website: { name: 'Web', icon: Globe },
};

/** Metadata for a network id; unknown ids get a capitalised name and a generic link icon. */
export function getSocialNetwork(network: SocialNetwork): SocialNetworkInfo {
  if (Object.prototype.hasOwnProperty.call(socialNetworks, network)) {
    return socialNetworks[network as KnownSocialNetwork];
  }
  return { name: network.charAt(0).toUpperCase() + network.slice(1), icon: Link };
}
