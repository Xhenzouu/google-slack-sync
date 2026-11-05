import { Check, X, Minus, Loader2 } from "lucide-react";
import { PIPELINE_STEPS, useSyncStore, type StepStatus } from "@/lib/sync-store";
import { cn } from "@/lib/utils";

const node: Record<StepStatus, string> = {
  idle: "border-border bg-background text-muted-foreground",
  running: "border-primary bg-background text-primary",
  success: "border-success bg-success text-success-foreground",
  failed: "border-destructive bg-destructive text-destructive-foreground",
  skipped: "border-neutral bg-neutral text-neutral-foreground",
};

function Icon({ s }: { s: StepStatus }) {
  if (s === "success") return <Check className="h-4 w-4" />;
  if (s === "failed") return <X className="h-4 w-4" />;
  if (s === "skipped") return <Minus className="h-4 w-4" />;
  if (s === "running") return <Loader2 className="h-4 w-4 animate-spin" />;
  return null;
}

export function PipelineTrace() {
  const { steps, refreshStep, fetchNote } = useSyncStore();
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6 text-xl">Pipeline Trace</h2>
      <ol className="flex items-start overflow-x-auto pb-2">
        {PIPELINE_STEPS.map((name, i) => {
          const s = steps[i] ?? "idle";
          return (
            <li key={name} className="flex min-w-[120px] flex-1 items-start">
              <div className="flex w-full flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <div className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : s !== "idle" ? "bg-foreground/40" : "bg-border")} />
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold", node[s])}>
                    <Icon s={s} />
                    {s === "idle" && i + 1}
                  </div>
                  <div className={cn("h-0.5 flex-1", i === PIPELINE_STEPS.length - 1 ? "bg-transparent" : (steps[i + 1] ?? "idle") !== "idle" ? "bg-foreground/40" : "bg-border")} />
                </div>
                <span className="mt-2 px-1 text-xs font-medium">{name}</span>
                <span className="text-[11px] capitalize text-muted-foreground">{s}</span>
                {i === 1 && fetchNote && <span className="mt-1 text-[11px] font-semibold text-destructive">{fetchNote}</span>}
                {i === 2 && refreshStep && (
                  <div className={cn("mt-2 flex items-center gap-1 rounded-md border-2 px-2 py-1 text-[11px] font-medium", node[refreshStep])}>
                    <Icon s={refreshStep} /> Refresh Token
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
