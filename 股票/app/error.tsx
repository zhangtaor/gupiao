"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-terminal-bg px-6 text-slate-200">
      <div className="max-w-md rounded-md border border-terminal-border bg-terminal-panel p-6">
        <AlertTriangle className="mb-4 h-6 w-6 text-terminal-amber" />
        <h1 className="text-xl font-semibold">Market data failed to load</h1>
        <p className="mt-2 text-sm text-terminal-muted">
          The dashboard caught an unexpected error while preparing the feed.
        </p>
        <button
          onClick={reset}
          className="mt-5 rounded-md border border-terminal-border px-4 py-2 text-sm text-slate-100 hover:border-terminal-cyan"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
