import { ArrowDownToLine, Check, Clock3, Eye, Mail, MessageSquareWarning, Plug, Users } from 'lucide-react';
import { useId } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Card, CardBody, CardHeader } from '../../components/Card/Card';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { KpiCard } from '../../components/KpiCard/KpiCard';
import { NativeSelect } from '../../components/NativeSelect/NativeSelect';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from '../../components/Table/Table';
import { Timeline, TimelineItem } from '../../components/Timeline/Timeline';
import { cx } from '../../utils';
import styles from './CommunityOrganizerOperations.module.css';

export type AttendeeStatus = 'registered' | 'checked-in' | 'no-show';

export interface OrganizerAttendee {
  id: string;
  name: string;
  email: string;
  ticket: string;
  status: AttendeeStatus;
}

export interface CsvImportPreview {
  fileName: string;
  rowCount: number;
  columns: string[];
  rows: Array<Record<string, string>>;
  mapping: Record<string, string>;
  targetFields: Array<{ key: string; label: string }>;
}

export interface OrganizerAuditEvent {
  id: string;
  title: string;
  actor: string;
  dateTime: string;
  timeLabel: string;
  details?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}

export interface OrganizerModerationReport {
  id: string;
  reporter: string;
  subject: string;
  reason: string;
  submittedAt: string;
  status: 'new' | 'under-review';
}

export interface MailingAudienceSegment {
  id: string;
  label: string;
  description: string;
  count: number;
  selected: boolean;
}

export interface OrganizerCampaign {
  subject: string;
  preheader: string;
  body: string;
  recipients: number;
  sent: number;
  opens: number;
  clicks: number;
  bounces: number;
}

export interface OrganizerIntegration {
  id: string;
  name: string;
  type: 'connection' | 'webhook' | 'api';
  status: 'connected' | 'attention' | 'disconnected';
  description: string;
  detail?: string;
}

export interface OrganizerMetric {
  label: string;
  value: number | string;
  change?: string;
  formatOptions?: Intl.NumberFormatOptions;
}

export interface CommunityOrganizerOperationsProps {
  communityName: string;
  eventTitle: string;
  attendees?: OrganizerAttendee[];
  csvPreview?: CsvImportPreview;
  auditEvents?: OrganizerAuditEvent[];
  reports?: OrganizerModerationReport[];
  audienceSegments?: MailingAudienceSegment[];
  campaign?: OrganizerCampaign;
  integrations?: OrganizerIntegration[];
  communityMetrics?: OrganizerMetric[];
  eventMetrics?: OrganizerMetric[];
  attendanceBreakdown?: Array<{ label: string; value: number }>;
  onCheckIn?: (attendeeId: string) => void;
  onMarkNoShow?: (attendeeId: string) => void;
  onCsvMappingChange?: (targetField: string, sourceColumn: string) => void;
  onImportCsv?: () => void;
  onReviewReport?: (reportId: string) => void;
  onDismissReport?: (reportId: string) => void;
  onAudienceSegmentChange?: (segmentId: string, selected: boolean) => void;
  onPreviewCampaign?: () => void;
  onManageIntegration?: (integrationId: string) => void;
  className?: string;
}

const statusDetails: Record<AttendeeStatus, { label: string; tone: 'neutral' | 'success' | 'danger' }> = {
  registered: { label: 'Registered', tone: 'neutral' },
  'checked-in': { label: 'Checked in', tone: 'success' },
  'no-show': { label: 'No-show', tone: 'danger' },
};

const integrationStatus: Record<OrganizerIntegration['status'], { label: string; tone: 'success' | 'warning' | 'neutral' }> = {
  connected: { label: 'Connected', tone: 'success' },
  attention: { label: 'Needs attention', tone: 'warning' },
  disconnected: { label: 'Disconnected', tone: 'neutral' },
};

const integrationTypeLabel: Record<OrganizerIntegration['type'], string> = {
  connection: 'Connection',
  webhook: 'Webhook',
  api: 'API',
};

function formatMetric(metric: OrganizerMetric) {
  if (typeof metric.value !== 'number') return metric.value;
  return new Intl.NumberFormat(undefined, metric.formatOptions).format(metric.value);
}

function MetricCards({ metrics }: { metrics: OrganizerMetric[] }) {
  if (metrics.length === 0) return <p className={styles.muted}>No metrics available yet.</p>;
  return (
    <div className={styles.metricGrid}>
      {metrics.map((metric, index) => (
        <KpiCard
          key={`${metric.label}-${index}`}
          label={metric.label}
          value={formatMetric(metric)}
          description={metric.change}
          variant={index === 0 ? 'tinted' : 'default'}
        />
      ))}
    </div>
  );
}

/**
 * UI-only console for community and event operations. All records and actions are supplied by the
 * host application; this pattern does not persist CSV data or perform backend, email, or API work.
 */
export function CommunityOrganizerOperations({
  communityName,
  eventTitle,
  attendees = [],
  csvPreview,
  auditEvents = [],
  reports = [],
  audienceSegments = [],
  campaign,
  integrations = [],
  communityMetrics = [],
  eventMetrics = [],
  attendanceBreakdown = [],
  onCheckIn,
  onMarkNoShow,
  onCsvMappingChange,
  onImportCsv,
  onReviewReport,
  onDismissReport,
  onAudienceSegmentChange,
  onPreviewCampaign,
  onManageIntegration,
  className,
}: CommunityOrganizerOperationsProps) {
  const headingId = `organizer-title-${useId().replace(/:/g, '')}`;
  const checkedInCount = attendees.filter((attendee) => attendee.status === 'checked-in').length;
  const reportCount = reports.length;

  return (
    <main className={cx(styles.console, className)} aria-labelledby={headingId}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>{communityName}</p>
          <h1 id={headingId}>Organizer operations</h1>
          <p className={styles.pageDescription}>{eventTitle}</p>
        </div>
        <div className={styles.headerBadges}>
          <Badge tone="brand" dot>Organizer console</Badge>
          <Badge tone={reportCount ? 'warning' : 'success'}>{reportCount} reports in queue</Badge>
        </div>
      </header>

      <section className={styles.overview} aria-label="Community overview">
        <MetricCards metrics={communityMetrics} />
      </section>

      <div className={styles.primaryGrid}>
        <Card as="section" padding="md">
          <CardHeader title="Attendees & check-in" subtitle={`${attendees.length} attendees`} headingLevel={2} />
          <CardBody>
            <div className={styles.inlineSummary}>
              <Badge tone="success" icon={<Check />}>{checkedInCount} checked in</Badge>
              <span className={styles.muted}>Check-in and no-show status are managed by your application.</span>
            </div>
            {attendees.length ? (
              <Table className={styles.dataTable} scrollRegionLabel="Attendee check-in table" density="compact">
                <TableCaption>Attendee check-in status for {eventTitle}</TableCaption>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Attendee</TableHeaderCell>
                    <TableHeaderCell>Ticket</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableHeaderCell scope="row">
                        <span className={styles.attendeeName}>{attendee.name}</span>
                        <span className={styles.secondaryText}>{attendee.email}</span>
                      </TableHeaderCell>
                      <TableCell>{attendee.ticket}</TableCell>
                      <TableCell>
                        <Badge tone={statusDetails[attendee.status].tone}>{statusDetails[attendee.status].label}</Badge>
                      </TableCell>
                      <TableCell>
                        {attendee.status === 'registered' ? (
                          <div className={styles.actionGroup}>
                            {onCheckIn ? <Button size="sm" onPress={() => onCheckIn(attendee.id)}>Check in</Button> : null}
                            {onMarkNoShow ? <Button size="sm" variant="ghost" onPress={() => onMarkNoShow(attendee.id)}>No-show</Button> : null}
                          </div>
                        ) : <span className={styles.muted}>—</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <p className={styles.emptyState}>Attendee records will appear here when provided.</p>}
          </CardBody>
        </Card>

        <Card as="section" padding="md">
          <CardHeader title="Moderation queue" subtitle={`${reports.length} reports to review`} media={<MessageSquareWarning />} headingLevel={2} />
          <CardBody>
            {reports.length ? (
              <ul className={styles.reportList}>
                {reports.map((report) => (
                  <li key={report.id} className={styles.reportItem}>
                    <div className={styles.reportTopline}>
                      <Badge tone={report.status === 'new' ? 'danger' : 'warning'}>{report.status === 'new' ? 'New' : 'Under review'}</Badge>
                      <time dateTime={report.submittedAt}>{report.submittedAt}</time>
                    </div>
                    <h3>{report.subject}</h3>
                    <p>{report.reason}</p>
                    <p className={styles.secondaryText}>Reported by {report.reporter}</p>
                    {(onReviewReport || onDismissReport) ? (
                      <div className={styles.actionGroup}>
                        {onReviewReport ? <Button size="sm" variant="outline" onPress={() => onReviewReport(report.id)}>Review</Button> : null}
                        {onDismissReport ? <Button size="sm" variant="ghost" onPress={() => onDismissReport(report.id)}>Dismiss</Button> : null}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : <p className={styles.emptyState}>No reports awaiting review.</p>}
          </CardBody>
        </Card>
      </div>

      <div className={styles.secondaryGrid}>
        <Card as="section" padding="md">
          <CardHeader title="CSV import preview" subtitle={csvPreview ? csvPreview.fileName : 'Map columns before importing'} media={<ArrowDownToLine />} headingLevel={2} />
          <CardBody>
            {csvPreview ? (
              <>
                <div className={styles.mappingGrid}>
                  {csvPreview.targetFields.map((field) => (
                    <NativeSelect
                      key={field.key}
                      label={`${field.label} column`}
                      placeholder="Choose a column"
                      value={csvPreview.mapping[field.key] ?? ''}
                      options={csvPreview.columns.map((column) => ({ value: column, label: column }))}
                      onChange={(event) => onCsvMappingChange?.(field.key, event.target.value)}
                      isDisabled={!onCsvMappingChange}
                    />
                  ))}
                </div>
                <div className={styles.previewMeta}>
                  <span>{csvPreview.rowCount} rows detected</span>
                  <span>{csvPreview.rows.length} row preview</span>
                </div>
                {csvPreview.rows.length > 0 ? (
                  <Table className={styles.dataTable} scrollRegionLabel="CSV preview table" density="compact">
                    <TableCaption>Preview of {csvPreview.fileName}; data is not saved by this component</TableCaption>
                    <TableHead><TableRow>{csvPreview.columns.map((column) => <TableHeaderCell key={column}>{column}</TableHeaderCell>)}</TableRow></TableHead>
                    <TableBody>
                      {csvPreview.rows.map((row, index) => (
                        <TableRow key={`preview-${index}`}>
                          {csvPreview.columns.map((column) => <TableCell key={column}>{row[column] || '—'}</TableCell>)}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : <p className={styles.emptyState}>No preview rows supplied.</p>}
                {onImportCsv ? <Button className={styles.importButton} onPress={onImportCsv}>Continue with import</Button> : null}
                <p className={styles.disclaimer}>Import processing and persistence are handled by your application.</p>
              </>
            ) : <p className={styles.emptyState}>Provide a parsed preview to review columns and mappings.</p>}
          </CardBody>
        </Card>

        <Card as="section" padding="md">
          <CardHeader title="Mailing audience" subtitle="Select an audience segment" media={<Users />} headingLevel={2} />
          <CardBody>
            {audienceSegments.length ? (
              <ul className={styles.segmentList}>
                {audienceSegments.map((segment) => (
                  <li key={segment.id}>
                    <Checkbox
                      className={styles.segment}
                      isSelected={segment.selected}
                      onChange={(selected) => onAudienceSegmentChange?.(segment.id, selected)}
                      isDisabled={!onAudienceSegmentChange}
                    >
                      <span className={styles.segmentCopy}>
                        <span className={styles.segmentTitle}>{segment.label}<Badge size="sm">{segment.count.toLocaleString()}</Badge></span>
                        <span className={styles.secondaryText}>{segment.description}</span>
                      </span>
                    </Checkbox>
                  </li>
                ))}
              </ul>
            ) : <p className={styles.emptyState}>Audience segments will be shown when supplied.</p>}
          </CardBody>
        </Card>

        <Card as="section" padding="md">
          <CardHeader title="Email campaign" subtitle={campaign ? 'Preview and delivery statistics' : 'No campaign selected'} media={<Mail />} headingLevel={2} />
          <CardBody>
            {campaign ? (
              <>
                <div className={styles.emailPreview}>
                  <p className={styles.emailLabel}>Subject</p>
                  <p className={styles.emailSubject}>{campaign.subject}</p>
                  <p className={styles.preheader}>{campaign.preheader}</p>
                  <div className={styles.emailBody}>{campaign.body}</div>
                </div>
                <dl className={styles.campaignStats}>
                  <div><dt>Recipients</dt><dd>{campaign.recipients.toLocaleString()}</dd></div>
                  <div><dt>Sent</dt><dd>{campaign.sent.toLocaleString()}</dd></div>
                  <div><dt>Opens</dt><dd>{campaign.opens.toLocaleString()}</dd></div>
                  <div><dt>Clicks</dt><dd>{campaign.clicks.toLocaleString()}</dd></div>
                  <div><dt>Bounces</dt><dd>{campaign.bounces.toLocaleString()}</dd></div>
                </dl>
                {onPreviewCampaign ? <Button variant="outline" startIcon={<Eye />} onPress={onPreviewCampaign}>Open campaign preview</Button> : null}
                <p className={styles.disclaimer}>This console does not send email.</p>
              </>
            ) : <p className={styles.emptyState}>Campaign preview and stats appear here when provided.</p>}
          </CardBody>
        </Card>
      </div>

      <Card as="section" padding="md">
        <CardHeader title="Connections & integrations" subtitle="Connection health and endpoint references" media={<Plug />} headingLevel={2} />
        <CardBody>
          {integrations.length ? (
            <ul className={styles.integrationGrid}>
              {integrations.map((integration) => {
                const state = integrationStatus[integration.status];
                return (
                  <li key={integration.id} className={styles.integrationCard}>
                    <div className={styles.integrationTitle}>
                      <h3>{integration.name}</h3>
                      <Badge tone={state.tone} dot>{state.label}</Badge>
                    </div>
                    <p className={styles.integrationType}>{integrationTypeLabel[integration.type]}</p>
                    <p>{integration.description}</p>
                    {integration.detail ? <code className={styles.endpoint}>{integration.detail}</code> : null}
                    {onManageIntegration ? <Button size="sm" variant="outline" onPress={() => onManageIntegration(integration.id)}>Manage</Button> : null}
                  </li>
                );
              })}
            </ul>
          ) : <p className={styles.emptyState}>No integration cards supplied.</p>}
          <p className={styles.disclaimer}>Status and configuration are display-only; connections, webhooks, and API calls are managed externally.</p>
        </CardBody>
      </Card>

      <div className={styles.secondaryGrid}>
        <Card as="section" padding="md">
          <CardHeader title="Event analytics" subtitle={eventTitle} media={<Clock3 />} headingLevel={2} />
          <CardBody>
            <MetricCards metrics={eventMetrics} />
            {attendanceBreakdown.length ? (
              <div className={styles.breakdown} role="img" aria-label={`Attendance breakdown: ${attendanceBreakdown.map((item) => `${item.label} ${item.value}`).join(', ')}`}>
                <h3>Attendance breakdown</h3>
                {attendanceBreakdown.map((item) => {
                  const total = attendanceBreakdown.reduce((sum, entry) => sum + entry.value, 0);
                  const percent = total > 0 ? Math.min(100, Math.max(0, item.value / total * 100)) : 0;
                  return (
                    <div className={styles.breakdownRow} key={item.label}>
                      <span>{item.label}</span>
                      <span className={styles.breakdownTrack} aria-hidden="true">
                        <span className={styles.breakdownBar} style={{ inlineSize: `${percent}%` }} />
                      </span>
                      <strong>{item.value.toLocaleString()}</strong>
                    </div>
                  );
                })}
              </div>
            ) : <p className={styles.emptyState}>Attendance analytics will appear when supplied.</p>}
          </CardBody>
        </Card>

        <Card as="section" padding="md">
          <CardHeader title="Audit timeline" subtitle="Recent organizer activity" media={<Clock3 />} headingLevel={2} />
          <CardBody>
            {auditEvents.length ? (
              <Timeline aria-label="Organizer audit timeline">
                {auditEvents.map((event) => (
                  <TimelineItem
                    key={event.id}
                    title={<>{event.title}<span className={styles.auditActor}> · {event.actor}</span></>}
                    time={event.timeLabel}
                    dateTime={event.dateTime}
                    tone={event.tone}
                  >
                    {event.details ? <p className={styles.auditDetails}>{event.details}</p> : null}
                  </TimelineItem>
                ))}
              </Timeline>
            ) : <p className={styles.emptyState}>Audit events will appear here when supplied.</p>}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
