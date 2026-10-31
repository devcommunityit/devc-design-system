import { useId, type HTMLAttributes, type ReactNode } from 'react';
import styles from './ReviewScorecard.module.css';

export interface ReviewCriterion {
  id: string;
  label: ReactNode;
  score: number;
  maxScore?: number;
  comment?: ReactNode;
}

export interface ReviewScorecardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  criteria: ReviewCriterion[];
  recommendation?: ReactNode;
  summary?: ReactNode;
}

export function ReviewScorecard({ title, criteria, recommendation, summary, className, ...rest }: ReviewScorecardProps) {
  const titleId = useId();
  return (
    <article aria-labelledby={titleId} className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      <h2 id={titleId} className={styles.title}>{title}</h2>
      {summary ? <p className={styles.summary}>{summary}</p> : null}
      <dl className={styles.criteria}>
        {criteria.map((criterion) => {
          const maxScore = criterion.maxScore ?? 5;
          const value = Math.min(maxScore, Math.max(0, criterion.score));
          return (
            <div className={styles.criterion} key={criterion.id}>
              <dt className={styles.label}>{criterion.label}</dt>
              <dd className={styles.score}>
                <meter min={0} max={maxScore} value={value} aria-label={`${String(criterion.label)} score`}>
                  {value} of {maxScore}
                </meter>
                <span>{criterion.score} / {maxScore}</span>
                {criterion.comment ? <span className={styles.comment}>{criterion.comment}</span> : null}
              </dd>
            </div>
          );
        })}
      </dl>
      {recommendation ? <p className={styles.recommendation}><strong>Recommendation:</strong> {recommendation}</p> : null}
    </article>
  );
}
