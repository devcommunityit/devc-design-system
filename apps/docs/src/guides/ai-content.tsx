import { Alert, Link } from '@devcommunityit/ui';
import { AssistantWorkspace } from '@ui-src/components/PromptComposer/PromptComposer.examples';
import { Editor } from '@ui-src/components/SeoPreview/SeoPreview.examples';
import { Code, DocSection, RefTable } from '../components/Doc';

export default function AiContentGuide() {
  return (
    <>
      <DocSection title="Componenti AI e confini">
        <p>La libreria fornisce interfacce componibili, non un modello AI o un backend. Trasporto, autenticazione, autorizzazioni, quote, moderazione e gestione degli errori restano nel consumer.</p>
        <RefTable label="Componenti AI" columns={['Componente', 'Scopo']} rows={[
          [<Link key="p" href="/componenti/prompt-composer">PromptComposer</Link>, 'Richieste multilinea, invio IME-safe e interruzione esplicita.'],
          [<Link key="m" href="/componenti/chat-message">ChatMessage</Link>, 'Messaggi, risposta parziale e stato errore.'],
          [<Link key="s" href="/componenti/prompt-suggestions">PromptSuggestions</Link>, 'Richieste precompilate attivabili da tastiera.'],
          [<Link key="c" href="/componenti/source-list">SourceList</Link>, 'Fonti selezionate e verificate dal consumer.'],
          [<Link key="f" href="/componenti/response-feedback">ResponseFeedback</Link>, 'Valutazione utile/non utile, esclusiva e annullabile.'],
        ]} />
      </DocSection>
      <DocSection title="Assistente dimostrativo">
        <Alert tone="info" title="Simulazione locale">Questo esempio usa stato React e una risposta predefinita. Nessun prompt viene inviato a un modello e nessun dato è salvato.</Alert>
        <AssistantWorkspace />
      </DocSection>
      <DocSection title="Collegare un servizio reale">
        <p>Invoca il servizio dell’applicazione da <code>onSend</code>, passa lo stato di caricamento a <code>isGenerating</code> e interrompi il trasporto da <code>onStop</code>. Conserva il prompt in caso di errore e mostra una possibilità di riprovare. Le chiavi segrete restano sul server.</p>
        <Code language="tsx">{`<PromptComposer
  value={prompt}
  onChange={setPrompt}
  onSend={handleSend}
  isGenerating={pending}
  onStop={cancelRequest}
  isInvalid={Boolean(validationError)}
  errorMessage={validationError}
/>
<ChatMessage
  status={error ? 'error' : pending ? 'streaming' : 'complete'}
  statusText={error}
>
  {responseText}
</ChatMessage>`}</Code>
        <p><code>handleSend</code>, <code>cancelRequest</code> e lo stato nello snippet appartengono al consumer. Gestisci esplicitamente le Promise, ignora risposte obsolete e annulla richieste quando la conversazione cambia.</p>
      </DocSection>
      <DocSection title="Gestione dei contenuti web">
        <RefTable label="Componenti di gestione siti" columns={['Componente', 'Responsabilità']} rows={[
          [<Link key="p" href="/componenti/publish-status">PublishStatus</Link>, 'Mostra uno stato editoriale restituito dall’applicazione; non pubblica o pianifica.'],
          [<Link key="b" href="/componenti/bulk-action-bar">BulkActionBar</Link>, 'Mostra conteggio e azioni per la selezione del consumer.'],
          [<Link key="s" href="/componenti/seo-preview">SeoPreview</Link>, 'Anteprima editoriale di titolo, URL e descrizione; non modifica i metadati.'],
        ]} />
        <Editor />
      </DocSection>
      <DocSection title="Accessibilità e sicurezza dei contenuti">
        <ul>
          <li>Non annunciare ogni token in una live region: annuncia lo stato e una sintesi al completamento secondo il contesto dell’applicazione.</li>
          <li>Non spostare il focus a ogni risposta e non forzare lo scroll mentre l’utente legge contenuti precedenti.</li>
          <li>Usa testo o ReactNode sicuri. Se aggiungi Markdown, scegli e configura un parser con sanitizzazione; non inserire HTML del modello direttamente nel DOM.</li>
          <li>Valida URL, permessi e fonti sul server; una citazione visibile non dimostra l’attendibilità della risposta.</li>
          <li>Conferma azioni distruttive e ripristina il focus se una barra azioni scompare.</li>
          <li>Tutti i testi di sistema supportano i sette bundle e LocaleProvider; i contenuti editoriali sono tradotti dal consumer.</li>
        </ul>
      </DocSection>
    </>
  );
}
