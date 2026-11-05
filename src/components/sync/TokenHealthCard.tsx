import { formatTs, runSync, setSimulateFailure, useSyncStore } from "@/lib/sync-store";
import { cn } from "@/lib/utils";

export function TokenHealthCard() {
  const s = useSyncStore();
  const f = s.token.consecutiveFailures;
  const broken = f > 0;
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl">Token Health</h2>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <dl className="grid gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className={cn("mt-1 font-semibold", broken ? "text-destructive" : "text-success")}>
              Status: {broken ? "Broken" : "Connected"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Consecutive Refresh Failures</dt>
            <dd className={cn("mt-1 font-semibold tabular-nums", f >= 3 ? "text-destructive" : f > 0 && "text-warning")}>
              {f > 3 ? "3+" : f} / 3
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last Refresh</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {formatTs(new Date(s.token.lastRefreshAt.replace(" ", "T")))}{" "}
              <span className={s.token.lastRefreshStatus === "success" ? "text-success" : "text-destructive"}>
                ({s.token.lastRefreshStatus})
              </span>
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <button
              role="switch"
              aria-checked={s.simulateFailure}
              onClick={() => setSimulateFailure(!s.simulateFailure)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                s.simulateFailure ? "bg-destructive" : "bg-muted border border-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-card transition-transform",
                  s.simulateFailure ? "translate-x-[22px]" : "translate-x-0.5",
                )}
              />
            </button>
            Simulate expired token / refresh failure
          </label>
          <button
            onClick={runSync}
            disabled={s.running}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {s.running ? "Running…" : "Run Sync Now"}
          </button>
        </div>
      </div>
    </section>
  );
}
