/**
 * System strings used by components. Every string is replaceable through
 * `<LocaleProvider messages={...}>`; nothing is hard-coded in components.
 */
import type { ThemeIssue, ThemeIssueCode, ThemeIssueParams } from '../theme/types';
import { componentMessagesEn, componentMessagesIt, type ComponentMessages } from './componentMessages';

export interface Messages {
  components: ComponentMessages;
  aiPrompt: string;
  aiSend: string;
  aiStop: string;
  aiUser: string;
  aiAssistant: string;
  aiSystem: string;
  aiGenerating: string;
  aiSuggestions: string;
  aiSources: string;
  aiFeedback: string;
  aiHelpful: string;
  aiNotHelpful: string;
  publishDraft: string;
  publishPublished: string;
  publishScheduled: string;
  publishArchived: string;
  bulkActions: string;
  seoPreview: string;
  close: string;
  cancel: string;
  confirm: string;
  dismiss: string;
  loading: string;
  clear: string;
  remove: (label: string) => string;
  required: string;
  optional: string;
  showMore: string;
  showLess: string;
  copy: string;
  copied: string;
  showPassword: string;
  hidePassword: string;
  search: string;
  noResults: string;
  noOptions: string;
  selectedCount: (count: number) => string;
  breadcrumb: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  firstPage: string;
  lastPage: string;
  goToPage: (page: number) => string;
  pageOf: (page: number, total: number) => string;
  rowsPerPage: string;
  rangeOf: (start: number, end: number, total: number) => string;
  selectAll: string;
  selectRow: string;
  noData: string;
  loadError: string;
  retry: string;
  openMenu: string;
  closeMenu: string;
  mainNavigation: string;
  notifications: string;
  stepOf: (step: number, total: number) => string;
  stepCompleted: string;
  stepCurrent: string;
  moreItems: (count: number) => string;
  commandPalette: string;
  commandPlaceholder: string;
  dropFiles: string;
  browseFiles: string;
  fileConstraints: (parts: { accept?: string; maxSize?: string; maxFiles?: number }) => string;
  fileTooLarge: (name: string, max: string) => string;
  fileInvalidType: (name: string) => string;
  tooManyFiles: (max: number) => string;
  fileStatus: { pending: string; uploading: string; success: string; error: string };
  filesSelected: (count: number) => string;
  colorPicker: string;
  hue: string;
  sortAscending: string;
  sortDescending: string;
  filters: string;
  clearFilters: string;
  skipToContent: string;
  sidebar: string;
  opensInNewTab: string;
  codeBlock: string;
  scrollableRegion: string;
  more: string;
  stepError: string;
  trendUp: string;
  trendDown: string;
  trendNeutral: string;
  minimum: string;
  maximum: string;
  previousMonth: string;
  nextMonth: string;
  chooseDate: string;
  openCalendar: string;
  /** Date/time picker shortcuts and actions. */
  today: string;
  now: string;
  tomorrow: string;
  yesterday: string;
  nextWeek: string;
  last7Days: string;
  last30Days: string;
  thisMonth: string;
  lastMonth: string;
  done: string;
  datePresets: string;
  chooseTime: string;
  timeSlots: string;
  calendarMonth: string;
  calendarYear: string;
  selectedItems: string;
  increase: string;
  decrease: string;
  info: string;
  success: string;
  warning: string;
  error: string;
  progress: string;
  status: string;
  wrapLines: string;
  /** Accessible name of the UserMenu trigger. */
  accountMenu: (name: string) => string;
  signOut: string;
  siteNavigation: string;
  authEmail: string;
  authUsername: string;
  authPassword: string;
  authConfirmPassword: string;
  authFullName: string;
  authRememberMe: string;
  authForgotPassword: string;
  authSignIn: string;
  authSignUp: string;
  authSendResetLink: string;
  authOrContinueWith: string;
  authRequiredField: string;
  authInvalidEmail: string;
  authPasswordTooShort: (min: number) => string;
  authPasswordHint: (min: number) => string;
  authPasswordsDoNotMatch: string;
  authAcceptTermsRequired: string;
  authResetLinkSent: string;
  authResetLinkSentTitle: string;
  copyFailed: string;
  moreActions: string;
  pinDigit: (index: number, total: number) => string;
  ratingValue: (value: number, max: number) => string;
  moveUp: (label: string) => string;
  moveDown: (label: string) => string;
  itemMoved: (label: string, position: number, total: number) => string;
  notificationsUnread: (count: number) => string;
  markAllRead: string;
  markAsRead: (title: string) => string;
  unread: string;
  noNotifications: string;
  chartData: string;
  showChartData: string;
  hideChartData: string;
  chartCategory: string;
  chartTotal: string;
  chartKeyboardHint: string;
  chartValue: string;
  chartTarget: string;
  /** Funnel step share of the first step. */
  chartConversion: string;
  chartSeries: string;
  /** GoalCard: amount still missing (already formatted). */
  goalRemaining: (value: string) => string;
  goalReached: string;
  /** Community: event attendance mode. */
  eventModeOnline: string;
  eventModeHybrid: string;
  eventModeInPerson: string;
  /** Community: pricing table selection and comparison labels. */
  pricingSelectPlan: string;
  pricingFeatures: string;
  pricingIncluded: string;
  pricingNotIncluded: string;
  /** Community: seats taken out of capacity (already formatted). */
  eventSeats: (taken: string, capacity: string) => string;
  /** Community: few seats left; `count` drives plural, `formatted` is displayed. */
  eventSeatsLeft: (count: number, formatted: string) => string;
  eventSoldOut: string;
  /** Community: reading time (minutes already formatted). */
  readingTime: (minutes: string) => string;
  reactionLike: string;
  reactionComment: string;
  reactionBookmark: string;
  upvote: string;
  removeUpvote: string;
  votes: (count: number, formatted: string) => string;
  replies: (count: number, formatted: string) => string;
  /** Community: leaderboard points (already formatted). */
  points: (formatted: string) => string;
  /** Community: completed modules out of total (already formatted). */
  modulesProgress: (done: string, total: string) => string;
  newsletterEmail: string;
  newsletterSubscribe: string;
  newsletterSubscribed: string;
  live: string;
  liveViewers: (count: number, formatted: string) => string;
  isNew: string;
  /** Website release stage labels (StageLabel). */
  stageAlpha: string;
  stageBeta: string;
  stagePreview: string;
  stageDemo: string;
  stageExperimental: string;
  stageDeprecated: string;
  stageComingSoon: string;
  /** Sharing (ShareButtons). */
  share: string;
  copyLink: string;
  linkCopied: string;
  /** `network` is the brand name, e.g. "LinkedIn". */
  shareOn: (network: string) => string;
  /** Social profile link accessible name; `network` is the brand name. */
  socialProfile: (network: string) => string;
  /** AchievementBadge. */
  achievementLocked: string;
  achievementTierBronze: string;
  achievementTierSilver: string;
  achievementTierGold: string;
  achievementTierPlatinum: string;
  /** Earned on (date already formatted). */
  achievementEarned: (date: string) => string;
  editorLabel: string;
  editorToolbar: string;
  editorPlaceholder: string;
  editorSlashHint: string;
  editorUndo: string;
  editorRedo: string;
  editorBold: string;
  editorItalic: string;
  editorUnderline: string;
  editorStrike: string;
  editorCode: string;
  editorHighlight: string;
  editorLink: string;
  editorRemoveLink: string;
  editorLinkUrl: string;
  editorOpenInNewTab: string;
  editorApply: string;
  editorCancel: string;
  editorTextStyle: string;
  editorParagraph: string;
  editorHeading: (level: number) => string;
  editorBulletList: string;
  editorOrderedList: string;
  editorTaskList: string;
  editorBlockquote: string;
  editorCodeBlock: string;
  editorDivider: string;
  editorImage: string;
  editorImageUrl: string;
  editorImageAlt: string;
  editorTable: string;
  editorAddRow: string;
  editorAddColumn: string;
  editorDeleteRow: string;
  editorDeleteColumn: string;
  editorDeleteTable: string;
  editorAlign: string;
  editorAlignStart: string;
  editorAlignCenter: string;
  editorAlignEnd: string;
  editorAlignJustify: string;
  editorClearFormatting: string;
  editorInsert: string;
  editorInsertBlock: string;
  editorNoResults: string;
  editorBlockActions: string;
  editorDragBlock: string;
  editorMoveUp: string;
  editorMoveDown: string;
  editorDuplicate: string;
  editorDelete: string;
  editorWords: (count: number, formatted: string) => string;
  editorCharacters: (count: number, formatted: string) => string;
  editorCharactersLeft: (count: number, formatted: string) => string;
  emailEditor: string;
  emailBlocks: string;
  emailAddBlock: string;
  emailBlockHeading: string;
  emailBlockText: string;
  emailBlockButton: string;
  emailBlockImage: string;
  emailBlockDivider: string;
  emailBlockSpacer: string;
  emailBlockColumns: string;
  emailBlockSocial: string;
  emailBlockFooter: string;
  emailCanvas: string;
  emailEmpty: string;
  emailSettings: string;
  emailBlockSettings: string;
  emailNoSelection: string;
  emailSubject: string;
  emailPreheader: string;
  emailEdit: string;
  emailPreview: string;
  emailViewport: string;
  emailDesktop: string;
  emailMobile: string;
  emailButtonLabel: string;
  emailLinkUrl: string;
  emailBackground: string;
  emailContentBackground: string;
  emailTextColor: string;
  emailAccentColor: string;
  emailFont: string;
  emailWidth: string;
  emailHeight: string;
  emailPadding: string;
  emailCopyHtml: string;
  emailHtmlCopied: string;
  emailExportHtml: string;
  emailBlockPosition: (index: number, total: number) => string;
  emailBlockAdded: (name: string) => string;
  emailBlockRemoved: (name: string) => string;
  emailBlockMoved: (name: string, index: number, total: number) => string;
  expandNavigation: string;
  collapseNavigation: string;
  /** Text summary of a series (values already formatted), used by Sparkline. */
  chartSummary: (values: { first: string; last: string; min: string; max: string }) => string;
  /**
   * End-user messages for theme validation issues, one per `ThemeIssue.code`. The JSON path
   * (`issue.path`) is not included: show it separately. Use `formatThemeIssue(issue, messages)`.
   */
  themeIssue: { readonly [C in ThemeIssueCode]: (params: ThemeIssueParams) => string };
}

export const en: Messages = {
  components: componentMessagesEn,
  aiPrompt: 'Write a prompt',
  aiSend: 'Send',
  aiStop: 'Stop generating',
  aiUser: 'You',
  aiAssistant: 'Assistant',
  aiSystem: 'System',
  aiGenerating: 'Generating response…',
  aiSuggestions: 'Suggested prompts',
  aiSources: 'Sources',
  aiFeedback: 'Response feedback',
  aiHelpful: 'Helpful',
  aiNotHelpful: 'Not helpful',
  publishDraft: 'Draft',
  publishPublished: 'Published',
  publishScheduled: 'Scheduled',
  publishArchived: 'Archived',
  bulkActions: 'Bulk actions',
  seoPreview: 'Search result preview',
  close: 'Close',
  cancel: 'Cancel',
  confirm: 'Confirm',
  dismiss: 'Dismiss',
  loading: 'Loading…',
  clear: 'Clear',
  remove: (label) => `Remove ${label}`,
  required: 'required',
  optional: 'optional',
  showMore: 'Show more',
  showLess: 'Show less',
  copy: 'Copy',
  copied: 'Copied',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  search: 'Search',
  noResults: 'No results',
  noOptions: 'No options',
  selectedCount: (n) => (n === 1 ? '1 selected' : `${n} selected`),
  breadcrumb: 'Breadcrumb',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  firstPage: 'First page',
  lastPage: 'Last page',
  goToPage: (p) => `Page ${p}`,
  pageOf: (p, t) => `Page ${p} of ${t}`,
  rowsPerPage: 'Rows per page',
  rangeOf: (s, e, t) => `${s}–${e} of ${t}`,
  selectAll: 'Select all',
  selectRow: 'Select row',
  noData: 'No data yet',
  loadError: 'Data could not be loaded',
  retry: 'Retry',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mainNavigation: 'Main',
  notifications: 'Notifications',
  stepOf: (s, t) => `Step ${s} of ${t}`,
  stepCompleted: 'completed',
  stepCurrent: 'current',
  moreItems: (n) => `${n} more`,
  commandPalette: 'Command palette',
  commandPlaceholder: 'Type a command or search…',
  dropFiles: 'Drag files here',
  browseFiles: 'Browse files',
  fileConstraints: ({ accept, maxSize, maxFiles }) =>
    [accept && `Allowed: ${accept}`, maxSize && `max ${maxSize} each`, maxFiles !== undefined && `up to ${maxFiles} files`].filter(Boolean).join(' · '),
  fileTooLarge: (name, max) => `${name} is larger than ${max}.`,
  fileInvalidType: (name) => `${name} has a file type that is not allowed.`,
  tooManyFiles: (max) => `You can add up to ${max} files.`,
  fileStatus: { pending: 'Ready', uploading: 'Uploading', success: 'Uploaded', error: 'Failed' },
  filesSelected: (n) => (n === 1 ? '1 file' : `${n} files`),
  colorPicker: 'Color picker',
  hue: 'Hue',
  sortAscending: 'sorted ascending',
  sortDescending: 'sorted descending',
  filters: 'Filters',
  clearFilters: 'Clear filters',
  skipToContent: 'Skip to content',
  sidebar: 'Sidebar',
  opensInNewTab: '(opens in a new tab)',
  codeBlock: 'Code',
  scrollableRegion: 'Scrollable content',
  more: 'More',
  stepError: 'error',
  trendUp: 'increase',
  trendDown: 'decrease',
  trendNeutral: 'no change',
  minimum: 'Minimum',
  maximum: 'Maximum',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseDate: 'Choose date',
  openCalendar: 'Open calendar',
  today: 'Today',
  now: 'Now',
  tomorrow: 'Tomorrow',
  yesterday: 'Yesterday',
  nextWeek: 'In one week',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  done: 'Done',
  datePresets: 'Shortcuts',
  chooseTime: 'Choose time',
  timeSlots: 'Times',
  calendarMonth: 'Month',
  calendarYear: 'Year',
  selectedItems: 'Selected items',
  increase: 'Increase',
  decrease: 'Decrease',
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  progress: 'Progress',
  status: 'Status',
  wrapLines: 'Wrap lines',
  accountMenu: (name) => `Account menu, ${name}`,
  signOut: 'Sign out',
  siteNavigation: 'Site',
  authEmail: 'Email',
  authUsername: 'Username',
  authPassword: 'Password',
  authConfirmPassword: 'Confirm password',
  authFullName: 'Full name',
  authRememberMe: 'Keep me signed in',
  authForgotPassword: 'Forgot password?',
  authSignIn: 'Sign in',
  authSignUp: 'Create account',
  authSendResetLink: 'Send reset link',
  authOrContinueWith: 'or continue with',
  authRequiredField: 'This field is required.',
  authInvalidEmail: 'Enter a valid email address, e.g. name@example.com.',
  authPasswordTooShort: (min) => `Use at least ${min} characters.`,
  authPasswordHint: (min) => `At least ${min} characters. Passphrases are welcome.`,
  authPasswordsDoNotMatch: 'The passwords do not match.',
  authAcceptTermsRequired: 'You must accept the terms to continue.',
  authResetLinkSentTitle: 'Check your inbox',
  authResetLinkSent: 'If an account exists for this address, you will receive a link to reset your password.',
  copyFailed: 'Copy failed',
  moreActions: 'More actions',
  pinDigit: (index, total) => `Character ${index} of ${total}`,
  ratingValue: (value, max) => (value === 1 ? `1 star out of ${max}` : `${value} stars out of ${max}`),
  moveUp: (label) => `Move ${label} up`,
  moveDown: (label) => `Move ${label} down`,
  itemMoved: (label, position, total) => `${label} moved to position ${position} of ${total}`,
  notificationsUnread: (count) => (count === 0 ? 'Notifications' : count === 1 ? 'Notifications, 1 unread' : `Notifications, ${count} unread`),
  markAllRead: 'Mark all as read',
  markAsRead: (title) => `Mark "${title}" as read`,
  unread: 'Unread',
  noNotifications: 'No notifications',
  chartData: 'Chart data',
  showChartData: 'Show data table',
  hideChartData: 'Hide data table',
  chartCategory: 'Category',
  chartTotal: 'Total',
  chartKeyboardHint: 'Use the arrow keys to move between data points.',
  chartValue: 'Value',
  chartTarget: 'Target',
  chartConversion: 'Conversion',
  chartSeries: 'Series',
  goalRemaining: (value) => `${value} to go`,
  goalReached: 'Target reached',
  eventModeOnline: 'Online',
  eventModeHybrid: 'Hybrid',
  eventModeInPerson: 'In person',
  pricingSelectPlan: 'Select plan',
  pricingFeatures: 'Features',
  pricingIncluded: 'Included',
  pricingNotIncluded: 'Not included',
  eventSeats: (t, c) => `${t} / ${c} seats`,
  eventSeatsLeft: (n, f) => (n === 1 ? 'Last seat' : `Last ${f} seats`),
  eventSoldOut: 'Sold out',
  readingTime: (m) => `${m} min read`,
  reactionLike: 'Like',
  reactionComment: 'Comments',
  reactionBookmark: 'Save',
  upvote: 'Upvote',
  removeUpvote: 'Remove upvote',
  votes: (n, f) => (n === 1 ? '1 vote' : `${f} votes`),
  replies: (n, f) => (n === 1 ? '1 reply' : `${f} replies`),
  points: (f) => `${f} pts`,
  modulesProgress: (d, t) => `${d} / ${t} modules`,
  newsletterEmail: 'Email',
  newsletterSubscribe: 'Subscribe',
  newsletterSubscribed: 'Subscribed',
  live: 'Live',
  liveViewers: (n, f) => (n === 1 ? '1 viewer' : `${f} viewers`),
  isNew: 'New',
  stageAlpha: 'Alpha',
  stageBeta: 'Beta',
  stagePreview: 'Preview',
  stageDemo: 'Demo',
  stageExperimental: 'Experimental',
  stageDeprecated: 'Deprecated',
  stageComingSoon: 'Coming soon',
  share: 'Share',
  copyLink: 'Copy link',
  linkCopied: 'Link copied',
  shareOn: (n) => `Share on ${n}`,
  socialProfile: (n) => `${n} profile`,
  achievementLocked: 'Locked',
  achievementTierBronze: 'Bronze',
  achievementTierSilver: 'Silver',
  achievementTierGold: 'Gold',
  achievementTierPlatinum: 'Platinum',
  achievementEarned: (d) => `Earned on ${d}`,
  editorLabel: 'Rich text editor',
  editorToolbar: 'Formatting',
  editorPlaceholder: 'Start writing…',
  editorSlashHint: 'Type “/” for commands',
  editorUndo: 'Undo',
  editorRedo: 'Redo',
  editorBold: 'Bold',
  editorItalic: 'Italic',
  editorUnderline: 'Underline',
  editorStrike: 'Strikethrough',
  editorCode: 'Inline code',
  editorHighlight: 'Highlight',
  editorLink: 'Link',
  editorRemoveLink: 'Remove link',
  editorLinkUrl: 'Link address',
  editorOpenInNewTab: 'Open in a new tab',
  editorApply: 'Apply',
  editorCancel: 'Cancel',
  editorTextStyle: 'Text style',
  editorParagraph: 'Paragraph',
  editorHeading: (l) => `Heading ${l}`,
  editorBulletList: 'Bulleted list',
  editorOrderedList: 'Numbered list',
  editorTaskList: 'Checklist',
  editorBlockquote: 'Quote',
  editorCodeBlock: 'Code block',
  editorDivider: 'Divider',
  editorImage: 'Image',
  editorImageUrl: 'Image address',
  editorImageAlt: 'Alternative text',
  editorTable: 'Table',
  editorAddRow: 'Add row',
  editorAddColumn: 'Add column',
  editorDeleteRow: 'Delete row',
  editorDeleteColumn: 'Delete column',
  editorDeleteTable: 'Delete table',
  editorAlign: 'Alignment',
  editorAlignStart: 'Align start',
  editorAlignCenter: 'Center',
  editorAlignEnd: 'Align end',
  editorAlignJustify: 'Justify',
  editorClearFormatting: 'Clear formatting',
  editorInsert: 'Insert',
  editorInsertBlock: 'Insert block',
  editorNoResults: 'No matching blocks',
  editorBlockActions: 'Block actions',
  editorDragBlock: 'Drag to move',
  editorMoveUp: 'Move up',
  editorMoveDown: 'Move down',
  editorDuplicate: 'Duplicate',
  editorDelete: 'Delete',
  editorWords: (c, f) => (c === 1 ? '1 word' : `${f} words`),
  editorCharacters: (c, f) => (c === 1 ? '1 character' : `${f} characters`),
  editorCharactersLeft: (c, f) => (c === 1 ? '1 character left' : `${f} characters left`),
  emailEditor: 'Email editor',
  emailBlocks: 'Blocks',
  emailAddBlock: 'Add block',
  emailBlockHeading: 'Heading',
  emailBlockText: 'Text',
  emailBlockButton: 'Button',
  emailBlockImage: 'Image',
  emailBlockDivider: 'Divider',
  emailBlockSpacer: 'Spacer',
  emailBlockColumns: 'Columns',
  emailBlockSocial: 'Social links',
  emailBlockFooter: 'Footer',
  emailCanvas: 'Email content',
  emailEmpty: 'Add a block to start building your email',
  emailSettings: 'Email settings',
  emailBlockSettings: 'Block settings',
  emailNoSelection: 'Select a block to edit its settings',
  emailSubject: 'Subject',
  emailPreheader: 'Preview text',
  emailEdit: 'Edit',
  emailPreview: 'Preview',
  emailViewport: 'Preview size',
  emailDesktop: 'Desktop',
  emailMobile: 'Mobile',
  emailButtonLabel: 'Button text',
  emailLinkUrl: 'Link address',
  emailBackground: 'Background',
  emailContentBackground: 'Content background',
  emailTextColor: 'Text color',
  emailAccentColor: 'Accent color',
  emailFont: 'Font',
  emailWidth: 'Width',
  emailHeight: 'Height',
  emailPadding: 'Padding',
  emailCopyHtml: 'Copy HTML',
  emailHtmlCopied: 'HTML copied',
  emailExportHtml: 'Export HTML',
  emailBlockPosition: (i, t) => `Block ${i} of ${t}`,
  emailBlockAdded: (b) => `${b} added`,
  emailBlockRemoved: (b) => `${b} removed`,
  emailBlockMoved: (b, i, t) => `${b} moved to position ${i} of ${t}`,
  expandNavigation: 'Expand navigation',
  collapseNavigation: 'Collapse navigation',
  chartSummary: ({ first, last, min, max }) => `From ${first} to ${last}; minimum ${min}, maximum ${max}.`,
  themeIssue: {
    invalid_json: () => 'The file is not valid JSON.',
    too_large: ({ limitKb }) => `The file exceeds ${limitKb ?? ''} KB.`,
    invalid_type: ({ expected }) => `Wrong type: expected ${expected === 'string' ? 'a string' : 'an object'}.`,
    missing_field: () => 'A required field is missing.',
    unsupported_version: ({ version, supported }) => `Schema version ${version ?? '?'} is not supported (up to ${supported ?? '?'}). Update @devcommunityit/ui.`,
    invalid_version: () => 'The schema version must be a positive integer.',
    unknown_key: () => 'Unknown key.',
    unknown_token: () => 'Unknown or non-customizable token.',
    unknown_preset: ({ allowed }) => `Unknown preset. Available: ${(allowed ?? []).join(', ')}.`,
    invalid_name: () => 'The name must start with a letter and contain only a–z, 0–9 and "-" (max 48 characters).',
    reserved_name: () => 'This name belongs to a built-in preset; choose another one.',
    invalid_color: ({ value }) => `Expected a hex color such as #1a73e8, got ${value ?? '—'}.`,
    invalid_length: ({ value }) => `Expected a length such as 8px or 0.5rem, got ${value ?? '—'}.`,
    invalid_font_family: () => 'The font family may contain only letters, digits, spaces, commas, dashes and balanced quotes.',
    invalid_label: () => 'The label must be at most 80 characters, without "<" or ">".',
  },
};

export const it: Messages = {
  components: componentMessagesIt,
  aiPrompt: 'Scrivi una richiesta',
  aiSend: 'Invia',
  aiStop: 'Interrompi generazione',
  aiUser: 'Tu',
  aiAssistant: 'Assistente',
  aiSystem: 'Sistema',
  aiGenerating: 'Generazione della risposta…',
  aiSuggestions: 'Richieste suggerite',
  aiSources: 'Fonti',
  aiFeedback: 'Valutazione della risposta',
  aiHelpful: 'Utile',
  aiNotHelpful: 'Non utile',
  publishDraft: 'Bozza',
  publishPublished: 'Pubblicato',
  publishScheduled: 'Programmato',
  publishArchived: 'Archiviato',
  bulkActions: 'Azioni collettive',
  seoPreview: 'Anteprima del risultato di ricerca',
  close: 'Chiudi',
  cancel: 'Annulla',
  confirm: 'Conferma',
  dismiss: 'Ignora',
  loading: 'Caricamento…',
  clear: 'Cancella',
  remove: (label) => `Rimuovi ${label}`,
  required: 'obbligatorio',
  optional: 'facoltativo',
  showMore: 'Mostra di più',
  showLess: 'Mostra meno',
  copy: 'Copia',
  copied: 'Copiato',
  showPassword: 'Mostra password',
  hidePassword: 'Nascondi password',
  search: 'Cerca',
  noResults: 'Nessun risultato',
  noOptions: 'Nessuna opzione',
  selectedCount: (n) => (n === 1 ? '1 selezionato' : `${n} selezionati`),
  breadcrumb: 'Percorso',
  pagination: 'Paginazione',
  previousPage: 'Pagina precedente',
  nextPage: 'Pagina successiva',
  firstPage: 'Prima pagina',
  lastPage: 'Ultima pagina',
  goToPage: (p) => `Pagina ${p}`,
  pageOf: (p, t) => `Pagina ${p} di ${t}`,
  rowsPerPage: 'Righe per pagina',
  rangeOf: (s, e, t) => `${s}–${e} di ${t}`,
  selectAll: 'Seleziona tutto',
  selectRow: 'Seleziona riga',
  noData: 'Ancora nessun dato',
  loadError: 'Impossibile caricare i dati',
  retry: 'Riprova',
  openMenu: 'Apri menu',
  closeMenu: 'Chiudi menu',
  mainNavigation: 'Principale',
  notifications: 'Notifiche',
  stepOf: (s, t) => `Passaggio ${s} di ${t}`,
  stepCompleted: 'completato',
  stepCurrent: 'corrente',
  moreItems: (n) => `altri ${n}`,
  commandPalette: 'Palette dei comandi',
  commandPlaceholder: 'Digita un comando o cerca…',
  dropFiles: 'Trascina qui i file',
  browseFiles: 'Sfoglia file',
  fileConstraints: ({ accept, maxSize, maxFiles }) =>
    [accept && `Consentiti: ${accept}`, maxSize && `max ${maxSize} ciascuno`, maxFiles !== undefined && `fino a ${maxFiles} file`].filter(Boolean).join(' · '),
  fileTooLarge: (name, max) => `${name} supera ${max}.`,
  fileInvalidType: (name) => `Il tipo di ${name} non è consentito.`,
  tooManyFiles: (max) => `Puoi aggiungere al massimo ${max} file.`,
  fileStatus: { pending: 'Pronto', uploading: 'Caricamento', success: 'Caricato', error: 'Non riuscito' },
  filesSelected: (n) => (n === 1 ? '1 file' : `${n} file`),
  colorPicker: 'Selettore colore',
  hue: 'Tonalità',
  sortAscending: 'ordinato in modo crescente',
  sortDescending: 'ordinato in modo decrescente',
  filters: 'Filtri',
  clearFilters: 'Rimuovi filtri',
  skipToContent: 'Vai al contenuto',
  sidebar: 'Barra laterale',
  opensInNewTab: '(si apre in una nuova scheda)',
  codeBlock: 'Codice',
  scrollableRegion: 'Contenuto scorrevole',
  more: 'Altro',
  stepError: 'errore',
  trendUp: 'aumento',
  trendDown: 'diminuzione',
  trendNeutral: 'invariato',
  minimum: 'Minimo',
  maximum: 'Massimo',
  previousMonth: 'Mese precedente',
  nextMonth: 'Mese successivo',
  chooseDate: 'Scegli la data',
  openCalendar: 'Apri calendario',
  today: 'Oggi',
  now: 'Adesso',
  tomorrow: 'Domani',
  yesterday: 'Ieri',
  nextWeek: 'Tra una settimana',
  last7Days: 'Ultimi 7 giorni',
  last30Days: 'Ultimi 30 giorni',
  thisMonth: 'Questo mese',
  lastMonth: 'Mese scorso',
  done: 'Fatto',
  datePresets: 'Scorciatoie',
  chooseTime: 'Scegli orario',
  timeSlots: 'Orari',
  calendarMonth: 'Mese',
  calendarYear: 'Anno',
  selectedItems: 'Elementi selezionati',
  increase: 'Aumenta',
  decrease: 'Diminuisci',
  info: 'Informazione',
  success: 'Operazione riuscita',
  warning: 'Attenzione',
  error: 'Errore',
  progress: 'Avanzamento',
  status: 'Stato',
  wrapLines: 'A capo automatico',
  accountMenu: (name) => `Menu account, ${name}`,
  signOut: 'Esci',
  siteNavigation: 'Sito',
  authEmail: 'Email',
  authUsername: 'Nome utente',
  authPassword: 'Password',
  authConfirmPassword: 'Conferma password',
  authFullName: 'Nome e cognome',
  authRememberMe: 'Resta collegato',
  authForgotPassword: 'Password dimenticata?',
  authSignIn: 'Accedi',
  authSignUp: 'Crea account',
  authSendResetLink: 'Invia link di ripristino',
  authOrContinueWith: 'oppure continua con',
  authRequiredField: 'Campo obbligatorio.',
  authInvalidEmail: 'Inserisci un indirizzo email valido, ad es. nome@esempio.it.',
  authPasswordTooShort: (min) => `Usa almeno ${min} caratteri.`,
  authPasswordHint: (min) => `Almeno ${min} caratteri. Puoi usare una frase.`,
  authPasswordsDoNotMatch: 'Le password non coincidono.',
  authAcceptTermsRequired: 'Per continuare devi accettare le condizioni.',
  authResetLinkSentTitle: 'Controlla la posta',
  authResetLinkSent: 'Se esiste un account con questo indirizzo, riceverai un link per reimpostare la password.',
  copyFailed: 'Copia non riuscita',
  moreActions: 'Altre azioni',
  pinDigit: (index, total) => `Carattere ${index} di ${total}`,
  ratingValue: (value, max) => (value === 1 ? `1 stella su ${max}` : `${value} stelle su ${max}`),
  moveUp: (label) => `Sposta ${label} in su`,
  moveDown: (label) => `Sposta ${label} in giù`,
  itemMoved: (label, position, total) => `${label} spostato in posizione ${position} di ${total}`,
  notificationsUnread: (count) => (count === 0 ? 'Notifiche' : count === 1 ? 'Notifiche, 1 non letta' : `Notifiche, ${count} non lette`),
  markAllRead: 'Segna tutte come lette',
  markAsRead: (title) => `Segna «${title}» come letta`,
  unread: 'Non letta',
  noNotifications: 'Nessuna notifica',
  chartData: 'Dati del grafico',
  showChartData: 'Mostra tabella dati',
  hideChartData: 'Nascondi tabella dati',
  chartCategory: 'Categoria',
  chartTotal: 'Totale',
  chartKeyboardHint: 'Usa i tasti freccia per spostarti tra i punti dati.',
  chartValue: 'Valore',
  chartTarget: 'Obiettivo',
  chartConversion: 'Conversione',
  chartSeries: 'Serie',
  goalRemaining: (value) => `Mancano ${value}`,
  goalReached: 'Obiettivo raggiunto',
  eventModeOnline: 'Online',
  eventModeHybrid: 'Ibrido',
  eventModeInPerson: 'In presenza',
  pricingSelectPlan: 'Seleziona piano',
  pricingFeatures: 'Funzionalità',
  pricingIncluded: 'Incluso',
  pricingNotIncluded: 'Non incluso',
  eventSeats: (t, c) => `${t} / ${c} posti`,
  eventSeatsLeft: (n, f) => (n === 1 ? 'Ultimo posto' : `Ultimi ${f} posti`),
  eventSoldOut: 'Esaurito',
  readingTime: (m) => `${m} min di lettura`,
  reactionLike: 'Mi piace',
  reactionComment: 'Commenti',
  reactionBookmark: 'Salva',
  upvote: 'Vota',
  removeUpvote: 'Rimuovi voto',
  votes: (n, f) => (n === 1 ? '1 voto' : `${f} voti`),
  replies: (n, f) => (n === 1 ? '1 risposta' : `${f} risposte`),
  points: (f) => `${f} pt`,
  modulesProgress: (d, t) => `${d} / ${t} moduli`,
  newsletterEmail: 'Email',
  newsletterSubscribe: 'Iscriviti',
  newsletterSubscribed: 'Iscrizione completata',
  live: 'Live',
  liveViewers: (n, f) => (n === 1 ? '1 spettatore' : `${f} spettatori`),
  isNew: 'Nuovo',
  stageAlpha: 'Alpha',
  stageBeta: 'Beta',
  stagePreview: 'Anteprima',
  stageDemo: 'Demo',
  stageExperimental: 'Sperimentale',
  stageDeprecated: 'Deprecato',
  stageComingSoon: 'In arrivo',
  share: 'Condividi',
  copyLink: 'Copia link',
  linkCopied: 'Link copiato',
  shareOn: (n) => `Condividi su ${n}`,
  socialProfile: (n) => `Profilo ${n}`,
  achievementLocked: 'Bloccato',
  achievementTierBronze: 'Bronzo',
  achievementTierSilver: 'Argento',
  achievementTierGold: 'Oro',
  achievementTierPlatinum: 'Platino',
  achievementEarned: (d) => `Ottenuto il ${d}`,
  editorLabel: 'Editor di testo',
  editorToolbar: 'Formattazione',
  editorPlaceholder: 'Inizia a scrivere…',
  editorSlashHint: 'Digita “/” per i comandi',
  editorUndo: 'Annulla',
  editorRedo: 'Ripeti',
  editorBold: 'Grassetto',
  editorItalic: 'Corsivo',
  editorUnderline: 'Sottolineato',
  editorStrike: 'Barrato',
  editorCode: 'Codice in linea',
  editorHighlight: 'Evidenzia',
  editorLink: 'Link',
  editorRemoveLink: 'Rimuovi link',
  editorLinkUrl: 'Indirizzo del link',
  editorOpenInNewTab: 'Apri in una nuova scheda',
  editorApply: 'Applica',
  editorCancel: 'Annulla',
  editorTextStyle: 'Stile del testo',
  editorParagraph: 'Paragrafo',
  editorHeading: (l) => `Titolo ${l}`,
  editorBulletList: 'Elenco puntato',
  editorOrderedList: 'Elenco numerato',
  editorTaskList: 'Lista di controllo',
  editorBlockquote: 'Citazione',
  editorCodeBlock: 'Blocco di codice',
  editorDivider: 'Divisore',
  editorImage: 'Immagine',
  editorImageUrl: 'Indirizzo dell’immagine',
  editorImageAlt: 'Testo alternativo',
  editorTable: 'Tabella',
  editorAddRow: 'Aggiungi riga',
  editorAddColumn: 'Aggiungi colonna',
  editorDeleteRow: 'Elimina riga',
  editorDeleteColumn: 'Elimina colonna',
  editorDeleteTable: 'Elimina tabella',
  editorAlign: 'Allineamento',
  editorAlignStart: 'Allinea all’inizio',
  editorAlignCenter: 'Centra',
  editorAlignEnd: 'Allinea alla fine',
  editorAlignJustify: 'Giustifica',
  editorClearFormatting: 'Cancella formattazione',
  editorInsert: 'Inserisci',
  editorInsertBlock: 'Inserisci blocco',
  editorNoResults: 'Nessun blocco corrispondente',
  editorBlockActions: 'Azioni sul blocco',
  editorDragBlock: 'Trascina per spostare',
  editorMoveUp: 'Sposta su',
  editorMoveDown: 'Sposta giù',
  editorDuplicate: 'Duplica',
  editorDelete: 'Elimina',
  editorWords: (c, f) => (c === 1 ? '1 parola' : `${f} parole`),
  editorCharacters: (c, f) => (c === 1 ? '1 carattere' : `${f} caratteri`),
  editorCharactersLeft: (c, f) => (c === 1 ? '1 carattere rimasto' : `${f} caratteri rimasti`),
  emailEditor: 'Editor email',
  emailBlocks: 'Blocchi',
  emailAddBlock: 'Aggiungi blocco',
  emailBlockHeading: 'Titolo',
  emailBlockText: 'Testo',
  emailBlockButton: 'Pulsante',
  emailBlockImage: 'Immagine',
  emailBlockDivider: 'Divisore',
  emailBlockSpacer: 'Spaziatore',
  emailBlockColumns: 'Colonne',
  emailBlockSocial: 'Link social',
  emailBlockFooter: 'Piè di pagina',
  emailCanvas: 'Contenuto dell’email',
  emailEmpty: 'Aggiungi un blocco per iniziare a comporre l’email',
  emailSettings: 'Impostazioni email',
  emailBlockSettings: 'Impostazioni del blocco',
  emailNoSelection: 'Seleziona un blocco per modificarne le impostazioni',
  emailSubject: 'Oggetto',
  emailPreheader: 'Testo di anteprima',
  emailEdit: 'Modifica',
  emailPreview: 'Anteprima',
  emailViewport: 'Dimensione dell’anteprima',
  emailDesktop: 'Desktop',
  emailMobile: 'Mobile',
  emailButtonLabel: 'Testo del pulsante',
  emailLinkUrl: 'Indirizzo del link',
  emailBackground: 'Sfondo',
  emailContentBackground: 'Sfondo del contenuto',
  emailTextColor: 'Colore del testo',
  emailAccentColor: 'Colore di accento',
  emailFont: 'Carattere',
  emailWidth: 'Larghezza',
  emailHeight: 'Altezza',
  emailPadding: 'Spaziatura interna',
  emailCopyHtml: 'Copia HTML',
  emailHtmlCopied: 'HTML copiato',
  emailExportHtml: 'Esporta HTML',
  emailBlockPosition: (i, t) => `Blocco ${i} di ${t}`,
  emailBlockAdded: (b) => `${b} aggiunto`,
  emailBlockRemoved: (b) => `${b} rimosso`,
  emailBlockMoved: (b, i, t) => `${b} spostato in posizione ${i} di ${t}`,
  expandNavigation: 'Espandi navigazione',
  collapseNavigation: 'Comprimi navigazione',
  chartSummary: ({ first, last, min, max }) => `Da ${first} a ${last}; minimo ${min}, massimo ${max}.`,
  themeIssue: {
    invalid_json: () => 'Il file non è un JSON valido.',
    too_large: ({ limitKb }) => `Il file supera ${limitKb ?? ''} KB.`,
    invalid_type: ({ expected }) => `Tipo non valido: atteso ${expected === 'string' ? 'un testo' : 'un oggetto'}.`,
    missing_field: () => 'Manca un campo obbligatorio.',
    unsupported_version: ({ version, supported }) =>
      `La versione dello schema ${version ?? '?'} non è supportata (massimo ${supported ?? '?'}). Aggiorna @devcommunityit/ui.`,
    invalid_version: () => 'La versione dello schema deve essere un intero positivo.',
    unknown_key: () => 'Chiave sconosciuta.',
    unknown_token: () => 'Token sconosciuto o non personalizzabile.',
    unknown_preset: ({ allowed }) => `Preset sconosciuto. Disponibili: ${(allowed ?? []).join(', ')}.`,
    invalid_name: () => 'Il nome deve iniziare con una lettera e contenere solo a–z, 0–9 e «-» (max 48 caratteri).',
    reserved_name: () => 'Questo nome appartiene a un preset integrato: scegline un altro.',
    invalid_color: ({ value }) => `Atteso un colore esadecimale come #1a73e8, ricevuto ${value ?? '—'}.`,
    invalid_length: ({ value }) => `Attesa una lunghezza come 8px o 0.5rem, ricevuto ${value ?? '—'}.`,
    invalid_font_family: () => 'La famiglia di caratteri può contenere solo lettere, cifre, spazi, virgole, trattini e virgolette bilanciate.',
    invalid_label: () => 'L’etichetta deve avere al massimo 80 caratteri, senza «<» o «>».',
  },
};

/** Languages bundled with `LocaleProvider` by default; other built-in languages are opt-in (see `builtIn.ts`). */
export type CoreLanguage = 'en' | 'it';

/**
 * Picks the core bundle (`it` or `en`) by BCP 47 language subtag, falling back to English.
 * Kept separate from `getDefaultMessages` so apps that do not import the other bundles don't ship them.
 */
export function getCoreMessages(locale: string): Messages {
  return locale.toLowerCase().split('-')[0] === 'it' ? it : en;
}

/** Localized, end-user message for a theme validation issue (without the JSON path). */
export function formatThemeIssue(issue: ThemeIssue, messages: Messages): string {
  return messages.themeIssue[issue.code](issue.params ?? {});
}
