import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-terminal-bg text-slate-200">
      <div className="flex items-center gap-3 rounded-md border border-terminal-border bg-terminal-panel px-4 py-3">
        <Loader2 className="h-5 w-5 animate-spin text-terminal-cyan" />
        Loading market data
      </div>
    </main>
  );
}
