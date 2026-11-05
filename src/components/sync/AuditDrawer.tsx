import { useEffect } from "react";
import { X } from "lucide-react";
import type { AuditRow } from "@/lib/mockData";
import { StatusPill } from "./StatusPill";
import { cn } from "@/lib/utils";

export function AuditDrawer({ row, onClose }: { row: AuditRow | null; onClose: () => void }) {
  const open = !!row;
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const fields: [string, string][] = row
    ? [
        ["Event Summary", row.event_summary ?? "—"],
        ["Start Time", row.event_start?.replace("T", " ") ?? "—"],
        ["End Time", row.event_end?.replace("T", " ") ?? "—"],
        ["Attendee Count", row.attendee_count?.toString() ?? "—"],
        ["Duration", row.duration_minutes != null ? `${row.duration_minutes} min` : "—"],
      ]
    : [];

  return (
    <>
      <div
        onClick={onClose}
        className={cn("fixed inset-0 z-40 bg-backdrop transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[450px] max-w-full flex-col overflow-y-auto border-l border-border bg-card transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {row && (
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Audit Details</p>
                <h2 className="mt-1 break-all text-2xl">{row.gcal_event_id}</h2>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">Slack <StatusPill status={row.slack_post_status} /></span>
              <span className="flex items-center gap-2">OAuth <StatusPill status={row.oauth_refresh_status} /></span>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {fields.map(([k, v]) => (
                <div key={k} className="rounded-md border border-border p-3">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-1 font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="mb-2 text-base">Raw Audit Row</h3>
              <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 font-mono text-xs leading-relaxed">
                {JSON.stringify(row, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
