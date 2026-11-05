import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  success: "bg-success text-success-foreground",
  failed: "bg-destructive text-destructive-foreground",
  skipped: "bg-neutral text-neutral-foreground",
  not_attempted: "bg-neutral text-neutral-foreground",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status] ?? styles["skipped"])}>
      {status === "not_attempted" ? "skipped" : status}
    </span>
  );
}
