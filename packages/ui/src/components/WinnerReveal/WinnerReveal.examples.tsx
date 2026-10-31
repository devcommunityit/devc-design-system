import { LocaleProvider } from '../../i18n/LocaleProvider';
import { WinnerReveal } from './WinnerReveal';

export function Basic() {
  return (
    <LocaleProvider locale="en-US">
      <WinnerReveal winner={{ id: 'winner-1', name: 'Jordan Lee', entryNumber: 'A-042', detail: 'Community conference pass' }} />
    </LocaleProvider>
  );
}

export function Empty() {
  return <WinnerReveal winner={null} />;
}
