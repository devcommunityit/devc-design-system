import type { ReactNode } from 'react';
import { ProfileCard, type ProfileCardStat, type ProfileCardTone } from '../ProfileCard/ProfileCard';
import { TextField } from '../TextField/TextField';
import styles from './MemberDirectory.module.css';

export interface MemberDirectoryMember {
  id: string;
  name: string;
  avatarSrc?: string;
  jobTitle?: ReactNode;
  company?: ReactNode;
  href?: string;
  tags?: ReactNode;
  stats?: ProfileCardStat[];
  actions?: ReactNode;
  tone?: ProfileCardTone;
  searchText?: string;
}

export interface MemberDirectoryProps {
  'aria-label': string;
  searchLabel: string;
  members: readonly MemberDirectoryMember[];
  query: string;
  onQueryChange: (query: string) => void;
  heading?: ReactNode;
  emptyState?: ReactNode;
}

/** Searchable member grid composed from the existing ProfileCard. */
export function MemberDirectory({
  'aria-label': ariaLabel,
  searchLabel,
  members,
  query,
  onQueryChange,
  heading,
  emptyState = 'No members match your search.',
}: MemberDirectoryProps) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleMembers = members.filter((member) =>
    [member.name, member.searchText, typeof member.jobTitle === 'string' ? member.jobTitle : '']
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <section className={styles.directory} aria-label={ariaLabel}>
      {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
      <TextField
        className={styles.search}
        type="search"
        label={searchLabel}
        value={query}
        onChange={onQueryChange}
      />
      {visibleMembers.length ? (
        <ul className={styles.grid}>
          {visibleMembers.map((member) => (
            <li key={member.id}>
              <ProfileCard
                name={member.name}
                avatarSrc={member.avatarSrc}
                jobTitle={member.jobTitle}
                company={member.company}
                href={member.href}
                tags={member.tags}
                stats={member.stats}
                actions={member.actions}
                tone={member.tone}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{emptyState}</p>
      )}
    </section>
  );
}
