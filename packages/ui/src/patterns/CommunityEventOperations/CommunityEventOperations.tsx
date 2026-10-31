import { CalendarDays, MapPin, TicketCheck } from "lucide-react";
import { useId, type HTMLAttributes, type ReactNode } from "react";
import { useLocale } from "../../i18n/LocaleProvider";
import { Agenda, AgendaItem } from "../../components/Agenda/Agenda";
import { Badge } from "../../components/Badge/Badge";
import { Button } from "../../components/Button/Button";
import { NumberInput } from "../../components/NumberInput/NumberInput";
import { Progress } from "../../components/Progress/Progress";
import { Link } from "../../components/Typography/Typography";
import { cx } from "../../utils";
import styles from "./CommunityEventOperations.module.css";

export interface CommunityEventTicketTier {
  id: string;
  name: string;
  description?: ReactNode;
  priceLabel: ReactNode;
  /** Remaining tickets; zero marks this tier sold out. */
  available: number;
  maxPerOrder?: number;
}

export interface CommunityEventTrack {
  id: string;
  name: string;
  sessions: CommunityEventSession[];
}

export interface CommunityEventSession {
  id: string;
  title: ReactNode;
  startsAt: string;
  endsAt?: string;
  speaker?: ReactNode;
  description?: ReactNode;
  location?: ReactNode;
  href?: string;
}

export interface CommunityCfpReview {
  id: string;
  reviewer: string;
  score: number;
  maxScore: number;
  feedback?: ReactNode;
  conflictOfInterest?: boolean;
}

export interface CommunityEventOperationsProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> {
  title: ReactNode;
  startsAt: string;
  endsAt?: string;
  /** IANA time zone used to format event and session times. */
  timeZone?: string;
  /** Required reference instant; the pattern does not run a timer or update it automatically. */
  now: Date | string | number;
  registrationDeadline?: string;
  tickets?: {
    tiers: CommunityEventTicketTier[];
    /** Controlled quantities by tier id. */
    quantities: Record<string, number>;
    onQuantityChange?: (tierId: string, quantity: number) => void;
    onRegister?: () => void;
    registerLabel?: ReactNode;
    waitlist?: {
      status: "available" | "joined" | "closed";
      onJoin?: () => void;
      label?: ReactNode;
    };
  };
  /** Consumer-provided pass content. QR rendering/generation is outside this component. */
  pass?: {
    status: "ready" | "not-issued" | "revoked";
    qrCode?: ReactNode;
    attendeeName?: ReactNode;
    ticketName?: ReactNode;
    passId?: string;
  };
  checkIn?: {
    status: "not-checked-in" | "checked-in" | "needs-review";
    detail?: ReactNode;
    checkedInAt?: string;
    onCheckIn?: () => void;
  };
  tracks?: CommunityEventTrack[];
  cfp?: {
    status:
      | "not-open"
      | "open"
      | "submitted"
      | "under-review"
      | "accepted"
      | "rejected"
      | "withdrawn";
    deadline?: string;
    detail?: ReactNode;
    submissionHref?: string;
    onSubmit?: () => void;
    reviews?: CommunityCfpReview[];
  };
  venue?: {
    name: ReactNode;
    address?: ReactNode;
    details?: ReactNode;
    mapHref?: string;
    accessibility?: string[];
    accessibilityNote?: ReactNode;
  };
  cancellation?: {
    status:
      | "not-cancelled"
      | "cancelled"
      | "refund-requested"
      | "refund-processing"
      | "refunded"
      | "refund-denied";
    detail?: ReactNode;
  };
  calendarHref?: string;
  certificateHref?: string;
}

const cfpStatus: Record<
  NonNullable<CommunityEventOperationsProps["cfp"]>["status"],
  { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" }
> = {
  "not-open": { label: "Not open", tone: "neutral" },
  open: { label: "Open", tone: "success" },
  submitted: { label: "Submitted", tone: "info" },
  "under-review": { label: "Under review", tone: "info" },
  accepted: { label: "Accepted", tone: "success" },
  rejected: { label: "Not accepted", tone: "danger" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
};

const cancellationStatus: Record<
  NonNullable<CommunityEventOperationsProps["cancellation"]>["status"],
  { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" }
> = {
  "not-cancelled": { label: "Active", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
  "refund-requested": { label: "Refund requested", tone: "info" },
  "refund-processing": { label: "Refund processing", tone: "warning" },
  refunded: { label: "Refunded", tone: "success" },
  "refund-denied": { label: "Refund not approved", tone: "danger" },
};

function countdown(target: string, now: Date | string | number) {
  const difference = new Date(target).getTime() - new Date(now).getTime();
  if (!Number.isFinite(difference)) return "Date unavailable";
  if (difference <= 0) return "Passed";
  const minutes = Math.floor(difference / 60_000);
  const days = Math.floor(minutes / 1_440);
  const hours = Math.floor((minutes % 1_440) / 60);
  const remainingMinutes = minutes % 60;
  return [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    remainingMinutes > 0 || (days === 0 && hours === 0)
      ? `${remainingMinutes}m`
      : null,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatTime(value: string, locale: string, timeZone?: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

function formatDateTime(value: string, locale: string, timeZone?: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

const checkInStatus = {
  "not-checked-in": { label: "Not checked in", tone: "neutral" as const },
  "checked-in": { label: "Checked in", tone: "success" as const },
  "needs-review": { label: "Needs review", tone: "warning" as const },
};

/**
 * A controlled event-operations summary for attendees and organizers. All statuses, quantities,
 * QR content, and action outcomes are supplied by the consumer; no server or device APIs are used.
 */
export function CommunityEventOperations({
  title,
  startsAt,
  endsAt,
  timeZone,
  now,
  registrationDeadline,
  tickets,
  pass,
  checkIn,
  tracks = [],
  cfp,
  venue,
  cancellation,
  calendarHref,
  certificateHref,
  className,
  ...rest
}: CommunityEventOperationsProps) {
  const { locale } = useLocale();
  const headingId = useId();
  const soldOut =
    Boolean(tickets?.tiers.length) &&
    tickets!.tiers.every((tier) => tier.available <= 0);
  const selectedCount = tickets
    ? tickets.tiers.reduce(
        (sum, tier) =>
          sum +
          Math.min(
            Math.max(0, tier.available),
            Math.max(0, tier.maxPerOrder ?? tier.available),
            Math.max(0, tickets.quantities[tier.id] ?? 0),
          ),
        0,
      )
    : 0;
  const status = checkIn ? checkInStatus[checkIn.status] : undefined;
  const startTime = formatTime(startsAt, locale, timeZone);
  const endTime = endsAt ? formatTime(endsAt, locale, timeZone) : undefined;
  const eventCountdown = countdown(startsAt, now);

  return (
    <section
      aria-labelledby={headingId}
      className={cx(styles.root, className)}
      {...rest}
    >
      <header className={styles.header}>
        <div>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          <p className={styles.eventTime}>
            <time dateTime={startsAt}>{startTime}</time>
            {endTime ? (
              <>
                {" "}
                – <time dateTime={endsAt}>{endTime}</time>
              </>
            ) : null}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Badge
            tone={
              eventCountdown === "Passed"
                ? "info"
                : eventCountdown === "Date unavailable"
                  ? "neutral"
                  : "brand"
            }
          >
            {eventCountdown === "Passed"
              ? "Event started"
              : `Starts in ${eventCountdown}`}
          </Badge>
          {calendarHref ? (
            <Link
              href={calendarHref}
              variant="standalone"
              className={styles.actionLink}
            >
              <CalendarDays aria-hidden="true" /> Add to calendar
            </Link>
          ) : null}
        </div>
      </header>

      <div className={styles.grid}>
        {tickets ? (
          <section
            aria-labelledby={`${headingId}-tickets`}
            className={styles.panel}
          >
            <h3 id={`${headingId}-tickets`} className={styles.sectionTitle}>
              Tickets and registration
            </h3>
            {registrationDeadline ? (
              <p className={styles.deadline}>
                Registration deadline:{" "}
                <time dateTime={registrationDeadline}>
                  {formatDateTime(registrationDeadline, locale, timeZone)}
                </time>
                <Badge
                  tone={
                    countdown(registrationDeadline, now) === "Passed"
                      ? "danger"
                      : "warning"
                  }
                  size="sm"
                >
                  {countdown(registrationDeadline, now)}
                </Badge>
              </p>
            ) : null}
            {tickets.tiers.length ? (
              <ul className={styles.tierList}>
                {tickets.tiers.map((tier) => {
                  const remaining = Math.max(0, tier.available);
                  const unavailable = remaining === 0;
                  return (
                    <li key={tier.id} className={styles.tier}>
                      <div className={styles.tierDetails}>
                        <div className={styles.tierHeading}>
                          <h4 className={styles.tierName}>{tier.name}</h4>
                          <strong>{tier.priceLabel}</strong>
                        </div>
                        {tier.description ? (
                          <div className={styles.muted}>{tier.description}</div>
                        ) : null}
                        <p className={styles.availability}>
                          {unavailable ? "Sold out" : `${remaining} remaining`}
                        </p>
                      </div>
                      <NumberInput
                        label={`${tier.name} quantity`}
                        value={tickets.quantities[tier.id] ?? 0}
                        onChange={(quantity) => {
                          if (Number.isFinite(quantity))
                            tickets.onQuantityChange?.(tier.id, quantity);
                        }}
                        minValue={0}
                        maxValue={Math.max(
                          0,
                          Math.min(remaining, tier.maxPerOrder ?? remaining),
                        )}
                        isDisabled={unavailable || !tickets.onQuantityChange}
                        className={styles.quantity}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={styles.muted}>No ticket tiers are available.</p>
            )}
            {soldOut ? (
              <p className={styles.soldOut} role="status">
                All ticket tiers are sold out.
              </p>
            ) : null}
            {tickets.onRegister ? (
              <Button
                onPress={tickets.onRegister}
                isDisabled={soldOut || selectedCount === 0}
                startIcon={<TicketCheck />}
              >
                {tickets.registerLabel ?? "Continue registration"}
              </Button>
            ) : null}
            {tickets.waitlist ? (
              <div className={styles.waitlist}>
                {tickets.waitlist.status === "joined" ? (
                  <Badge tone="success">You are on the waitlist</Badge>
                ) : tickets.waitlist.status === "closed" ? (
                  <Badge tone="neutral">Waitlist closed</Badge>
                ) : (
                  <Button
                    variant="outline"
                    onPress={tickets.waitlist.onJoin}
                    isDisabled={!tickets.waitlist.onJoin}
                  >
                    {tickets.waitlist.label ?? "Join waitlist"}
                  </Button>
                )}
              </div>
            ) : null}
          </section>
        ) : null}

        {pass ? (
          <section
            aria-labelledby={`${headingId}-pass`}
            className={styles.panel}
          >
            <h3 id={`${headingId}-pass`} className={styles.sectionTitle}>
              Digital pass
            </h3>
            {pass.status === "ready" ? (
              <>
                {pass.attendeeName ? <p>{pass.attendeeName}</p> : null}
                {pass.ticketName ? (
                  <p className={styles.muted}>{pass.ticketName}</p>
                ) : null}
                {pass.passId ? (
                  <p className={styles.muted}>Pass ID: {pass.passId}</p>
                ) : null}
                {pass.qrCode ? (
                  <div className={styles.qr} aria-label="Digital pass code">
                    {pass.qrCode}
                  </div>
                ) : (
                  <p className={styles.muted}>Pass code not provided.</p>
                )}
              </>
            ) : (
              <Badge tone={pass.status === "revoked" ? "danger" : "neutral"}>
                {pass.status === "revoked" ? "Pass revoked" : "Pass not issued"}
              </Badge>
            )}
          </section>
        ) : null}

        {checkIn ? (
          <section
            aria-labelledby={`${headingId}-checkin`}
            className={styles.panel}
          >
            <h3 id={`${headingId}-checkin`} className={styles.sectionTitle}>
              Manual check-in
            </h3>
            <Badge tone={status!.tone}>{status!.label}</Badge>
            {checkIn.detail ? (
              <p className={styles.muted}>{checkIn.detail}</p>
            ) : null}
            {checkIn.checkedInAt ? (
              <p className={styles.muted}>
                Checked in at{" "}
                <time dateTime={checkIn.checkedInAt}>
                  {formatDateTime(checkIn.checkedInAt, locale, timeZone)}
                </time>
              </p>
            ) : null}
            {checkIn.status !== "checked-in" && checkIn.onCheckIn ? (
              <Button variant="outline" onPress={checkIn.onCheckIn}>
                Mark as checked in
              </Button>
            ) : null}
          </section>
        ) : null}

        {cfp ? (
          <section
            aria-labelledby={`${headingId}-cfp`}
            className={styles.panel}
          >
            <h3 id={`${headingId}-cfp`} className={styles.sectionTitle}>
              Call for papers
            </h3>
            <Badge tone={cfpStatus[cfp.status].tone}>
              {cfpStatus[cfp.status].label}
            </Badge>
            {cfp.detail ? <p className={styles.muted}>{cfp.detail}</p> : null}
            {cfp.deadline ? (
              <p className={styles.deadline}>
                Submission deadline:{" "}
                <time dateTime={cfp.deadline}>
                  {formatDateTime(cfp.deadline, locale, timeZone)}
                </time>
                <Badge
                  tone={
                    countdown(cfp.deadline, now) === "Passed"
                      ? "danger"
                      : "warning"
                  }
                  size="sm"
                >
                  {countdown(cfp.deadline, now)}
                </Badge>
              </p>
            ) : null}
            {cfp.status === "open" && cfp.submissionHref ? (
              <Link href={cfp.submissionHref}>Submit a proposal</Link>
            ) : null}
            {cfp.status === "open" && !cfp.submissionHref && cfp.onSubmit ? (
              <Button variant="outline" onPress={cfp.onSubmit}>
                Submit a proposal
              </Button>
            ) : null}
            {cfp.reviews?.length ? (
              <div className={styles.reviewList} aria-label="CFP review scorecard">
                <h4 className={styles.reviewHeading}>Review scorecard</h4>
                {cfp.reviews.map((review) => {
                  const maxScore = Number.isFinite(review.maxScore)
                    ? Math.max(1, review.maxScore)
                    : 1;
                  const score = Number.isFinite(review.score)
                    ? Math.min(Math.max(0, review.score), maxScore)
                    : 0;
                  return (
                    <article className={styles.review} key={review.id}>
                      <div className={styles.reviewHeader}>
                        <strong>{review.reviewer}</strong>
                        <span>{score} / {maxScore}</span>
                      </div>
                      <Progress
                        aria-label={`${review.reviewer} review score`}
                        value={score}
                        maxValue={maxScore}
                        valueLabel={`${score} / ${maxScore}`}
                        showValue={false}
                      />
                      {review.feedback ? (
                        <p className={styles.muted}>{review.feedback}</p>
                      ) : null}
                      {review.conflictOfInterest ? (
                        <Badge tone="warning">Conflict of interest declared</Badge>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : null}
          </section>
        ) : null}

        {venue ? (
          <section
            aria-labelledby={`${headingId}-venue`}
            className={styles.panel}
          >
            <h3 id={`${headingId}-venue`} className={styles.sectionTitle}>
              Venue and accessibility
            </h3>
            <p className={styles.venueName}>
              <MapPin aria-hidden="true" /> {venue.name}
            </p>
            {venue.address ? (
              <p className={styles.muted}>{venue.address}</p>
            ) : null}
            {venue.details ? (
              <p className={styles.muted}>{venue.details}</p>
            ) : null}
            {venue.mapHref ? (
              <Link href={venue.mapHref} external>
                Venue map
              </Link>
            ) : null}
            {venue.accessibility?.length ? (
              <ul className={styles.accessibility}>
                {venue.accessibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {venue.accessibilityNote ? (
              <p className={styles.muted}>{venue.accessibilityNote}</p>
            ) : null}
          </section>
        ) : null}

        {cancellation ? (
          <section
            aria-labelledby={`${headingId}-cancellation`}
            className={styles.panel}
          >
            <h3
              id={`${headingId}-cancellation`}
              className={styles.sectionTitle}
            >
              Cancellation and refund
            </h3>
            <Badge tone={cancellationStatus[cancellation.status].tone}>
              {cancellationStatus[cancellation.status].label}
            </Badge>
            {cancellation.detail ? (
              <p className={styles.muted}>{cancellation.detail}</p>
            ) : null}
          </section>
        ) : null}

        {certificateHref ? (
          <section
            aria-labelledby={`${headingId}-certificate`}
            className={styles.panel}
          >
            <h3 id={`${headingId}-certificate`} className={styles.sectionTitle}>
              Attendance certificate
            </h3>
            <Link href={certificateHref}>View attendance certificate</Link>
          </section>
        ) : null}
      </div>

      {tracks.length ? (
        <section aria-label="Event schedule" className={styles.schedule}>
          <h3 className={styles.sectionTitle}>Schedule</h3>
          <div className={styles.trackGrid}>
            {tracks.map((track) => (
              <Agenda
                key={track.id}
                title={track.name}
                headingLevel={4}
                className={styles.track}
              >
                {track.sessions.map((session) => (
                  <AgendaItem
                    key={session.id}
                    title={session.title}
                    href={session.href}
                    startTime={formatTime(session.startsAt, locale, timeZone)}
                    endTime={
                      session.endsAt
                        ? formatTime(session.endsAt, locale, timeZone)
                        : undefined
                    }
                    startDateTime={session.startsAt}
                    endDateTime={session.endsAt}
                    description={
                      session.speaker ? (
                        <>
                          {session.speaker}
                          {session.description ? (
                            <> · {session.description}</>
                          ) : null}
                        </>
                      ) : (
                        session.description
                      )
                    }
                    location={session.location}
                    headingLevel={5}
                  />
                ))}
              </Agenda>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
