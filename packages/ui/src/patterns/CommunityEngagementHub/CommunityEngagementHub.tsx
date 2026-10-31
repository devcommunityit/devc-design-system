import type { ReactNode } from 'react';
import { Avatar } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Link } from '../../components/Typography/Typography';
import styles from './CommunityEngagementHub.module.css';

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  summary?: string;
  avatar?: string;
  href?: string;
  tags?: string[];
}

export interface CommunitySponsor {
  id: string;
  name: string;
  tier?: string;
  logo?: string;
  href?: string;
}

export interface CommunityTestimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

export interface CommunityPollOption {
  id: string;
  label: string;
  votes: number;
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: CommunityPollOption[];
  selectedOptionId?: string;
  closesAt?: string;
}

export interface CommunityNpsFeedback {
  question: string;
  selectedScore?: number;
}

export interface CommunityQuestion {
  id: string;
  question: string;
  author: string;
  votes: number;
  answers: number;
  reacted?: boolean;
}

export interface VolunteerShift {
  id: string;
  title: string;
  date: string;
  time: string;
  spotsRemaining: number;
  selected?: boolean;
}

export interface CommunityJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type?: string;
  href: string;
}

export interface CommunityBadge {
  id: string;
  title: string;
  description?: string;
  earned?: boolean;
  progress?: number;
  goal?: number;
}

export interface RaffleEntry {
  id: string;
  label: string;
  date?: string;
}

export interface CommunityRaffle {
  title: string;
  entries: RaffleEntry[];
  /** Winner is supplied by the consumer after an external drawing. */
  winner?: { name: string; entryLabel?: string };
}

export interface CommunityEngagementHubProps {
  title: ReactNode;
  description?: ReactNode;
  members?: CommunityMember[];
  sponsors?: CommunitySponsor[];
  testimonials?: CommunityTestimonial[];
  polls?: CommunityPoll[];
  nps?: CommunityNpsFeedback;
  questions?: CommunityQuestion[];
  invite?: { url: string; referralCode?: string; message?: string };
  volunteerShifts?: VolunteerShift[];
  jobs?: CommunityJob[];
  badges?: CommunityBadge[];
  streakDays?: number;
  raffle?: CommunityRaffle;
  onPollVote?: (pollId: string, optionId: string) => void;
  onNpsRate?: (score: number) => void;
  onQuestionVote?: (questionId: string) => void;
  onQuestionReact?: (questionId: string) => void;
  onInviteShare?: (url: string) => void;
  onShiftSelect?: (shiftId: string) => void;
  onRaffleEnter?: () => void;
  className?: string;
}

function HubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section} aria-label={title}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function MemberCard({ member }: { member: CommunityMember }) {
  return (
    <article className={styles.member}>
      <Avatar name={member.name} src={member.avatar} size="md" isDecorative />
      <div className={styles.memberBody}>
        <h4 className={styles.cardTitle}>
          {member.href ? <Link href={member.href}>{member.name}</Link> : member.name}
        </h4>
        <p className={styles.meta}>{member.role}</p>
        {member.summary ? <p className={styles.copy}>{member.summary}</p> : null}
        {member.tags?.length ? (
          <div className={styles.tags}>
            {member.tags.map((tag) => <Badge key={tag} size="sm">{tag}</Badge>)}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function CommunityEngagementHub({
  title,
  description,
  members,
  sponsors,
  testimonials,
  polls,
  nps,
  questions,
  invite,
  volunteerShifts,
  jobs,
  badges,
  streakDays,
  raffle,
  onPollVote,
  onNpsRate,
  onQuestionVote,
  onQuestionReact,
  onInviteShare,
  onShiftSelect,
  onRaffleEnter,
  className,
}: CommunityEngagementHubProps) {
  const sections = [
    members?.length,
    sponsors?.length || testimonials?.length,
    polls?.length,
    nps,
    questions?.length,
    invite,
    volunteerShifts?.length,
    jobs?.length,
    badges?.length || streakDays !== undefined,
    raffle,
  ].some(Boolean);

  return (
    <div className={[styles.hub, className].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>

      {!sections ? <p className={styles.empty}>Community activities will appear here.</p> : null}

      {members?.length ? (
        <HubSection title="Member directory">
          <div className={styles.memberGrid}>
            {members.map((member) => <MemberCard key={member.id} member={member} />)}
          </div>
        </HubSection>
      ) : null}

      {nps ? (
        <HubSection title="Recommendation feedback">
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>{nps.question}</h4>
            <div className={styles.npsScale} role="group" aria-label={nps.question}>
              {Array.from({ length: 11 }, (_, score) => (
                <Button
                  key={score}
                  size="sm"
                  variant={nps.selectedScore === score ? 'secondary' : 'outline'}
                  aria-pressed={nps.selectedScore === score}
                  isDisabled={!onNpsRate}
                  onPress={() => onNpsRate?.(score)}
                >
                  {score}
                </Button>
              ))}
            </div>
            <div className={styles.npsLabels}>
              <span>Not at all likely</span>
              <span>Extremely likely</span>
            </div>
          </div>
        </HubSection>
      ) : null}

      {sponsors?.length ? (
        <HubSection title="Community sponsors">
          <ul className={styles.sponsorGrid}>
            {sponsors.map((sponsor) => (
              <li className={styles.sponsor} key={sponsor.id}>
                {sponsor.logo ? (
                  <img className={styles.sponsorLogo} src={sponsor.logo} alt="" />
                ) : (
                  <span className={styles.sponsorName}>{sponsor.name}</span>
                )}
                {sponsor.logo ? <span className={styles.srOnly}>{sponsor.name}</span> : null}
                {sponsor.tier ? <span className={styles.meta}>{sponsor.tier}</span> : null}
                {sponsor.href ? <Link className={styles.stretchedLink} href={sponsor.href} aria-label={`Visit ${sponsor.name}`} /> : null}
              </li>
            ))}
          </ul>
        </HubSection>
      ) : null}

      {testimonials?.length ? (
        <HubSection title="Member stories">
          <div className={styles.testimonialGrid}>
            {testimonials.map((item) => (
              <figure className={styles.testimonial} key={item.id}>
                <blockquote>{item.quote}</blockquote>
                <figcaption className={styles.person}>
                  <Avatar name={item.author} src={item.avatar} size="sm" isDecorative />
                  <span><strong>{item.author}</strong>{item.role ? <span className={styles.meta}> · {item.role}</span> : null}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </HubSection>
      ) : null}

      {polls?.length ? (
        <HubSection title="Polls & surveys">
          <div className={styles.cardGrid}>
            {polls.map((poll) => {
              const total = poll.options.reduce((sum, option) => sum + option.votes, 0);
              return (
                <article className={styles.card} key={poll.id}>
                  <h4 className={styles.cardTitle}>{poll.question}</h4>
                  {poll.options.map((option) => {
                    const selected = poll.selectedOptionId === option.id;
                    const percentage = total > 0 ? Math.round((option.votes / total) * 100) : 0;
                    return (
                      <div className={styles.pollOption} key={option.id}>
                        <div className={styles.optionRow}>
                          <span>{option.label}</span>
                          <span className={styles.meta}>{percentage}% · {option.votes}</span>
                        </div>
                        <div className={styles.meter} role="meter" aria-label={`${option.label} votes`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
                          <span style={{ inlineSize: `${percentage}%` }} />
                        </div>
                        {onPollVote ? (
                          <Button size="sm" variant={selected ? 'secondary' : 'outline'} isDisabled={Boolean(poll.selectedOptionId)} onPress={() => onPollVote(poll.id, option.id)}>
                            {selected ? 'Your response' : 'Choose'}
                          </Button>
                        ) : null}
                      </div>
                    );
                  })}
                  {poll.closesAt ? <p className={styles.meta}>Closes <time dateTime={poll.closesAt}>{poll.closesAt}</time></p> : null}
                </article>
              );
            })}
          </div>
        </HubSection>
      ) : null}

      {questions?.length ? (
        <HubSection title="Community Q&A">
          <ul className={styles.list}>
            {questions.map((item) => (
              <li className={styles.listItem} key={item.id}>
                <div className={styles.questionBody}>
                  <p className={styles.cardTitle}>{item.question}</p>
                  <p className={styles.meta}>Asked by {item.author} · {item.answers} answers</p>
                </div>
                <div className={styles.actions}>
                  {onQuestionVote ? <Button size="sm" variant="outline" aria-label={`Upvote question by ${item.author}`} onPress={() => onQuestionVote(item.id)}>▲ {item.votes}</Button> : <span className={styles.meta}>{item.votes} votes</span>}
                  {onQuestionReact ? <Button size="sm" variant={item.reacted ? 'secondary' : 'ghost'} aria-pressed={item.reacted ?? false} onPress={() => onQuestionReact(item.id)}>♥ React</Button> : null}
                </div>
              </li>
            ))}
          </ul>
        </HubSection>
      ) : null}

      {invite ? (
        <HubSection title="Invite a member">
          <div className={styles.invite}>
            <div>
              <p className={styles.copy}>{invite.message ?? 'Grow the community by sharing your invitation.'}</p>
              {invite.referralCode ? <p className={styles.meta}>Referral code: <strong>{invite.referralCode}</strong></p> : null}
              <Link href={invite.url}>{invite.url}</Link>
            </div>
            {onInviteShare ? <Button variant="secondary" onPress={() => onInviteShare(invite.url)}>Share invite</Button> : null}
          </div>
        </HubSection>
      ) : null}

      {volunteerShifts?.length ? (
        <HubSection title="Volunteer shifts">
          <ul className={styles.list}>
            {volunteerShifts.map((shift) => (
              <li className={styles.listItem} key={shift.id}>
                <div className={styles.questionBody}>
                  <p className={styles.cardTitle}>{shift.title}</p>
                  <p className={styles.meta}><time dateTime={shift.date}>{shift.date}</time> · {shift.time} · {shift.spotsRemaining} spots left</p>
                </div>
                {onShiftSelect ? <Button size="sm" variant={shift.selected ? 'secondary' : 'outline'} isDisabled={!shift.selected && shift.spotsRemaining <= 0} onPress={() => onShiftSelect(shift.id)}>{shift.selected ? 'Selected' : 'Select shift'}</Button> : null}
              </li>
            ))}
          </ul>
        </HubSection>
      ) : null}

      {jobs?.length ? (
        <HubSection title="Community jobs">
          <ul className={styles.list}>
            {jobs.map((job) => (
              <li className={styles.listItem} key={job.id}>
                <div className={styles.questionBody}>
                  <h4 className={styles.cardTitle}><Link href={job.href}>{job.title}</Link></h4>
                  <p className={styles.meta}>{job.company} · {job.location}{job.type ? ` · ${job.type}` : ''}</p>
                </div>
                <Link className={styles.jobLink} href={job.href}>View job<span className={styles.srOnly}>: {job.title}</span></Link>
              </li>
            ))}
          </ul>
        </HubSection>
      ) : null}

      {badges?.length || streakDays !== undefined ? (
        <HubSection title="Badges & streak">
          {streakDays !== undefined ? <p className={styles.streak}><strong>{streakDays}</strong> day{streakDays === 1 ? '' : 's'} active streak</p> : null}
          {badges?.length ? (
            <ul className={styles.badgeGrid}>
              {badges.map((badge) => (
                <li className={styles.badgeCard} key={badge.id}>
                  <Badge tone={badge.earned ? 'success' : 'neutral'}>{badge.earned ? 'Earned' : 'In progress'}</Badge>
                  <h4 className={styles.cardTitle}>{badge.title}</h4>
                  {badge.description ? <p className={styles.meta}>{badge.description}</p> : null}
                  {badge.goal ? (
                    <div className={styles.progress}>
                      <div className={styles.optionRow}><span>Progress</span><span>{badge.progress ?? 0} / {badge.goal}</span></div>
                      <progress aria-label={`${badge.title} progress`} max={badge.goal} value={Math.min(badge.progress ?? 0, badge.goal)} />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </HubSection>
      ) : null}

      {raffle ? (
        <HubSection title="Community raffle">
          <div className={styles.raffle}>
            <div className={styles.questionBody}>
              <h4 className={styles.cardTitle}>{raffle.title}</h4>
              <p className={styles.meta}>{raffle.entries.length} entries</p>
              <ul className={styles.entryList}>
                {raffle.entries.map((entry) => (
                  <li key={entry.id}>{entry.label}{entry.date ? <time className={styles.meta} dateTime={entry.date}> · {entry.date}</time> : null}</li>
                ))}
              </ul>
            </div>
            {onRaffleEnter ? <Button onPress={onRaffleEnter}>Enter raffle</Button> : null}
          </div>
          {raffle.winner ? (
            <p className={styles.winner} role="status"><strong>Winner:</strong> {raffle.winner.name}{raffle.winner.entryLabel ? ` · ${raffle.winner.entryLabel}` : ''}</p>
          ) : null}
        </HubSection>
      ) : null}
    </div>
  );
}
