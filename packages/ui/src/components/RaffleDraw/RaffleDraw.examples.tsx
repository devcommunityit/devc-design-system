import { LocaleProvider } from '../../i18n/LocaleProvider';
import { RaffleDraw } from './RaffleDraw';

export function Basic() {
  return (
    <LocaleProvider locale="en-US">
      <RaffleDraw
        title="Community conference raffle"
        description="One ticket was selected from all eligible entries."
        entryCount={128}
        winner={{ id: 'entry-42', name: 'Jordan Lee', entryNumber: 'A-042', detail: 'Won a conference pass' }}
      />
    </LocaleProvider>
  );
}

export function AwaitingWinner() {
  return (
    <LocaleProvider locale="en-US">
      <RaffleDraw title="Monthly member raffle" entryCount={86} winner={null} />
    </LocaleProvider>
  );
}
