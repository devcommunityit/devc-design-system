import { useState } from 'react';
import { CheckInScanner } from './CheckInScanner';

export function ManualEntry() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  return (
    <div>
      <CheckInScanner title="Check in attendee" code={code} onCodeChange={setCode} onCheckIn={(value) => setMessage(`Ready to check in ${value}`)} />
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}

export function HostViewport() {
  return (
    <CheckInScanner
      title="Manual check-in"
      code=""
      onCodeChange={() => {}}
      onCheckIn={() => {}}
      scannerViewport={<p>Host-provided scanner viewport goes here.</p>}
    />
  );
}
