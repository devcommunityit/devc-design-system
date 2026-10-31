import { UsageMeter } from './index';

export function Basic() {
  return <UsageMeter label="Community members" value={780} limit={1000} unit="members" description="220 places remaining" thresholds={{ warning: 800, danger: 950 }} />;
}
