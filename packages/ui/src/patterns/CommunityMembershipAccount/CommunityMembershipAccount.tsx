import { useId, type ReactNode } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Progress } from '../../components/Progress/Progress';
import { Radio, RadioGroup } from '../../components/RadioGroup/RadioGroup';
import { Switch } from '../../components/Switch/Switch';
import { TextField } from '../../components/TextField/TextField';
import { Link } from '../../components/Typography/Typography';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from '../../components/Table/Table';
import { cx } from '../../utils';
import styles from './CommunityMembershipAccount.module.css';

export type MembershipBillingCadence = 'monthly' | 'annual';
export type MembershipCouponStatus = 'applied' | 'invalid' | 'expired' | 'not-applied';
export type MembershipSubscriptionStatus = 'active' | 'trialing' | 'past-due' | 'paused' | 'cancelled' | 'pending';
export type MembershipInvoiceStatus = 'paid' | 'open' | 'past-due' | 'void' | 'refunded';

export interface MembershipPlanOption {
  amount: string;
  intervalLabel: string;
  savingsLabel?: string;
}

export interface MembershipAccountDetails {
  name: string;
  email: string;
  membershipNumber: string;
  tier: string;
  memberSince: string;
  expiresAt?: string;
}

export interface MembershipOrderSummary {
  subtotal: string;
  total: string;
  discount?: { label: string; amount: string };
  coupon?: { code: string; status: MembershipCouponStatus; message?: string };
}

export interface MembershipCouponInput {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  label?: ReactNode;
  applyLabel?: ReactNode;
  isPending?: boolean;
}

export interface MembershipPaymentMethod {
  id: string;
  label: string;
  brand: string;
  lastFour: string;
  expires: string;
  isDefault?: boolean;
}

export interface MembershipUsage {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

export interface MembershipSubscription {
  status: MembershipSubscriptionStatus;
  nextBillingDate?: string;
  usage?: MembershipUsage;
}

export interface MembershipInvoice {
  id: string;
  issuedAt: string;
  total: string;
  status: MembershipInvoiceStatus;
  href?: string;
}

export interface MembershipCommunicationPreference {
  id: string;
  label: string;
  description?: string;
  isSelected: boolean;
}

export interface MembershipCookiePreference {
  id: string;
  label: string;
  isEnabled: boolean;
  isRequired?: boolean;
  description?: string;
}

export interface CommunityMembershipAccountProps {
  member: MembershipAccountDetails;
  plans: Record<MembershipBillingCadence, MembershipPlanOption>;
  billingCadence: MembershipBillingCadence;
  onBillingCadenceChange: (cadence: MembershipBillingCadence) => void;
  orderSummary: MembershipOrderSummary;
  couponInput?: MembershipCouponInput;
  paymentMethods: MembershipPaymentMethod[];
  selectedPaymentMethodId?: string;
  onPaymentMethodChange: (id: string) => void;
  subscription: MembershipSubscription;
  invoices: MembershipInvoice[];
  communicationPreferences: MembershipCommunicationPreference[];
  onCommunicationPreferenceChange: (id: string, isSelected: boolean) => void;
  cookiePreferences: MembershipCookiePreference[];
  onRequestDataExport?: () => void;
  onRequestDeletion?: () => void;
  className?: string;
}

const subscriptionStatus: Record<MembershipSubscriptionStatus, { label: string; tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }> = {
  active: { label: 'Active', tone: 'success' },
  trialing: { label: 'Trial', tone: 'info' },
  'past-due': { label: 'Payment overdue', tone: 'danger' },
  paused: { label: 'Paused', tone: 'warning' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  pending: { label: 'Pending', tone: 'info' },
};

const invoiceStatus: Record<MembershipInvoiceStatus, { label: string; tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }> = {
  paid: { label: 'Paid', tone: 'success' },
  open: { label: 'Open', tone: 'info' },
  'past-due': { label: 'Past due', tone: 'danger' },
  void: { label: 'Void', tone: 'neutral' },
  refunded: { label: 'Refunded', tone: 'warning' },
};

const couponStatus: Record<MembershipCouponStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  applied: { label: 'Applied', tone: 'success' },
  invalid: { label: 'Invalid', tone: 'danger' },
  expired: { label: 'Expired', tone: 'warning' },
  'not-applied': { label: 'Not applied', tone: 'neutral' },
};

function formatUsage(usage: MembershipUsage) {
  return `${usage.used} / ${usage.limit}${usage.unit ? ` ${usage.unit}` : ''}`;
}

/**
 * UI-only membership overview. State and request handling remain controlled by the consumer;
 * this component never processes payments or reports that a data request has completed.
 */
export function CommunityMembershipAccount({
  member,
  plans,
  billingCadence,
  onBillingCadenceChange,
  orderSummary,
  couponInput,
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodChange,
  subscription,
  invoices,
  communicationPreferences,
  onCommunicationPreferenceChange,
  cookiePreferences,
  onRequestDataExport,
  onRequestDeletion,
  className,
}: CommunityMembershipAccountProps) {
  const instanceId = useId();
  const selectedPlan = plans[billingCadence];
  const selectedSubscriptionStatus = subscriptionStatus[subscription.status];
  const usage = subscription.usage;
  const progressMax = usage ? Math.max(usage.limit, 1) : 1;
  const progressValue = usage ? Math.min(Math.max(usage.used, 0), progressMax) : 0;
  const coupon = orderSummary.coupon;

  return (
    <div className={cx(styles.root, className)}>
      <section className={styles.membershipSection} aria-labelledby={`${instanceId}-membership-account-title`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Your community account</p>
            <h2 className={styles.heading} id={`${instanceId}-membership-account-title`}>Membership</h2>
          </div>
          <Badge tone={selectedSubscriptionStatus.tone}>{selectedSubscriptionStatus.label}</Badge>
        </div>

        <article className={styles.memberCard} aria-label="Digital membership card">
          <div className={styles.cardTop}>
            <span className={styles.cardBrand}>DEV COMMUNITY</span>
            <Badge tone="brand" variant="solid">{member.tier}</Badge>
          </div>
          <div className={styles.cardIdentity}>
            <h3>{member.name}</h3>
            <p>{member.email}</p>
          </div>
          <dl className={styles.cardDetails}>
            <div>
              <dt>Membership number</dt>
              <dd>{member.membershipNumber}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd><time dateTime={member.memberSince}>{member.memberSince}</time></dd>
            </div>
            {member.expiresAt ? (
              <div>
                <dt>Valid through</dt>
                <dd><time dateTime={member.expiresAt}>{member.expiresAt}</time></dd>
              </div>
            ) : null}
          </dl>
        </article>
      </section>

      <section className={styles.panel} aria-labelledby={`${instanceId}-subscription-title`}>
        <div className={styles.sectionHeading}>
          <div>
            <h2 className={styles.heading} id={`${instanceId}-subscription-title`}>Subscription</h2>
            {subscription.nextBillingDate ? (
              <p className={styles.muted}>Next billing date: <time dateTime={subscription.nextBillingDate}>{subscription.nextBillingDate}</time></p>
            ) : null}
          </div>
        </div>
        <RadioGroup
          label="Billing frequency"
          value={billingCadence}
          onChange={(value) => {
            if (value === 'monthly' || value === 'annual') onBillingCadenceChange(value);
          }}
          orientation="horizontal"
          className={styles.cadenceGroup}
        >
          {(['monthly', 'annual'] as const).map((cadence) => {
            const plan = plans[cadence];
            return (
              <Radio className={styles.cadenceRadio} value={cadence} key={cadence}>
                <span className={styles.cadenceOption}>
                  <span className={styles.cadenceName}>{cadence === 'monthly' ? 'Monthly' : 'Annual'}</span>
                  <span className={styles.cadencePrice}>{plan.amount}</span>
                  <span className={styles.muted}>{plan.intervalLabel}</span>
                  {plan.savingsLabel ? <span className={styles.savings}>{plan.savingsLabel}</span> : null}
                </span>
              </Radio>
            );
          })}
        </RadioGroup>
        <div className={styles.subscriptionInfo}>
          <span>Selected billing option</span>
          <strong>{selectedPlan.amount} {selectedPlan.intervalLabel}</strong>
        </div>
        {usage ? (
          <div className={styles.usage}>
            <div className={styles.usageLabel}>
              <span>{usage.label}</span>
              <strong>{formatUsage(usage)}</strong>
            </div>
            <Progress
              label={usage.label}
              value={progressValue}
              maxValue={progressMax}
              valueLabel={formatUsage(usage)}
              showValue={false}
            />
          </div>
        ) : null}
      </section>

      <section className={styles.panel} aria-labelledby={`${instanceId}-order-summary-title`}>
        <h2 className={styles.heading} id={`${instanceId}-order-summary-title`}>Order summary</h2>
        <dl className={styles.summaryList}>
          <div><dt>Subtotal</dt><dd>{orderSummary.subtotal}</dd></div>
          {orderSummary.discount ? (
            <div><dt>{orderSummary.discount.label}</dt><dd>{orderSummary.discount.amount}</dd></div>
          ) : null}
          <div className={styles.total}><dt>Total</dt><dd>{orderSummary.total}</dd></div>
        </dl>
        {couponInput ? (
          <div className={styles.couponInput}>
            <TextField
              label={couponInput.label ?? 'Coupon code'}
              value={couponInput.value}
              onChange={couponInput.onChange}
              autoComplete="off"
            />
            <Button
              variant="secondary"
              onPress={couponInput.onApply}
              isDisabled={!couponInput.value.trim()}
              isPending={couponInput.isPending}
            >
              {couponInput.applyLabel ?? 'Apply coupon'}
            </Button>
          </div>
        ) : null}
        {coupon ? (
          <div className={styles.coupon}>
            <div className={styles.couponTop}>
              <strong>Coupon <code>{coupon.code}</code></strong>
              <Badge tone={couponStatus[coupon.status].tone}>{couponStatus[coupon.status].label}</Badge>
            </div>
            {coupon.message ? <p className={styles.muted}>{coupon.message}</p> : null}
          </div>
        ) : null}
      </section>

      <section className={styles.panel} aria-labelledby={`${instanceId}-payment-title`}>
        <h2 className={styles.heading} id={`${instanceId}-payment-title`}>Payment method</h2>
        {paymentMethods.length > 0 ? (
          <RadioGroup
            aria-label="Choose a payment method"
            value={selectedPaymentMethodId ?? ''}
            onChange={onPaymentMethodChange}
            className={styles.paymentMethods}
          >
            {paymentMethods.map((method) => (
              <Radio
                className={styles.paymentMethod}
                key={method.id}
                value={method.id}
                description={`${method.brand} · Expires ${method.expires}`}
              >
                <span className={styles.paymentCopy}>
                  <strong>{method.label} ···· {method.lastFour}</strong>
                  {method.isDefault ? <Badge size="sm">Default</Badge> : null}
                </span>
              </Radio>
            ))}
          </RadioGroup>
        ) : <p className={styles.muted}>No payment methods are available.</p>}
      </section>

      <section className={styles.panel} aria-labelledby={`${instanceId}-invoices-title`}>
        <h2 className={styles.heading} id={`${instanceId}-invoices-title`}>Billing history</h2>
        {invoices.length > 0 ? (
          <Table className={styles.invoiceTable} scrollRegionLabel="Membership invoices">
            <TableCaption>Membership invoices and billing status</TableCaption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Invoice</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell align="end">Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableHeaderCell scope="row">
                      {invoice.href ? <Link href={invoice.href} variant="standalone">{invoice.id}</Link> : invoice.id}
                    </TableHeaderCell>
                    <TableCell><time dateTime={invoice.issuedAt}>{invoice.issuedAt}</time></TableCell>
                    <TableCell numeric>{invoice.total}</TableCell>
                    <TableCell><Badge size="sm" tone={invoiceStatus[invoice.status].tone}>{invoiceStatus[invoice.status].label}</Badge></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : <p className={styles.muted}>No billing history yet.</p>}
      </section>

      <section className={styles.panel} aria-labelledby={`${instanceId}-communication-title`}>
        <h2 className={styles.heading} id={`${instanceId}-communication-title`}>Communication preferences</h2>
        <div className={styles.preferenceList}>
          {communicationPreferences.map((preference) => (
            <Switch
              key={preference.id}
              isSelected={preference.isSelected}
              onChange={(isSelected) => onCommunicationPreferenceChange(preference.id, isSelected)}
              description={preference.description}
              labelPosition="start"
            >
              {preference.label}
            </Switch>
          ))}
          {communicationPreferences.length === 0 ? <p className={styles.muted}>No optional communication preferences.</p> : null}
        </div>
      </section>

      <section className={styles.panel} aria-labelledby={`${instanceId}-cookies-title`}>
        <h2 className={styles.heading} id={`${instanceId}-cookies-title`}>Cookie preferences</h2>
        <p className={styles.muted}>Preference summary only. Manage cookie choices in your browser or privacy settings.</p>
        <ul className={styles.cookieList}>
          {cookiePreferences.map((preference) => (
            <li key={preference.id}>
              <div>
                <strong>{preference.label}{preference.isRequired ? ' (required)' : ''}</strong>
                {preference.description ? <span>{preference.description}</span> : null}
              </div>
              <Badge tone={preference.isEnabled ? 'success' : 'neutral'}>{preference.isEnabled ? 'Enabled' : 'Disabled'}</Badge>
            </li>
          ))}
          {cookiePreferences.length === 0 ? <li className={styles.muted}>No cookie preferences provided.</li> : null}
        </ul>
      </section>

      {(onRequestDataExport || onRequestDeletion) ? (
        <section className={styles.panel} aria-labelledby={`${instanceId}-data-requests-title`}>
          <h2 className={styles.heading} id={`${instanceId}-data-requests-title`}>Your data</h2>
          <p className={styles.muted}>These controls call the handlers provided by your application. This view does not submit or confirm a request.</p>
          <div className={styles.actions}>
            {onRequestDataExport ? <Button variant="outline" onPress={onRequestDataExport}>Request data export</Button> : null}
            {onRequestDeletion ? <Button variant="danger" onPress={onRequestDeletion}>Request account deletion</Button> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
