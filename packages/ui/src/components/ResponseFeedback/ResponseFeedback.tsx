import { forwardRef, type HTMLAttributes } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx, useControllableState } from '../../utils';
import { Button } from '../Button/Button';
import styles from './ResponseFeedback.module.css';

export type FeedbackValue = 'helpful' | 'unhelpful' | null;

export interface ResponseFeedbackProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: FeedbackValue;
  defaultValue?: FeedbackValue;
  onChange?: (value: FeedbackValue) => void;
  isDisabled?: boolean;
}

export const ResponseFeedback = forwardRef<HTMLDivElement, ResponseFeedbackProps>(function ResponseFeedback(
  { value: valueProp, defaultValue = null, onChange, isDisabled, className, ...rest },
  ref,
) {
  const t = useMessages();
  const [value, setValue] = useControllableState(valueProp, defaultValue, onChange);
  return (
    <div ref={ref} role="group" aria-label={t.aiFeedback} {...rest} className={cx(styles.feedback, className)}>
      <Button variant="ghost" size="sm" startIcon={<ThumbsUp />} aria-pressed={value === 'helpful'} isDisabled={isDisabled} onPress={() => setValue(value === 'helpful' ? null : 'helpful')}>
        {t.aiHelpful}
      </Button>
      <Button variant="ghost" size="sm" startIcon={<ThumbsDown />} aria-pressed={value === 'unhelpful'} isDisabled={isDisabled} onPress={() => setValue(value === 'unhelpful' ? null : 'unhelpful')}>
        {t.aiNotHelpful}
      </Button>
    </div>
  );
});
