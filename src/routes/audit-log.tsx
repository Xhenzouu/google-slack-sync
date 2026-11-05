import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/sync/AppShell";
import { MeetingRunsTable } from "@/components/sync/MeetingRunsTable";
import { AuditDrawer } from "@/components/sync/AuditDrawer";
import { useSyncStore } from "@/lib/sync-store";
import type { AuditRow } from "@/lib/mockData";

export const Route = createFileRoute("/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — Sync Health" },
      { name: "description", content: "Full audit trail of every Google Calendar to Slack sync run." },
      { property: "og:title", content: "Audit Log — Sync Health" },
      { property: "og:description", content: "Every sync run with OAuth and Slack status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuditLog,
});

function AuditLog() {
  const { runs } = useSyncStore();
  const [selected, setSelected] = useState<AuditRow | null>(null);
  return (
    <AppShell title="Audit Log">
      <main className="flex flex-col gap-6 p-6 lg:p-8">
        <MeetingRunsTable title={`All Runs (${runs.length})`} rows={runs} onSelect={setSelected} />
      </main>
      <AuditDrawer row={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}
