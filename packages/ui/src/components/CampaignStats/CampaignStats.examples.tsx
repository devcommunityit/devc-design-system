import { CampaignStats } from './index';

export function Basic() {
  return <CampaignStats title="October newsletter" stats={[{ id: 'delivered', label: 'Delivered', value: 12450 }, { id: 'open-rate', label: 'Open rate', value: 0.42, formatOptions: { style: 'percent' }, description: 'Unique opens' }, { id: 'clicks', label: 'Clicks', value: 812 }]} />;
}
