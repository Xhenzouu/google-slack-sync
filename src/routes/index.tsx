import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { AppShell } from "@/components/sync/AppShell";
import { TokenHealthCard } from "@/components/sync/TokenHealthCard";
import { PipelineTrace } from "@/components/sync/PipelineTrace";
import { MeetingRunsTable } from "@/components/sync/MeetingRunsTable";
import { AuditDrawer } from "@/components/sync/AuditDrawer";
import { dismissAlert, useSyncStore } from "@/lib/sync-store";
import type { AuditRow } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sync Health — Google Calendar → Slack" },
      { name: "description", content: "Monitor OAuth token health, pipeline traces and meeting runs for the Google Calendar to Slack sync." },
      { property: "og:title", content: "Sync Health — Google Calendar → Slack" },
      { property: "og:description", content: "OAuth token lifecycle and sync pipeline health dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useSyncStore();
  const [selected, setSelected] = useState<AuditRow | null>(null);
  const showAlert = s.token.consecutiveFailures >= 3 && !s.alertDismissed;
  return (
    <AppShell>
      {showAlert && (
        <div role="alert" className="flex items-center justify-between bg-destructive px-6 py-3 pr-36 text-sm font-medium text-destructive-foreground">
          OAuth credential requires re-authorization. Alert sent to #alerts.
          <button onClick={dismissAlert} aria-label="Dismiss alert" className="rounded p-1 hover:bg-destructive-foreground/15">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <main className="flex flex-col gap-6 p-6 lg:p-8">
        <header className="pr-28">
          <h1 className="text-3xl">Google Calendar → Slack Sync</h1>
        </header>
        <TokenHealthCard />
        <PipelineTrace />
        <MeetingRunsTable rows={s.runs} onSelect={setSelected} />
      </main>
      <AuditDrawer row={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}
