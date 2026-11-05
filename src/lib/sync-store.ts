import { useSyncExternalStore } from "react";
import { meetingRuns, mockEvents, postedEventIds, tokenState, type AuditRow, type TokenState } from "./mockData";

export const PIPELINE_STEPS = [
  "Acquire Lock",
  "Fetch Events",
  "Detect OAuth Status",
  "Filter Already Posted",
  "Post to Slack",
  "Write Audit Row",
  "Release Lock",
] as const;

export type StepStatus = "idle" | "running" | "success" | "failed" | "skipped";

export interface StoreState {
  token: TokenState;
  runs: AuditRow[];
  posted: string[];
  steps: StepStatus[];
  refreshStep: StepStatus | null; // hidden "Refresh Token" sub-step
  fetchNote: string | null;
  running: boolean;
  simulateFailure: boolean;
  alertDismissed: boolean;
  errorCounter: number;
  cursor: number;
}

const CANDIDATES = ["evt_003", "evt_001", "evt_004", "evt_002", "evt_005"];
const idle = () => PIPELINE_STEPS.map(() => "idle" as StepStatus);

let state: StoreState = {
  token: { ...tokenState },
  runs: [...meetingRuns],
  posted: [...postedEventIds],
  steps: idle(),
  refreshStep: null,
  fetchNote: null,
  running: false,
  simulateFailure: false,
  alertDismissed: false,
  errorCounter: 1,
  cursor: 0,
};

const listeners = new Set<() => void>();
const KEY = "sync-health-state";
let hydrated = false;

function set(patch: Partial<StoreState>) {
  state = { ...state, ...patch };
  if (typeof window !== "undefined") {
    const { token, runs, posted, errorCounter, cursor } = state;
    localStorage.setItem(KEY, JSON.stringify({ token, runs, posted, errorCounter, cursor }));
  }
  listeners.forEach((l) => l());
}

export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      state = { ...state, ...JSON.parse(raw) };
      listeners.forEach((l) => l());
    }
  } catch {
    /* ignore */
  }
}

export function useSyncStore() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}

export const setSimulateFailure = (v: boolean) => set({ simulateFailure: v });
export const dismissAlert = () => set({ alertDismissed: true });

export function formatTs(d: Date) {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const DELAY = 380;

export async function runSync() {
  if (state.running) return;
  const steps = idle();
  const mark = (i: number, s: StepStatus) => {
    steps[i] = s;
    set({ steps: [...steps] });
  };
  set({ running: true, steps: [...steps], refreshStep: null, fetchNote: null });

  mark(0, "running");
  await wait(DELAY);
  mark(0, "success");

  mark(1, "running");
  await wait(DELAY);
  const now = new Date();

  if (state.simulateFailure) {
    mark(1, "failed");
    set({ fetchNote: "401 Unauthorized" });
    mark(2, "running");
    set({ refreshStep: "running" });
    await wait(DELAY);
    set({ refreshStep: "failed" });
    mark(2, "failed");
    const id = `error_exec_${String(state.errorCounter).padStart(3, "0")}`;
    const row: AuditRow = {
      gcal_event_id: id,
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
      processed_at: now.toISOString().slice(0, 19) + "Z",
    };
    set({
      running: false,
      errorCounter: state.errorCounter + 1,
      runs: [row, ...state.runs],
      token: {
        consecutiveFailures: state.token.consecutiveFailures + 1,
        lastRefreshStatus: "failed",
        lastRefreshAt: now.toISOString(),
      },
    });
    return;
  }

  mark(1, "success");
  mark(2, "running");
  await wait(DELAY);
  mark(2, "success");

  const id = CANDIDATES[state.cursor % CANDIDATES.length];
  const ev = mockEvents[id];
  const already = state.posted.includes(id);

  mark(3, "running");
  await wait(DELAY);
  mark(3, already ? "skipped" : "success");

  mark(4, "running");
  await wait(DELAY);
  mark(4, already ? "skipped" : "success");

  mark(5, "running");
  await wait(DELAY);
  mark(5, "success");
  mark(6, "running");
  await wait(DELAY);
  mark(6, "success");

  const duration = Math.round((+new Date(ev.end) - +new Date(ev.start)) / 60000);
  const row: AuditRow = {
    gcal_event_id: id,
    event_summary: ev.summary,
    event_start: ev.start,
    event_end: ev.end,
    attendee_count: ev.attendees,
    duration_minutes: duration,
    slack_post_status: already ? "skipped" : "success",
    slack_message_ts: already ? null : `${Math.floor(now.getTime() / 1000)}.${String(now.getMilliseconds()).padStart(6, "0")}`,
    slack_error: already ? "Already posted (idempotency check)" : null,
    oauth_refresh_attempted: false,
    oauth_refresh_status: "success",
    oauth_error: null,
    processed_at: now.toISOString().slice(0, 19) + "Z",
  };
  set({
    running: false,
    cursor: state.cursor + 1,
    posted: already ? state.posted : [...state.posted, id],
    runs: [row, ...state.runs],
    alertDismissed: false,
    token: { consecutiveFailures: 0, lastRefreshStatus: "success", lastRefreshAt: now.toISOString() },
  });
}
