import { useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { hydrateStore } from "@/lib/sync-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => hydrateStore(), []);

  return (
    <div className={cn(dark && "dark")}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="relative min-w-0 flex-1">
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle light/dark mode"
            className="absolute right-6 top-5 z-10 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {dark ? "Light" : "Dark"}
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
