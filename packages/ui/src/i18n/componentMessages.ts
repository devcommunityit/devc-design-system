/** Strings for composite components; applications can override individual entries. */
export interface ComponentMessages {
  mentionSuggestions: string;
  mentionEmpty: string;
  hashtagSuggestions: string;
  hashtagEmpty: string;
  kanbanColumn: (column: string) => string;
  kanbanCount: (count: number) => string;
  kanbanDrag: (card: string) => string;
  kanbanMoved: (card: string, column: string) => string;
  kanbanLabels: (card: string) => string;
  kanbanStatus: (card: string) => string;
  kanbanMoveTo: (card: string, column: string) => string;
  kanbanEmpty: string;
  fileEmpty: string;
  fileSelect: (name: string) => string;
  savedViews: string;
  saveView: string;
  deleteView: (name: string) => string;
  splitPrimary: string;
  splitSecondary: string;
  splitResize: string;
  toolRunning: string;
  toolCompleted: string;
  toolFailed: string;
  toolApproval: string;
  toolApprove: string;
  toolReject: string;
  details: string;
  calendarPrevious: string;
  calendarNext: string;
  calendarView: string;
  calendarDay: string;
  calendarWeek: string;
  calendarMonthView: string;
  calendarNoEvents: string;
  fileRoot: string;
  fileFolders: string;
  fileList: string;
  filePreview: (name: string) => string;
  fileOpen: (name: string) => string;
  preview: string;
  open: string;
  previous: string;
  next: string;
  finish: string;
  wizardValidation: string;
  wizardError: string;
  reply: string;
  replyTo: (author: string) => string;
  sendReply: string;
  commentLike: (author: string) => string;
  diffView: string;
  diffUnified: string;
  diffSplit: string;
  diffBefore: string;
  diffAfter: string;
  diffAdded: string;
  diffRemoved: string;
  diffUnchanged: string;
  imageOpen: (name: string) => string;
  imagePosition: (index: number, total: number) => string;
  cropX: string;
  cropY: string;
  cropWidth: string;
  cropHeight: string;
  cropApply: string;
  cropFailed: string;
  cropLoading: string;
  tourSkip: string;
  tourTargetMissing: string;
  permissionCell: (permission: string, role: string) => string;
  permissionRoleAll: (role: string) => string;
  permissionAllRoles: (permission: string) => string;
  preferenceCell: (category: string, channel: string) => string;
  privacyAcceptAll: string;
  privacyRejectAll: string;
  privacySave: string;
  privacyRequired: string;
  venueMapLoad: string;
  venueMapConsent: string;
  venueMapFrame: (venue: string) => string;
  venueMapOpen: string;
  venueMapGoogle: string;
  venueMapApple: string;
  floorPlanHint: string;
  floorPlanLegend: string;
  floorPlanLevel: string;
  floorPlanKind: (kind: string) => string;
  floorPlanCapacity: (count: number) => string;
  floorPlanAccessible: string;
  floorPlanEmpty: string;
  floorPlanClear: string;
}

export const componentMessagesEn: ComponentMessages = {
  mentionSuggestions: 'Mention suggestions', mentionEmpty: 'No matching people',
  hashtagSuggestions: 'Hashtag suggestions', hashtagEmpty: 'No matching hashtags',
  kanbanColumn: (column) => `${column} cards`, kanbanCount: (count) => `${count} ${count === 1 ? 'card' : 'cards'}`,
  kanbanDrag: (card) => `Drag ${card}`, kanbanMoved: (card, column) => `${card} moved to ${column}`,
  kanbanLabels: (card) => `${card} labels`, kanbanStatus: (card) => `Status ${card}`,
  kanbanMoveTo: (card, column) => `Move ${card} to ${column}`, kanbanEmpty: 'No cards',
  fileEmpty: 'No files', fileSelect: (name) => `Select ${name}`,
  savedViews: 'Saved views', saveView: 'Save view', deleteView: (name) => `Delete ${name}`,
  splitPrimary: 'Primary panel', splitSecondary: 'Secondary panel', splitResize: 'Resize panels',
  toolRunning: 'In progress', toolCompleted: 'Completed', toolFailed: 'Failed',
  toolApproval: 'Approval required', toolApprove: 'Approve', toolReject: 'Reject', details: 'Details',
  calendarPrevious: 'Previous period', calendarNext: 'Next period', calendarView: 'View',
  calendarDay: 'Day', calendarWeek: 'Week', calendarMonthView: 'Month', calendarNoEvents: 'No events',
  fileRoot: 'Files', fileFolders: 'Folders', fileList: 'Files', filePreview: (name) => `Preview ${name}`,
  fileOpen: (name) => `Open ${name}`, preview: 'Preview', open: 'Open',
  previous: 'Previous', next: 'Next', finish: 'Finish', wizardValidation: 'Check the current step before continuing.',
  wizardError: 'The operation failed. Please try again.',
  reply: 'Reply', replyTo: (author) => `Reply to ${author}`, sendReply: 'Send reply', commentLike: (author) => `Like comment by ${author}`,
  diffView: 'Diff view', diffUnified: 'Unified', diffSplit: 'Side by side', diffBefore: 'Before', diffAfter: 'After',
  diffAdded: 'Added', diffRemoved: 'Removed', diffUnchanged: 'Unchanged',
  imageOpen: (name) => `Open image ${name}`, imagePosition: (index, total) => `Image ${index} of ${total}`,
  cropX: 'Horizontal position', cropY: 'Vertical position', cropWidth: 'Crop width', cropHeight: 'Crop height',
  cropApply: 'Crop image', cropFailed: 'Could not crop the image.', cropLoading: 'Loading image',
  tourSkip: 'Skip tour', tourTargetMissing: 'The target for this step is unavailable.',
  permissionCell: (permission, role) => `${permission} for ${role}`, permissionRoleAll: (role) => `All permissions for ${role}`,
  permissionAllRoles: (permission) => `${permission} for all roles`, preferenceCell: (category, channel) => `${category}: ${channel}`,
  privacyAcceptAll: 'Accept all', privacyRejectAll: 'Reject optional', privacySave: 'Save preferences', privacyRequired: 'Required',
  venueMapLoad: 'Load map', venueMapConsent: 'The map is loaded from OpenStreetMap: your browser will connect to its servers.',
  venueMapFrame: (venue) => `Map of ${venue}`, venueMapOpen: 'Open in OpenStreetMap',
  venueMapGoogle: 'Directions with Google Maps', venueMapApple: 'Directions with Apple Maps',
  floorPlanHint: 'Use the arrow keys to move between areas, Enter to select and Escape to clear.',
  floorPlanLegend: 'Legend', floorPlanLevel: 'Floor',
  floorPlanKind: (kind) => ({ room: 'Room', stage: 'Stage', booth: 'Booth', food: 'Food and drinks', restroom: 'Restrooms', entrance: 'Entrance', info: 'Information', service: 'Service', outdoor: 'Outdoor area' } as Record<string, string>)[kind] ?? kind,
  floorPlanCapacity: (count) => `Capacity: ${count}`, floorPlanAccessible: 'Step-free access',
  floorPlanEmpty: 'Select an area on the plan to see its details.', floorPlanClear: 'Clear selection',
};

export const componentMessagesIt: ComponentMessages = {
  mentionSuggestions: 'Suggerimenti per le menzioni', mentionEmpty: 'Nessuna persona trovata',
  hashtagSuggestions: 'Suggerimenti per gli hashtag', hashtagEmpty: 'Nessun hashtag trovato',
  kanbanColumn: (column) => `Schede ${column}`, kanbanCount: (count) => `${count} ${count === 1 ? 'scheda' : 'schede'}`,
  kanbanDrag: (card) => `Trascina ${card}`, kanbanMoved: (card, column) => `${card} spostata in ${column}`,
  kanbanLabels: (card) => `Etichette ${card}`, kanbanStatus: (card) => `Stato ${card}`,
  kanbanMoveTo: (card, column) => `Sposta ${card} in ${column}`, kanbanEmpty: 'Nessuna scheda',
  fileEmpty: 'Nessun file', fileSelect: (name) => `Seleziona ${name}`,
  savedViews: 'Viste salvate', saveView: 'Salva vista', deleteView: (name) => `Elimina ${name}`,
  splitPrimary: 'Pannello principale', splitSecondary: 'Pannello secondario', splitResize: 'Ridimensiona i pannelli',
  toolRunning: 'In corso', toolCompleted: 'Completato', toolFailed: 'Non riuscito',
  toolApproval: 'Approvazione richiesta', toolApprove: 'Approva', toolReject: 'Rifiuta', details: 'Dettagli',
  calendarPrevious: 'Periodo precedente', calendarNext: 'Periodo successivo', calendarView: 'Vista',
  calendarDay: 'Giorno', calendarWeek: 'Settimana', calendarMonthView: 'Mese', calendarNoEvents: 'Nessun evento',
  fileRoot: 'File', fileFolders: 'Cartelle', fileList: 'File', filePreview: (name) => `Anteprima di ${name}`,
  fileOpen: (name) => `Apri ${name}`, preview: 'Anteprima', open: 'Apri',
  previous: 'Indietro', next: 'Avanti', finish: 'Concludi', wizardValidation: 'Controlla il passaggio corrente prima di continuare.',
  wizardError: 'Operazione non riuscita. Riprova.',
  reply: 'Rispondi', replyTo: (author) => `Rispondi a ${author}`, sendReply: 'Invia risposta', commentLike: (author) => `Mi piace al commento di ${author}`,
  diffView: 'Vista differenze', diffUnified: 'Unificata', diffSplit: 'Affiancata', diffBefore: 'Prima', diffAfter: 'Dopo',
  diffAdded: 'Aggiunta', diffRemoved: 'Rimossa', diffUnchanged: 'Invariata',
  imageOpen: (name) => `Apri immagine ${name}`, imagePosition: (index, total) => `Immagine ${index} di ${total}`,
  cropX: 'Posizione orizzontale', cropY: 'Posizione verticale', cropWidth: 'Larghezza ritaglio', cropHeight: 'Altezza ritaglio',
  cropApply: 'Ritaglia immagine', cropFailed: 'Impossibile ritagliare l’immagine.', cropLoading: 'Caricamento immagine',
  tourSkip: 'Salta guida', tourTargetMissing: 'L’elemento di questo passaggio non è disponibile.',
  permissionCell: (permission, role) => `${permission} per ${role}`, permissionRoleAll: (role) => `Tutti i permessi per ${role}`,
  permissionAllRoles: (permission) => `${permission} per tutti i ruoli`, preferenceCell: (category, channel) => `${category}: ${channel}`,
  privacyAcceptAll: 'Accetta tutti', privacyRejectAll: 'Rifiuta facoltativi', privacySave: 'Salva preferenze', privacyRequired: 'Necessario',
  venueMapLoad: 'Carica la mappa', venueMapConsent: 'La mappa viene caricata da OpenStreetMap: il browser si collegherà ai suoi server.',
  venueMapFrame: (venue) => `Mappa di ${venue}`, venueMapOpen: 'Apri in OpenStreetMap',
  venueMapGoogle: 'Indicazioni con Google Maps', venueMapApple: 'Indicazioni con Apple Mappe',
  floorPlanHint: 'Usa le frecce per spostarti tra le aree, Invio per selezionare ed Esc per annullare.',
  floorPlanLegend: 'Legenda', floorPlanLevel: 'Piano',
  floorPlanKind: (kind) => ({ room: 'Sala', stage: 'Palco', booth: 'Stand', food: 'Bar e ristoro', restroom: 'Servizi igienici', entrance: 'Ingresso', info: 'Informazioni', service: 'Servizio', outdoor: 'Area esterna' } as Record<string, string>)[kind] ?? kind,
  floorPlanCapacity: (count) => `Capienza: ${count}`, floorPlanAccessible: 'Accesso senza gradini',
  floorPlanEmpty: 'Seleziona un’area sulla piantina per vederne i dettagli.', floorPlanClear: 'Annulla selezione',
};

export const componentMessagesEs: ComponentMessages = {
  mentionSuggestions: 'Sugerencias de menciones', mentionEmpty: 'No se encontraron personas',
  hashtagSuggestions: 'Sugerencias de etiquetas', hashtagEmpty: 'No se encontraron etiquetas',
  kanbanColumn: (column) => `Tarjetas de ${column}`, kanbanCount: (n) => `${n} ${n === 1 ? 'tarjeta' : 'tarjetas'}`,
  kanbanDrag: (card) => `Arrastrar ${card}`, kanbanMoved: (card, column) => `${card} se movió a ${column}`,
  kanbanLabels: (card) => `Etiquetas de ${card}`, kanbanStatus: (card) => `Estado de ${card}`,
  kanbanMoveTo: (card, column) => `Mover ${card} a ${column}`, kanbanEmpty: 'No hay tarjetas',
  fileEmpty: 'No hay archivos', fileSelect: (name) => `Seleccionar ${name}`,
  savedViews: 'Vistas guardadas', saveView: 'Guardar vista', deleteView: (name) => `Eliminar ${name}`,
  splitPrimary: 'Panel principal', splitSecondary: 'Panel secundario', splitResize: 'Cambiar tamaño de paneles',
  toolRunning: 'En curso', toolCompleted: 'Completado', toolFailed: 'Fallido',
  toolApproval: 'Se requiere aprobación', toolApprove: 'Aprobar', toolReject: 'Rechazar', details: 'Detalles',
  calendarPrevious: 'Período anterior', calendarNext: 'Período siguiente', calendarView: 'Vista',
  calendarDay: 'Día', calendarWeek: 'Semana', calendarMonthView: 'Mes', calendarNoEvents: 'Sin eventos',
  fileRoot: 'Archivos', fileFolders: 'Carpetas', fileList: 'Archivos', filePreview: (name) => `Vista previa de ${name}`,
  fileOpen: (name) => `Abrir ${name}`, preview: 'Vista previa', open: 'Abrir',
  previous: 'Anterior', next: 'Siguiente', finish: 'Finalizar', wizardValidation: 'Revisa el paso antes de continuar.',
  wizardError: 'La operación falló. Inténtalo de nuevo.',
  reply: 'Responder', replyTo: (author) => `Responder a ${author}`, sendReply: 'Enviar respuesta', commentLike: (author) => `Me gusta el comentario de ${author}`,
  diffView: 'Vista de diferencias', diffUnified: 'Unificada', diffSplit: 'En paralelo', diffBefore: 'Antes', diffAfter: 'Después',
  diffAdded: 'Añadido', diffRemoved: 'Eliminado', diffUnchanged: 'Sin cambios',
  imageOpen: (name) => `Abrir imagen ${name}`, imagePosition: (index, total) => `Imagen ${index} de ${total}`,
  cropX: 'Posición horizontal', cropY: 'Posición vertical', cropWidth: 'Ancho del recorte', cropHeight: 'Alto del recorte',
  cropApply: 'Recortar imagen', cropFailed: 'No se pudo recortar la imagen.', cropLoading: 'Cargando imagen',
  tourSkip: 'Omitir guía', tourTargetMissing: 'El elemento de este paso no está disponible.',
  permissionCell: (permission, role) => `${permission} para ${role}`, permissionRoleAll: (role) => `Todos los permisos de ${role}`,
  permissionAllRoles: (permission) => `${permission} para todos los roles`, preferenceCell: (category, channel) => `${category}: ${channel}`,
  privacyAcceptAll: 'Aceptar todo', privacyRejectAll: 'Rechazar opcionales', privacySave: 'Guardar preferencias', privacyRequired: 'Necesario',
  venueMapLoad: 'Cargar mapa', venueMapConsent: 'El mapa se carga desde OpenStreetMap: tu navegador se conectará a sus servidores.',
  venueMapFrame: (venue) => `Mapa de ${venue}`, venueMapOpen: 'Abrir en OpenStreetMap',
  venueMapGoogle: 'Cómo llegar con Google Maps', venueMapApple: 'Cómo llegar con Apple Maps',
  floorPlanHint: 'Usa las flechas para moverte entre las áreas, Intro para seleccionar y Escape para borrar.',
  floorPlanLegend: 'Leyenda', floorPlanLevel: 'Planta',
  floorPlanKind: (kind) => ({ room: 'Sala', stage: 'Escenario', booth: 'Stand', food: 'Comida y bebida', restroom: 'Aseos', entrance: 'Entrada', info: 'Información', service: 'Servicio', outdoor: 'Zona exterior' } as Record<string, string>)[kind] ?? kind,
  floorPlanCapacity: (count) => `Aforo: ${count}`, floorPlanAccessible: 'Acceso sin escalones',
  floorPlanEmpty: 'Selecciona un área del plano para ver sus detalles.', floorPlanClear: 'Borrar selección',
};

export const componentMessagesFr: ComponentMessages = {
  mentionSuggestions: 'Suggestions de mentions', mentionEmpty: 'Aucune personne trouvée',
  hashtagSuggestions: 'Suggestions de hashtags', hashtagEmpty: 'Aucun hashtag trouvé',
  kanbanColumn: (column) => `Cartes ${column}`, kanbanCount: (n) => `${n} ${n > 1 ? 'cartes' : 'carte'}`,
  kanbanDrag: (card) => `Déplacer ${card}`, kanbanMoved: (card, column) => `${card} déplacée vers ${column}`,
  kanbanLabels: (card) => `Étiquettes ${card}`, kanbanStatus: (card) => `Statut ${card}`,
  kanbanMoveTo: (card, column) => `Déplacer ${card} vers ${column}`, kanbanEmpty: 'Aucune carte',
  fileEmpty: 'Aucun fichier', fileSelect: (name) => `Sélectionner ${name}`,
  savedViews: 'Vues enregistrées', saveView: 'Enregistrer la vue', deleteView: (name) => `Supprimer ${name}`,
  splitPrimary: 'Panneau principal', splitSecondary: 'Panneau secondaire', splitResize: 'Redimensionner les panneaux',
  toolRunning: 'En cours', toolCompleted: 'Terminé', toolFailed: 'Échec',
  toolApproval: 'Approbation requise', toolApprove: 'Approuver', toolReject: 'Rejeter', details: 'Détails',
  calendarPrevious: 'Période précédente', calendarNext: 'Période suivante', calendarView: 'Vue',
  calendarDay: 'Jour', calendarWeek: 'Semaine', calendarMonthView: 'Mois', calendarNoEvents: 'Aucun événement',
  fileRoot: 'Fichiers', fileFolders: 'Dossiers', fileList: 'Fichiers', filePreview: (name) => `Aperçu de ${name}`,
  fileOpen: (name) => `Ouvrir ${name}`, preview: 'Aperçu', open: 'Ouvrir',
  previous: 'Précédent', next: 'Suivant', finish: 'Terminer', wizardValidation: 'Vérifiez cette étape avant de continuer.',
  wizardError: 'Échec de l’opération. Réessayez.',
  reply: 'Répondre', replyTo: (author) => `Répondre à ${author}`, sendReply: 'Envoyer la réponse', commentLike: (author) => `Aimer le commentaire de ${author}`,
  diffView: 'Vue des différences', diffUnified: 'Unifiée', diffSplit: 'Côte à côte', diffBefore: 'Avant', diffAfter: 'Après',
  diffAdded: 'Ajouté', diffRemoved: 'Supprimé', diffUnchanged: 'Inchangé',
  imageOpen: (name) => `Ouvrir l’image ${name}`, imagePosition: (index, total) => `Image ${index} sur ${total}`,
  cropX: 'Position horizontale', cropY: 'Position verticale', cropWidth: 'Largeur du recadrage', cropHeight: 'Hauteur du recadrage',
  cropApply: 'Recadrer l’image', cropFailed: 'Impossible de recadrer l’image.', cropLoading: 'Chargement de l’image',
  tourSkip: 'Ignorer la visite', tourTargetMissing: 'L’élément de cette étape est indisponible.',
  permissionCell: (permission, role) => `${permission} pour ${role}`, permissionRoleAll: (role) => `Toutes les autorisations pour ${role}`,
  permissionAllRoles: (permission) => `${permission} pour tous les rôles`, preferenceCell: (category, channel) => `${category} : ${channel}`,
  privacyAcceptAll: 'Tout accepter', privacyRejectAll: 'Refuser les options', privacySave: 'Enregistrer les préférences', privacyRequired: 'Nécessaire',
  venueMapLoad: 'Charger la carte', venueMapConsent: 'La carte est chargée depuis OpenStreetMap : votre navigateur se connectera à ses serveurs.',
  venueMapFrame: (venue) => `Carte de ${venue}`, venueMapOpen: 'Ouvrir dans OpenStreetMap',
  venueMapGoogle: 'Itinéraire avec Google Maps', venueMapApple: 'Itinéraire avec Plans d’Apple',
  floorPlanHint: 'Utilisez les flèches pour passer d’une zone à l’autre, Entrée pour sélectionner et Échap pour effacer.',
  floorPlanLegend: 'Légende', floorPlanLevel: 'Étage',
  floorPlanKind: (kind) => ({ room: 'Salle', stage: 'Scène', booth: 'Stand', food: 'Restauration', restroom: 'Toilettes', entrance: 'Entrée', info: 'Informations', service: 'Service', outdoor: 'Espace extérieur' } as Record<string, string>)[kind] ?? kind,
  floorPlanCapacity: (count) => `Capacité : ${count}`, floorPlanAccessible: 'Accès de plain-pied',
  floorPlanEmpty: 'Sélectionnez une zone du plan pour voir ses détails.', floorPlanClear: 'Effacer la sélection',
};

export const componentMessagesDe: ComponentMessages = {
  mentionSuggestions: 'Vorschläge für Erwähnungen', mentionEmpty: 'Keine Personen gefunden',
  hashtagSuggestions: 'Hashtag-Vorschläge', hashtagEmpty: 'Keine Hashtags gefunden',
  kanbanColumn: (column) => `Karten ${column}`, kanbanCount: (n) => `${n} ${n === 1 ? 'Karte' : 'Karten'}`,
  kanbanDrag: (card) => `${card} ziehen`, kanbanMoved: (card, column) => `${card} nach ${column} verschoben`,
  kanbanLabels: (card) => `Etiketten ${card}`, kanbanStatus: (card) => `Status ${card}`,
  kanbanMoveTo: (card, column) => `${card} nach ${column} verschieben`, kanbanEmpty: 'Keine Karten',
  fileEmpty: 'Keine Dateien', fileSelect: (name) => `${name} auswählen`,
  savedViews: 'Gespeicherte Ansichten', saveView: 'Ansicht speichern', deleteView: (name) => `${name} löschen`,
  splitPrimary: 'Hauptbereich', splitSecondary: 'Nebenbereich', splitResize: 'Bereiche skalieren',
  toolRunning: 'In Bearbeitung', toolCompleted: 'Abgeschlossen', toolFailed: 'Fehlgeschlagen',
  toolApproval: 'Genehmigung erforderlich', toolApprove: 'Genehmigen', toolReject: 'Ablehnen', details: 'Details',
  calendarPrevious: 'Vorheriger Zeitraum', calendarNext: 'Nächster Zeitraum', calendarView: 'Ansicht',
  calendarDay: 'Tag', calendarWeek: 'Woche', calendarMonthView: 'Monat', calendarNoEvents: 'Keine Termine',
  fileRoot: 'Dateien', fileFolders: 'Ordner', fileList: 'Dateien', filePreview: (name) => `Vorschau ${name}`,
  fileOpen: (name) => `${name} öffnen`, preview: 'Vorschau', open: 'Öffnen',
  previous: 'Zurück', next: 'Weiter', finish: 'Abschließen', wizardValidation: 'Prüfen Sie den aktuellen Schritt.',
  wizardError: 'Der Vorgang ist fehlgeschlagen. Versuchen Sie es erneut.',
  reply: 'Antworten', replyTo: (author) => `Antwort an ${author}`, sendReply: 'Antwort senden', commentLike: (author) => `Kommentar von ${author} gefällt mir`,
  diffView: 'Unterschiedsansicht', diffUnified: 'Vereint', diffSplit: 'Nebeneinander', diffBefore: 'Vorher', diffAfter: 'Nachher',
  diffAdded: 'Hinzugefügt', diffRemoved: 'Entfernt', diffUnchanged: 'Unverändert',
  imageOpen: (name) => `Bild ${name} öffnen`, imagePosition: (index, total) => `Bild ${index} von ${total}`,
  cropX: 'Horizontale Position', cropY: 'Vertikale Position', cropWidth: 'Zuschnittbreite', cropHeight: 'Zuschnitthöhe',
  cropApply: 'Bild zuschneiden', cropFailed: 'Bild konnte nicht zugeschnitten werden.', cropLoading: 'Bild wird geladen',
  tourSkip: 'Tour überspringen', tourTargetMissing: 'Das Element für diesen Schritt ist nicht verfügbar.',
  permissionCell: (permission, role) => `${permission} für ${role}`, permissionRoleAll: (role) => `Alle Berechtigungen für ${role}`,
  permissionAllRoles: (permission) => `${permission} für alle Rollen`, preferenceCell: (category, channel) => `${category}: ${channel}`,
  privacyAcceptAll: 'Alle akzeptieren', privacyRejectAll: 'Optionale ablehnen', privacySave: 'Einstellungen speichern', privacyRequired: 'Erforderlich',
  venueMapLoad: 'Karte laden', venueMapConsent: 'Die Karte wird von OpenStreetMap geladen: Ihr Browser verbindet sich mit dessen Servern.',
  venueMapFrame: (venue) => `Karte von ${venue}`, venueMapOpen: 'In OpenStreetMap öffnen',
  venueMapGoogle: 'Route mit Google Maps', venueMapApple: 'Route mit Apple Karten',
  floorPlanHint: 'Mit den Pfeiltasten zwischen Bereichen wechseln, mit Eingabe auswählen und mit Escape aufheben.',
  floorPlanLegend: 'Legende', floorPlanLevel: 'Etage',
  floorPlanKind: (kind) => ({ room: 'Raum', stage: 'Bühne', booth: 'Stand', food: 'Essen und Getränke', restroom: 'Toiletten', entrance: 'Eingang', info: 'Information', service: 'Service', outdoor: 'Außenbereich' } as Record<string, string>)[kind] ?? kind,
  floorPlanCapacity: (count) => `Kapazität: ${count}`, floorPlanAccessible: 'Stufenloser Zugang',
  floorPlanEmpty: 'Wählen Sie einen Bereich im Plan, um Details zu sehen.', floorPlanClear: 'Auswahl aufheben',
};

export const componentMessagesPt: ComponentMessages = {
  mentionSuggestions: 'Sugestões de menções', mentionEmpty: 'Nenhuma pessoa encontrada',
  hashtagSuggestions: 'Sugestões de hashtags', hashtagEmpty: 'Nenhuma hashtag encontrada',
  kanbanColumn: (column) => `Cartões de ${column}`, kanbanCount: (n) => `${n} ${n === 1 ? 'cartão' : 'cartões'}`,
  kanbanDrag: (card) => `Arrastar ${card}`, kanbanMoved: (card, column) => `${card} movido para ${column}`,
  kanbanLabels: (card) => `Etiquetas de ${card}`, kanbanStatus: (card) => `Estado de ${card}`,
  kanbanMoveTo: (card, column) => `Mover ${card} para ${column}`, kanbanEmpty: 'Nenhum cartão',
  fileEmpty: 'Nenhum arquivo', fileSelect: (name) => `Selecionar ${name}`,
  savedViews: 'Exibições salvas', saveView: 'Salvar exibição', deleteView: (name) => `Excluir ${name}`,
  splitPrimary: 'Painel principal', splitSecondary: 'Painel secundário', splitResize: 'Redimensionar painéis',
  toolRunning: 'Em andamento', toolCompleted: 'Concluído', toolFailed: 'Falhou',
  toolApproval: 'Aprovação necessária', toolApprove: 'Aprovar', toolReject: 'Rejeitar', details: 'Detalhes',
  calendarPrevious: 'Período anterior', calendarNext: 'Próximo período', calendarView: 'Visualização',
  calendarDay: 'Dia', calendarWeek: 'Semana', calendarMonthView: 'Mês', calendarNoEvents: 'Nenhum evento',
  fileRoot: 'Arquivos', fileFolders: 'Pastas', fileList: 'Arquivos', filePreview: (name) => `Prévia de ${name}`,
  fileOpen: (name) => `Abrir ${name}`, preview: 'Prévia', open: 'Abrir',
  previous: 'Anterior', next: 'Próximo', finish: 'Concluir', wizardValidation: 'Verifique a etapa antes de continuar.',
  wizardError: 'A operação falhou. Tente novamente.',
  reply: 'Responder', replyTo: (author) => `Responder a ${author}`, sendReply: 'Enviar resposta', commentLike: (author) => `Curtir comentário de ${author}`,
  diffView: 'Visualização de diferenças', diffUnified: 'Unificada', diffSplit: 'Lado a lado', diffBefore: 'Antes', diffAfter: 'Depois',
  diffAdded: 'Adicionado', diffRemoved: 'Removido', diffUnchanged: 'Sem alteração',
  imageOpen: (name) => `Abrir imagem ${name}`, imagePosition: (index, total) => `Imagem ${index} de ${total}`,
  cropX: 'Posição horizontal', cropY: 'Posição vertical', cropWidth: 'Largura do corte', cropHeight: 'Altura do corte',
  cropApply: 'Cortar imagem', cropFailed: 'Não foi possível cortar a imagem.', cropLoading: 'Carregando imagem',
  tourSkip: 'Pular guia', tourTargetMissing: 'O elemento desta etapa não está disponível.',
  permissionCell: (permission, role) => `${permission} para ${role}`, permissionRoleAll: (role) => `Todas as permissões de ${role}`,
  permissionAllRoles: (permission) => `${permission} para todos os papéis`, preferenceCell: (category, channel) => `${category}: ${channel}`,
  privacyAcceptAll: 'Aceitar tudo', privacyRejectAll: 'Recusar opcionais', privacySave: 'Salvar preferências', privacyRequired: 'Obrigatório',
  venueMapLoad: 'Carregar mapa', venueMapConsent: 'O mapa é carregado do OpenStreetMap: o seu navegador vai ligar-se aos servidores dele.',
  venueMapFrame: (venue) => `Mapa de ${venue}`, venueMapOpen: 'Abrir no OpenStreetMap',
  venueMapGoogle: 'Rotas com Google Maps', venueMapApple: 'Rotas com Apple Mapas',
  floorPlanHint: 'Use as setas para navegar entre as áreas, Enter para selecionar e Escape para limpar.',
  floorPlanLegend: 'Legenda', floorPlanLevel: 'Piso',
  floorPlanKind: (kind) => ({ room: 'Sala', stage: 'Palco', booth: 'Estande', food: 'Comida e bebida', restroom: 'Banheiros', entrance: 'Entrada', info: 'Informações', service: 'Serviço', outdoor: 'Área externa' } as Record<string, string>)[kind] ?? kind,
  floorPlanCapacity: (count) => `Capacidade: ${count}`, floorPlanAccessible: 'Acesso sem degraus',
  floorPlanEmpty: 'Selecione uma área na planta para ver os detalhes.', floorPlanClear: 'Limpar seleção',
};

export const componentMessagesAr: ComponentMessages = {
  mentionSuggestions: 'اقتراحات الإشارة', mentionEmpty: 'لم يتم العثور على أشخاص',
  hashtagSuggestions: 'اقتراحات الوسوم', hashtagEmpty: 'لم يتم العثور على وسوم',
  kanbanColumn: (column) => `بطاقات ${column}`, kanbanCount: (n) => `${n} بطاقة`,
  kanbanDrag: (card) => `سحب ${card}`, kanbanMoved: (card, column) => `تم نقل ${card} إلى ${column}`,
  kanbanLabels: (card) => `تسميات ${card}`, kanbanStatus: (card) => `حالة ${card}`,
  kanbanMoveTo: (card, column) => `نقل ${card} إلى ${column}`, kanbanEmpty: 'لا توجد بطاقات',
  fileEmpty: 'لا توجد ملفات', fileSelect: (name) => `تحديد ${name}`,
  savedViews: 'طرق العرض المحفوظة', saveView: 'حفظ العرض', deleteView: (name) => `حذف ${name}`,
  splitPrimary: 'اللوحة الرئيسية', splitSecondary: 'اللوحة الثانوية', splitResize: 'تغيير حجم اللوحات',
  toolRunning: 'قيد التنفيذ', toolCompleted: 'مكتمل', toolFailed: 'فشل',
  toolApproval: 'الموافقة مطلوبة', toolApprove: 'موافقة', toolReject: 'رفض', details: 'التفاصيل',
  calendarPrevious: 'الفترة السابقة', calendarNext: 'الفترة التالية', calendarView: 'العرض',
  calendarDay: 'يوم', calendarWeek: 'أسبوع', calendarMonthView: 'شهر', calendarNoEvents: 'لا توجد أحداث',
  fileRoot: 'الملفات', fileFolders: 'المجلدات', fileList: 'الملفات', filePreview: (name) => `معاينة ${name}`,
  fileOpen: (name) => `فتح ${name}`, preview: 'معاينة', open: 'فتح',
  previous: 'السابق', next: 'التالي', finish: 'إنهاء', wizardValidation: 'تحقق من الخطوة الحالية قبل المتابعة.',
  wizardError: 'فشلت العملية. حاول مرة أخرى.',
  reply: 'رد', replyTo: (author) => `الرد على ${author}`, sendReply: 'إرسال الرد', commentLike: (author) => `الإعجاب بتعليق ${author}`,
  diffView: 'عرض الاختلافات', diffUnified: 'موحد', diffSplit: 'جنبًا إلى جنب', diffBefore: 'قبل', diffAfter: 'بعد',
  diffAdded: 'مضاف', diffRemoved: 'محذوف', diffUnchanged: 'بلا تغيير',
  imageOpen: (name) => `فتح الصورة ${name}`, imagePosition: (index, total) => `الصورة ${index} من ${total}`,
  cropX: 'الموضع الأفقي', cropY: 'الموضع الرأسي', cropWidth: 'عرض القص', cropHeight: 'ارتفاع القص',
  cropApply: 'قص الصورة', cropFailed: 'تعذر قص الصورة.', cropLoading: 'جار تحميل الصورة',
  tourSkip: 'تخطي الجولة', tourTargetMissing: 'عنصر هذه الخطوة غير متاح.',
  permissionCell: (permission, role) => `${permission} لدور ${role}`, permissionRoleAll: (role) => `جميع أذونات ${role}`,
  permissionAllRoles: (permission) => `${permission} لجميع الأدوار`, preferenceCell: (category, channel) => `${category}: ${channel}`,
  privacyAcceptAll: 'قبول الكل', privacyRejectAll: 'رفض الاختيارية', privacySave: 'حفظ التفضيلات', privacyRequired: 'مطلوب',
  venueMapLoad: 'تحميل الخريطة', venueMapConsent: 'يتم تحميل الخريطة من OpenStreetMap: سيتصل متصفحك بخوادمه.',
  venueMapFrame: (venue) => `خريطة ${venue}`, venueMapOpen: 'فتح في OpenStreetMap',
  venueMapGoogle: 'الاتجاهات عبر خرائط Google', venueMapApple: 'الاتجاهات عبر خرائط Apple',
  floorPlanHint: 'استخدم الأسهم للتنقل بين المناطق، وEnter للاختيار، وEscape للإلغاء.',
  floorPlanLegend: 'مفتاح الخريطة', floorPlanLevel: 'الطابق',
  floorPlanKind: (kind) => ({ room: 'قاعة', stage: 'منصة', booth: 'جناح', food: 'طعام ومشروبات', restroom: 'دورات المياه', entrance: 'المدخل', info: 'الاستعلامات', service: 'خدمة', outdoor: 'منطقة خارجية' } as Record<string, string>)[kind] ?? kind,
  floorPlanCapacity: (count) => `السعة: ${count}`, floorPlanAccessible: 'دخول بدون درج',
  floorPlanEmpty: 'اختر منطقة على المخطط لعرض تفاصيلها.', floorPlanClear: 'مسح الاختيار',
};
