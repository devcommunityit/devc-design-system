import { EmailPreview } from './index';
import { createEmailDocument } from '../EmailBuilder/emailDocument';

export function Basic() {
  return <EmailPreview title="Campaign preview" document={createEmailDocument()} previewDevice="desktop" onPreviewDeviceChange={() => undefined} subject="Community this month" preheader="Events, stories and updates" sender="Community team" />;
}
