import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';
import { useLocale } from '../../i18n/LocaleProvider';
import { Progress } from '../Progress/Progress';
import { cx } from '../../utils';
import styles from './XpProgress.module.css';

export interface XpProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible and visible name of the XP goal. */
  label: ReactNode;
  /** Current XP value. */
  currentXp: number;
  /** XP required for the next level. */
  targetXp: number;
  /** Optional current level shown alongside the progress. */
  level?: number;
  /** Localizable label for the level value. @default 'Level' */
  levelLabel?: ReactNode;
  /** Optional context such as the next level name. */
  description?: ReactNode;
}

/** Level progress display composed from the existing linear Progress component. */
export const XpProgress = forwardRef<HTMLDivElement, XpProgressProps>(function XpProgress(
  { label, currentXp, targetXp, level, levelLabel = 'Level', description, className, ...rest },
  ref,
) {
  const { locale } = useLocale();
  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const max = Number.isFinite(targetXp) && targetXp > 0 ? targetXp : 1;
  const value = Number.isFinite(currentXp) ? Math.min(max, Math.max(0, currentXp)) : 0;
  const currentText = formatter.format(Number.isFinite(currentXp) ? Math.max(0, currentXp) : 0);
  const targetText = formatter.format(max);

  return (
    <div ref={ref} className={cx(styles.progress, className)} {...rest}>
      {level !== undefined ? (
        <p className={styles.level}>{levelLabel} {formatter.format(Math.max(0, Number.isFinite(level) ? level : 0))}</p>
      ) : null}
      <Progress
        label={label}
        minValue={0}
        maxValue={max}
        value={value}
        valueLabel={`${currentText} / ${targetText} XP`}
        aria-valuetext={`${currentText} of ${targetText} XP`}
      />
      {description ? <div className={styles.description}>{description}</div> : null}
    </div>
  );
});
