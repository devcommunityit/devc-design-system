import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { useMessages } from '../../i18n/LocaleProvider';
import { cx } from '../../utils';
import styles from './PricingTable.module.css';

export interface PricingPlan {
  /** Stable identifier used to match feature values and selection state. */
  id: string;
  /** Plan name. */
  name: ReactNode;
  /** Price or price presentation, supplied by the consumer. */
  price: ReactNode;
  /** Billing cadence or explanatory price text. */
  billingPeriod?: ReactNode;
  /** Short plan description. */
  description?: ReactNode;
  /** Disables the selection action for this plan. */
  disabled?: boolean;
}

export interface PricingFeature {
  /** Stable row identifier. */
  id: string;
  /** Feature name in the first column. */
  label: ReactNode;
  /** One value per plan id. Boolean values render as included/not-included indicators. */
  values: Record<string, ReactNode | boolean>;
}

export interface PricingTableProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible table caption. */
  caption: ReactNode;
  /** Plans in display order. */
  plans: PricingPlan[];
  /** Comparison rows in display order. */
  features: PricingFeature[];
  /** Controlled selected plan id. */
  selectedPlanId?: string;
  /** Called when a plan's selection button is pressed. */
  onSelectPlan?: (planId: string) => void;
  /** Visible label for each selection button. Localized by the current LocaleProvider by default. */
  selectLabel?: ReactNode;
  /** Header for the feature-name column. Localized by the current LocaleProvider by default. */
  featureColumnLabel?: ReactNode;
  /** Accessible label for boolean feature values that are true; localized by default. */
  includedLabel?: string;
  /** Accessible label for boolean feature values that are false; localized by default. */
  notIncludedLabel?: string;
}

/**
 * Semantic comparison table for pricing plans, with optional controlled plan selection.
 */
export const PricingTable = forwardRef<HTMLDivElement, PricingTableProps>(function PricingTable(
  {
    caption,
    plans,
    features,
    selectedPlanId,
    onSelectPlan,
    selectLabel,
    featureColumnLabel,
    includedLabel,
    notIncludedLabel,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessages();
  const tableId = useId();

  return (
    <div ref={ref} className={cx(styles.wrapper, className)} {...rest}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            <th className={styles.featureHeader} scope="col">
              {featureColumnLabel ?? t.pricingFeatures}
            </th>
            {plans.map((plan, index) => (
              <th className={styles.planHeader} scope="col" key={plan.id} data-selected={selectedPlanId === plan.id || undefined}>
                <span id={`${tableId}-plan-${index}`} className={styles.planName}>{plan.name}</span>
                {plan.description ? <span className={styles.description}>{plan.description}</span> : null}
                <span className={styles.price}>{plan.price}</span>
                {plan.billingPeriod ? <span className={styles.period}>{plan.billingPeriod}</span> : null}
                {onSelectPlan ? (
                  <button
                    id={`${tableId}-select-${index}`}
                    className={styles.selectButton}
                    type="button"
                    aria-labelledby={`${tableId}-select-${index} ${tableId}-plan-${index}`}
                    aria-pressed={selectedPlanId === plan.id}
                    disabled={plan.disabled}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {selectLabel ?? t.pricingSelectPlan}
                  </button>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id}>
              <th className={styles.featureName} scope="row">
                {feature.label}
              </th>
              {plans.map((plan) => {
                const value = feature.values[plan.id];
                return (
                  <td className={styles.value} key={plan.id}>
                    {typeof value === 'boolean' ? (
                      <span
                        className={styles.boolean}
                        role="img"
                        aria-label={value ? (includedLabel ?? t.pricingIncluded) : (notIncludedLabel ?? t.pricingNotIncluded)}
                        data-included={value}
                      >
                        {value ? '✓' : '—'}
                      </span>
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
