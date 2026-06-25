"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { IdeasDashboard } from "@/components/IdeasDashboard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import type { StockIdea } from "@/types/stock";

interface IdeasResponse {
  ideas: StockIdea[];
}

export function IdeasFeed() {
  const [ideas, setIdeas] = useState<StockIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadIdeas() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/ideas", {
          signal: controller.signal,
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(`Ideas request failed with ${response.status}`);
        }

        const payload = (await response.json()) as IdeasResponse;
        setIdeas(payload.ideas);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load ideas");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadIdeas();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-terminal-bg px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-terminal-cyan">AI scoring feed</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">
              Stock Ideas Dashboard
            </h1>
          </div>
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-terminal-bg px-6 text-slate-100">
        <div className="max-w-md rounded-md border border-terminal-border bg-terminal-panel p-6">
          <AlertTriangle className="mb-4 h-6 w-6 text-terminal-amber" />
          <h1 className="text-xl font-semibold">Ideas feed unavailable</h1>
          <p className="mt-2 text-sm text-terminal-muted">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-terminal-border px-4 py-2 text-sm hover:border-terminal-cyan hover:text-terminal-cyan"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </main>
    );
  }

  return <IdeasDashboard ideas={ideas} />;
}
