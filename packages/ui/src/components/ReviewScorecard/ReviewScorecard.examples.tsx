import { ReviewScorecard } from './ReviewScorecard';

export function Basic() {
  return (
    <ReviewScorecard
      title="Review · Accessible event tooling"
      summary="A clear and actionable proposal."
      criteria={[
        { id: 'fit', label: 'Topic fit', score: 4, comment: 'Strong alignment with the track.' },
        { id: 'clarity', label: 'Clarity', score: 5 },
        { id: 'originality', label: 'Originality', score: 3 },
      ]}
      recommendation="Accept"
    />
  );
}
