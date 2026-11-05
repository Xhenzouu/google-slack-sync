import type { AuditRow } from "@/lib/mockData";
import { StatusPill } from "./StatusPill";

export function MeetingRunsTable({ rows, onSelect, title = "Meeting Runs" }: { rows: AuditRow[]; onSelect: (r: AuditRow) => void; title?: string }) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <h2 className="border-b border-border px-6 py-4 text-xl">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              {["Event ID", "Summary", "Duration", "Slack Status", "OAuth Status", "Processed At"].map((h) => (
                <th key={h} className="px-6 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.gcal_event_id}-${r.processed_at}-${i}`}
                onClick={() => onSelect(r)}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-accent"
              >
                <td className="px-6 py-3 font-mono text-xs">{r.gcal_event_id}</td>
                <td className="px-6 py-3">{r.event_summary ?? <span className="text-muted-foreground">—</span>}</td>
                <td className="px-6 py-3 tabular-nums">{r.duration_minutes != null ? `${r.duration_minutes} min` : "—"}</td>
                <td className="px-6 py-3"><StatusPill status={r.slack_post_status} /></td>
                <td className="px-6 py-3"><StatusPill status={r.oauth_refresh_status} /></td>
                <td className="px-6 py-3 tabular-nums text-muted-foreground">{r.processed_at.replace("T", " ").replace("Z", "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
