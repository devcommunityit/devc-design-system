import { AIToolCall } from '@devcommunityit/ui';

export function Approval() {
  return <AIToolCall title="Invia email a 2.400 destinatari" status="approval" description="Verifica il pubblico e il contenuto prima dell’invio." onApprove={() => {}} onReject={() => {}} />;
}
