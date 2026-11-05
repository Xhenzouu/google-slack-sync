import { useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { hydrateStore } from "@/lib/sync-store";
import { cn } from "@/lib/utils";

export function AppShell({ children, title, banner }: { children: ReactNode; title: string; banner?: ReactNode }) {
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => hydrateStore(), []);

  return (
    <div className={cn(dark && "dark")}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="min-w-0 flex-1">
          {banner}
          <header className="flex items-center justify-between gap-4 px-6 pt-6 lg:px-8 lg:pt-8">
            <h1 className="text-3xl">{title}</h1>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle light/dark mode"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {dark ? "Light" : "Dark"}
          </button>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
