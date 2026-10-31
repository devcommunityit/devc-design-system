import { SubmissionCard } from './SubmissionCard';

export function Basic() {
  return (
    <SubmissionCard
      title="Making events more accessible"
      href="#submission"
      summary="A practical session on inclusive event design."
      submitter="Morgan Chen"
      submittedAt="2026-09-10"
      status="Under review"
      action={<button type="button">View submission</button>}
    />
  );
}
