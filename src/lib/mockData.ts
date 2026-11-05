export type SlackStatus = "success" | "failed" | "skipped";
export type OAuthStatus = "success" | "failed" | "not_attempted";

export interface AuditRow {
  gcal_event_id: string;
  event_summary: string | null;
  event_start: string | null;
  event_end: string | null;
  attendee_count: number | null;
  duration_minutes: number | null;
  slack_post_status: SlackStatus;
  slack_message_ts: string | null;
  slack_error: string | null;
  oauth_refresh_attempted: boolean;
  oauth_refresh_status: OAuthStatus;
  oauth_error: string | null;
  processed_at: string;
}

export interface TokenState {
  consecutiveFailures: number;
  lastRefreshStatus: "success" | "failed";
  lastRefreshAt: string;
}

export const tokenState: TokenState = {
  consecutiveFailures: 0,
  lastRefreshStatus: "success",
  lastRefreshAt: "2026-10-11 02:53:32Z",
};

export const postedEventIds = ["evt_001", "evt_002"];

export const mockEvents: Record<string, { summary: string; start: string; end: string; attendees: number }> = {
  evt_001: { summary: "Weekly Product Sync", start: "2026-10-11T01:00:00Z", end: "2026-10-11T01:45:00Z", attendees: 8 },
  evt_002: { summary: "Customer Onboarding: Acme", start: "2026-10-11T02:00:00Z", end: "2026-10-11T02:30:00Z", attendees: 4 },
  evt_003: { summary: "Design Review", start: "2026-10-11T03:00:00Z", end: "2026-10-11T04:00:00Z", attendees: 6 },
  evt_004: { summary: "Sales Pipeline Standup", start: "2026-10-11T05:00:00Z", end: "2026-10-11T05:15:00Z", attendees: 5 },
  evt_005: { summary: "Engineering Retro", start: "2026-10-11T06:00:00Z", end: "2026-10-11T07:00:00Z", attendees: 11 },
};

export const meetingRuns: AuditRow[] = [
  {
    gcal_event_id: "evt_001",
    event_summary: "Weekly Product Sync",
    event_start: "2026-10-11T01:00:00Z",
    event_end: "2026-10-11T01:45:00Z",
    attendee_count: 8,
    duration_minutes: 45,
    slack_post_status: "success",
    slack_message_ts: "1791687212.004211",
    slack_error: null,
    oauth_refresh_attempted: false,
    oauth_refresh_status: "success",
    oauth_error: null,
    processed_at: "2026-10-11T02:46:10Z",
  },
  {
    gcal_event_id: "evt_002",
    event_summary: "Customer Onboarding: Acme",
    event_start: "2026-10-11T02:00:00Z",
    event_end: "2026-10-11T02:30:00Z",
    attendee_count: 4,
    duration_minutes: 30,
    slack_post_status: "skipped",
    slack_message_ts: null,
    slack_error: "Already posted (idempotency check)",
    oauth_refresh_attempted: false,
    oauth_refresh_status: "success",
    oauth_error: null,
    processed_at: "2026-10-11T02:50:02Z",
  },
  {
    gcal_event_id: "error_exec_000",
    event_summary: null,
    event_start: null,
    event_end: null,
    attendee_count: null,
    duration_minutes: null,
    slack_post_status: "failed",
    slack_message_ts: null,
    slack_error: "Pipeline halted before Slack post",
    oauth_refresh_attempted: true,
    oauth_refresh_status: "failed",
    oauth_error: "401 Unauthorized",
    processed_at: "2026-10-11T02:53:32Z",
  },
];
