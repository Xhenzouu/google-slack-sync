import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, ChevronLeft, ChevronRight, ScrollText, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Sync Health", url: "/", icon: Activity },
  { title: "Audit Log", url: "/audit-log", icon: ScrollText },
] as const;

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200",
        collapsed ? "w-16" : "w-[260px]",
      )}
    >
      <div className={cn("flex border-b border-border p-4", collapsed ? "flex-col items-center gap-3" : "items-center justify-between")}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <RefreshCw className="h-4 w-4" />
          </div>
          {!collapsed && <span className="font-serif text-lg">SyncHealth</span>}
        </div>
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {items.map((it) => {
          const active = path === it.url;
          return (
            <Link
              key={it.url}
              to={it.url}
              title={it.title}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                collapsed && "justify-center px-0",
                active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <it.icon className="h-4 w-4 shrink-0" />
              {!collapsed && it.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
