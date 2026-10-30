import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['UserMenu', 'USER_MENU_SIGN_OUT_KEY'],
  name: 'UserMenu',
  slug: 'user-menu',
  category: 'patterns',
  summary:
    'Menu dell’utente autenticato per l’intestazione: avatar (con iniziali di riserva), nome, email e ruolo, voci personalizzabili e voce “Esci” separata.',
  whenToUse: ['Nell’area actions di Header, SiteHeader o AppShell quando l’utente è autenticato.'],
  whenNotToUse: [
    'Per utenti non autenticati: mostra un Button o un Link “Accedi”.',
    'Come navigazione principale del portale: usa Sidebar o NavigationMenu.',
  ],
  props: [
    { name: 'user', type: '{ name: string; email?: string; avatarSrc?: string; role?: ReactNode }', description: 'Identità mostrata nel trigger e nel blocco in cima al menu.' },
    { name: 'children', type: 'MenuItem / MenuSection / MenuSeparator', description: 'Voci del menu (profilo, impostazioni, cambio organizzazione…).' },
    { name: 'onAction', type: '(key: Key) => void', description: 'Chiamata per le voci senza href. Le voci con href navigano (RouterProvider).' },
    { name: 'onSignOut', type: '() => void', description: 'Se presente aggiunge la voce “Esci” in fondo, dopo un separatore. Non esegue alcun logout: lo fa il consumer.' },
    { name: 'signOutLabel', type: 'string', default: 'messages.signOut', description: 'Testo della voce di uscita.' },
    { name: 'showName', type: "'always' | 'never' | 'wide'", default: "'wide'", description: 'Visibilità del nome accanto all’avatar; “wide” lo mostra da 768 px.' },
    { name: 'placement', type: 'Placement', default: "'bottom end'", description: 'Posizione del menu rispetto al trigger.' },
    { name: 'isOpen / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: 'Apertura controlled o uncontrolled.' },
    { name: 'className', type: 'string', description: 'Classe aggiuntiva sul trigger.' },
  ],
  inherits: 'Le voci sono i MenuItem di DropdownMenu, con tutte le loro props (href, isDisabled, tone, shortcut…).',
  keyboard: [
    { keys: 'Enter / Spazio / ↓', action: 'Apre il menu e porta il focus sulla prima voce.' },
    { keys: '↑ / ↓ / Home / End', action: 'Si sposta tra le voci.' },
    { keys: 'Enter', action: 'Attiva la voce e chiude il menu.' },
    { keys: 'Esc', action: 'Chiude il menu e riporta il focus sul trigger.' },
  ],
  accessibility: [
    'Il trigger è un <button> con nome “Menu account, {nome}” e aria-haspopup/aria-expanded.',
    'Il menu prende il nome dal trigger; il blocco identità (email, ruolo) è collegato con aria-describedby, ma non è una voce del menu, per non interferire con la navigazione da tastiera.',
    'L’avatar è decorativo: il nome è sempre disponibile come testo accessibile.',
    'Implementato su react-aria-components (pattern APG Menu Button).',
  ],
  responsive: [
    'Sotto 768 px (showName="wide") resta visibile solo l’avatar; il nome completo è nel menu.',
    'Il pannello non supera la larghezza del viewport; nome ed email lunghi vanno a capo invece di essere tagliati.',
  ],
  customization: [
    'Usa MenuSection con title per gruppi (es. “Organizzazione”).',
    'Usa USER_MENU_SIGN_OUT_KEY se gestisci tutte le azioni in onAction e vuoi riconoscere l’uscita.',
  ],
  commonMistakes: [
    'Eseguire il logout solo lato client: invalida sempre la sessione sul server.',
    'Inserire informazioni critiche (es. scadenza password) solo nel menu: mostrale anche nella pagina.',
  ],
  examples: [
    { name: 'LoggedUserHeader', title: 'Intestazione con utente autenticato', description: 'Le voci mostrano l’azione scelta; “Esci” sostituisce il menu con il pulsante “Accedi” (stato locale).' },
    { name: 'AlwaysShowName', title: 'Nome sempre visibile ed etichette in inglese', description: 'Nome e email lunghi, testo di uscita personalizzato.' },
  ],
  status: {
    implemented: true,
    documented: true,
    tests: ['patterns/UserMenu/UserMenu.test.tsx'],
    limits: ['Il cambio di account/organizzazione va composto dal consumer con MenuSection e MenuItem.'],
  },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/',
};
