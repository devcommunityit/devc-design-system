import { useState } from 'react';
import { FilterBar, type FilterBarView } from '@dev-community/ui';

export function SavedViews() {
  const [values, setValues] = useState({ status: 'published', category: '' });
  const [views, setViews] = useState<FilterBarView[]>([{ id: 'recent', label: 'Recenti', values: { status: 'published', category: '' } }]);
  const [activeViewId, setActiveViewId] = useState<string | undefined>('recent');
  const [nextId, setNextId] = useState(1);
  return (
    <FilterBar
      filters={[
        { id: 'status', label: 'Stato', value: values.status, options: [{ value: '', label: 'Tutti' }, { value: 'published', label: 'Pubblicati' }], onChange: (status) => { setValues((current) => ({ ...current, status })); setActiveViewId(undefined); } },
        { id: 'category', label: 'Categoria', value: values.category, options: [{ value: '', label: 'Tutte' }, { value: 'guides', label: 'Guide' }], onChange: (category) => { setValues((current) => ({ ...current, category })); setActiveViewId(undefined); } },
      ]}
      views={views}
      activeViewId={activeViewId}
      onViewChange={(view) => {
        setActiveViewId(view?.id);
        if (view) setValues({ status: view.values.status ?? '', category: view.values.category ?? '' });
      }}
      onSaveView={(current) => {
        const view = { id: `saved-${nextId}`, label: `Vista ${nextId}`, values: current };
        setViews((previous) => [...previous, view]);
        setActiveViewId(view.id);
        setNextId((previous) => previous + 1);
      }}
      onDeleteView={(view) => { setViews((previous) => previous.filter((item) => item.id !== view.id)); setActiveViewId(undefined); }}
      onClear={() => { setValues({ status: '', category: '' }); setActiveViewId(undefined); }}
    />
  );
}
