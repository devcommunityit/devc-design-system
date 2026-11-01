import { Alert, Link } from '@devcommunityit/ui';
import { AssistantWorkspace } from '@ui-src/components/PromptComposer/PromptComposer.examples';
import { Editor } from '@ui-src/components/SeoPreview/SeoPreview.examples';
import { Code, DocSection, RefTable } from '../../components/Doc';

export default function AiContentGuide() {
  return (
    <>
      <DocSection title="AI components and boundaries">
        <p>The library provides composable interfaces, not an AI model or a backend. Transport, authentication, authorization, quotas, moderation, and error handling remain the consumer’s responsibility.</p>
        <RefTable label="AI components" columns={['Component', 'Purpose']} rows={[
          [<Link key="p" href="/componenti/prompt-composer">PromptComposer</Link>, 'Multiline prompts, IME-safe submission, and explicit stopping.'],
          [<Link key="m" href="/componenti/chat-message">ChatMessage</Link>, 'Messages, partial responses, and error state.'],
          [<Link key="s" href="/componenti/prompt-suggestions">PromptSuggestions</Link>, 'Keyboard-accessible prefilled prompts.'],
          [<Link key="c" href="/componenti/source-list">SourceList</Link>, 'Sources selected and verified by the consumer.'],
          [<Link key="f" href="/componenti/response-feedback">ResponseFeedback</Link>, 'Exclusive, undoable helpful/not helpful rating.'],
        ]} />
      </DocSection>
      <DocSection title="Demo assistant">
        <Alert tone="info" title="Local simulation">This example uses React state and a predefined response. No prompt is sent to a model and no data is stored.</Alert>
        <AssistantWorkspace />
      </DocSection>
      <DocSection title="Connecting a real service">
        <p>Call the application service from <code>onSend</code>, pass the loading state to <code>isGenerating</code>, and abort the transport from <code>onStop</code>. Keep the prompt when an error occurs and offer a way to retry. Secret keys stay on the server.</p>
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
        <p><code>handleSend</code>, <code>cancelRequest</code>, and the state in the snippet belong to the consumer. Handle Promises explicitly, ignore stale responses, and cancel requests when the conversation changes.</p>
      </DocSection>
      <DocSection title="Web content management">
        <RefTable label="Site management components" columns={['Component', 'Responsibility']} rows={[
          [<Link key="p" href="/componenti/publish-status">PublishStatus</Link>, 'Shows an editorial status returned by the application; does not publish or schedule.'],
          [<Link key="b" href="/componenti/bulk-action-bar">BulkActionBar</Link>, 'Shows the count and actions for the consumer’s selection.'],
          [<Link key="s" href="/componenti/seo-preview">SeoPreview</Link>, 'Editorial preview of title, URL, and description; does not change metadata.'],
        ]} />
        <Editor />
      </DocSection>
      <DocSection title="Accessibility and content safety">
        <ul>
          <li>Don’t announce every token in a live region: announce the status and a summary on completion, according to the application context.</li>
          <li>Don’t move focus on every response and don’t force scrolling while the user is reading earlier content.</li>
          <li>Use safe text or ReactNode. If you add Markdown, choose and configure a parser with sanitization; never insert model HTML directly into the DOM.</li>
          <li>Validate URLs, permissions, and sources on the server; a visible citation does not prove that the response is reliable.</li>
          <li>Confirm destructive actions and restore focus if an action bar disappears.</li>
          <li>All system strings support the seven bundles and LocaleProvider; editorial content is translated by the consumer.</li>
        </ul>
      </DocSection>
    </>
  );
}
