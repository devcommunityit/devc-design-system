import type { ComponentDoc } from '../../docs-meta/types';

export const doc: ComponentDoc = {
  exports: ['PermissionMatrix', 'type PermissionMatrixProps', 'type PermissionMatrixItem', 'type PermissionMatrixValue'],
  name: 'PermissionMatrix',
  slug: 'permission-matrix',
  category: 'forms',
  summary: 'Matrice modificabile di ruoli e permessi con selezione per riga e colonna.',
  whenToUse: ['Configurare permessi per più ruoli.'],
  whenNotToUse: ['Per autorizzare operazioni: le verifiche di sicurezza devono restare sul server.'],
  props: [
    { name: 'aria-label', type: 'string', required: true, description: 'Nome della matrice.' },
    { name: 'roles', type: 'readonly PermissionMatrixItem[]', required: true, description: 'Colonne con id univoci e nome.' },
    { name: 'permissions', type: 'readonly PermissionMatrixItem[]', required: true, description: 'Righe con id univoci e nome.' },
    { name: 'value / defaultValue / onChange', type: 'PermissionMatrixValue', description: 'Mappa da id ruolo a id permessi selezionati.' },
    { name: 'isCellDisabled / showBulkActions', type: 'function / boolean', description: 'Blocca singole celle e configura la selezione collettiva.' },
  ],
  keyboard: [{ keys: 'Tab / Spazio', action: 'Raggiungi e modifica le caselle.' }],
  accessibility: ['Intestazioni di riga e colonna, nomi delle celle e stato misto delle selezioni collettive.'],
  responsive: ['La tabella scorre nel contenitore.'],
  customization: ['Colori e spaziature derivano dai token.'],
  commonMistakes: ['Non usare la matrice client come controllo di autorizzazione.'],
  examples: [{ name: 'Roles', title: 'Ruoli e permessi' }],
  status: { implemented: true, documented: true, tests: ['components/PermissionMatrix/PermissionMatrix.test.tsx'], limits: ['La persistenza e l’autorizzazione sono delegate al consumer.'] },
};
