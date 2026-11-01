import { BookOpen, Code, FileText, Mic, Video } from 'lucide-react';
import { Grid, Link, RankingCard } from '@devcommunityit/ui';

const articoli = [
  { id: 'react', label: 'Guida a React 19', value: 18420, description: 'Frontend', icon: <FileText /> },
  { id: 'aria', label: 'Accessibilità con React Aria', value: 12950, description: 'Accessibilità', icon: <FileText /> },
  { id: 'css', label: 'Container query in pratica', value: 9870, description: 'CSS', icon: <Code /> },
  { id: 'token', label: 'Design token e temi', value: 7340, description: 'Design system', icon: <BookOpen /> },
  { id: 'test', label: 'Test con Vitest', value: 5120, description: 'Qualità', icon: <Code /> },
  { id: 'rsc', label: 'Server Components spiegati', value: 4010, description: 'Frontend', icon: <FileText /> },
];

export function Basic() {
  return <RankingCard title="Articoli più letti" items={articoli.slice(0, 5)} />;
}

/** Brand gradient bars, currency values and a link to the full list. */
export function Gradient() {
  return (
    <RankingCard
      title="Corsi per ricavi"
      barStyle="gradient"
      formatOptions={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      items={[
        { id: 'ts', label: 'TypeScript avanzato', value: 24600, icon: <Video /> },
        { id: 'a11y', label: 'Accessibilità web', value: 19850, icon: <Video /> },
        { id: 'node', label: 'Node.js in produzione', value: 15200, icon: <Video /> },
        { id: 'podcast', label: 'Podcast premium', value: 6400, icon: <Mic /> },
      ]}
      footer={<Link href="#corsi">Tutti i corsi</Link>}
    />
  );
}

/** maxItems trims a longer list; cards wrap in a responsive grid. */
export function MaxItems() {
  return (
    <Grid minItemWidth="18rem" gap={4}>
      <RankingCard title="Top 3 articoli" items={articoli} maxItems={3} />
      <RankingCard
        title="Autori più attivi"
        headingLevel={3}
        items={[
          { id: 'giulia', label: 'Giulia Rossi', value: 42, description: 'contributi' },
          { id: 'marco', label: 'Marco Bianchi', value: 37, description: 'contributi' },
          { id: 'sara', label: 'Sara Esposito', value: 29, description: 'contributi' },
          { id: 'luca', label: 'Luca Romano', value: 18, description: 'contributi' },
        ]}
        maxItems={4}
      />
    </Grid>
  );
}
