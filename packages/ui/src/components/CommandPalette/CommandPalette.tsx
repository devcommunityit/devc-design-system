import { Search } from 'lucide-react';
import { useEffect, useMemo, type ReactNode } from 'react';
import { useFilter } from 'react-aria';
import {
  Autocomplete,
  Dialog as RACDialog,
  Input,
  Modal,
  ModalOverlay,
  SearchField,
  type Key,
} from 'react-aria-components';
import { useLocale, useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Menu, MenuItem, MenuSection } from '../DropdownMenu/DropdownMenu';
import styles from './CommandPalette.module.css';

export interface CommandPaletteItem {
  id: string;
  label: string;
  /** Group heading. Items keep the order in which sections first appear. */
  section?: string;
  /** Extra search terms (synonyms, English/Italian names…). */
  keywords?: string[];
  description?: string;
  icon?: ReactNode;
  /** Visual hint only. */
  shortcut?: string;
  isDisabled?: boolean;
}

export interface CommandPaletteProps {
  commands: CommandPaletteItem[];
  /** Called with the chosen command; the palette then closes. */
  onAction: (id: string, command: CommandPaletteItem) => void;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Register Ctrl+K / ⌘+K on `document` to toggle the palette while mounted.
   * Off by default so the library adds no global shortcut unless you ask for it. @default false
   */
  hotkey?: boolean;
  placeholder?: string;
  /** Content shown when nothing matches. */
  emptyState?: ReactNode;
  'aria-label'?: string;
  className?: string;
}

/**
 * Modal search over commands (dialog + combobox-like filtering via react-aria Autocomplete + Menu).
 * Arrow keys move the virtual focus while typing; Enter runs the command; Escape closes and restores focus.
 * Filtering is local and diacritic-insensitive; for remote results filter `commands` yourself.
 */
export function CommandPalette({
  commands,
  onAction,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  hotkey = false,
  placeholder,
  emptyState,
  'aria-label': ariaLabel,
  className,
}: CommandPaletteProps) {
  const t = useMessages();
  const { locale, direction } = useLocale();
  const [open, setOpen] = useControllableState(isOpen, defaultOpen, onOpenChange, 'CommandPalette.isOpen');
  const { contains } = useFilter({ sensitivity: 'base' });

  useEffect(() => {
    if (!hotkey) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hotkey, open, setOpen]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>();
    for (const command of commands) {
      const key = command.section ?? '';
      const list = map.get(key);
      if (list) list.push(command);
      else map.set(key, [command]);
    }
    return [...map.entries()];
  }, [commands]);

  const byId = useMemo(() => new Map(commands.map((c) => [c.id, c])), [commands]);

  const runAction = (key: Key) => {
    const command = byId.get(String(key));
    if (!command) return;
    setOpen(false);
    onAction(command.id, command);
  };

  const renderItem = (command: CommandPaletteItem) => (
    <MenuItem
      key={command.id}
      id={command.id}
      textValue={[command.label, ...(command.keywords ?? [])].join(' ')}
      icon={command.icon}
      description={command.description}
      shortcut={command.shortcut}
      isDisabled={command.isDisabled}
    >
      {command.label}
    </MenuItem>
  );

  return (
    <ModalOverlay isOpen={open} onOpenChange={setOpen} isDismissable className={styles.overlay} dir={direction} lang={locale}>
      <Modal className={cx(styles.modal, className)}>
        <RACDialog aria-label={ariaLabel ?? t.commandPalette} className={styles.dialog}>
          <Autocomplete filter={contains}>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus -- initial focus of a modal dialog belongs on its search field (APG dialog/combobox); it only runs when the user opens the palette. */}
            <SearchField aria-label={t.search} className={styles.searchField} autoFocus>
              <Search aria-hidden="true" className={styles.searchIcon} />
              <Input placeholder={placeholder ?? t.commandPlaceholder} className={styles.input} />
            </SearchField>
            <Menu
              inline
              aria-label={ariaLabel ?? t.commandPalette}
              className={styles.menu}
              onAction={runAction}
              renderEmptyState={() => <div className={styles.empty}>{emptyState ?? t.noResults}</div>}
            >
              {groups.map(([section, items]) =>
                section ? (
                  <MenuSection key={section} id={`section-${section}`} title={section}>
                    {items.map(renderItem)}
                  </MenuSection>
                ) : (
                  items.map(renderItem)
                ),
              )}
            </Menu>
          </Autocomplete>
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}