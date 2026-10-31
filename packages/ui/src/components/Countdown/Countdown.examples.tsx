import { Countdown } from './Countdown';

export function Basic() {
  return <Countdown label="Conference begins in" targetDate="2030-06-15T09:00:00Z" />;
}

export function Expired() {
  return <Countdown targetDate="2020-01-01T00:00:00Z" expiredContent="The conference is underway." />;
}
