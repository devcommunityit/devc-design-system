import { CfpStatusBanner } from './CfpStatusBanner';

export function Open() {
  return (
    <CfpStatusBanner
      status="open"
      title="Share your work at Community Summit"
      description="Talk proposals are welcome from practitioners at every career stage."
      deadline="2026-09-30"
      action={<a href="#submit">Submit a proposal</a>}
    />
  );
}

export function Closed() {
  return <CfpStatusBanner status="closed" title="Submissions are closed" description="The review team is preparing the program." />;
}
