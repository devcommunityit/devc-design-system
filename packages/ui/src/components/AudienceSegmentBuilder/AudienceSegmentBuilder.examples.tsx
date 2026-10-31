import { AudienceSegmentBuilder, type AudienceField, type AudienceFilter } from './index';

const fields: AudienceField[] = [{ id: 'location', label: 'Location' }, { id: 'plan', label: 'Plan' }];
const operators: AudienceField[] = [{ id: 'equals', label: 'equals' }, { id: 'contains', label: 'contains' }];
const filters: AudienceFilter[] = [{ id: 'filter-1', field: 'plan', operator: 'equals', value: 'Pro' }];

export function Basic() {
  return <AudienceSegmentBuilder title="Audience rules" fields={fields} operators={operators} filters={filters} onFilterChange={() => undefined} onAddFilter={() => undefined} onRemoveFilter={() => undefined} />;
}
