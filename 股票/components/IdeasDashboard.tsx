"use client";

import { useMemo, useState } from "react";
import type { StockIdea } from "@/types/stock";
import { FilterBar, type FilterState } from "@/components/FilterBar";
import { IdeaCard } from "@/components/IdeaCard";
import { IdeasTable } from "@/components/IdeasTable";
import { MetricCard } from "@/components/MetricCard";
import { formatCompact } from "@/utils/format";

export function IdeasDashboard({ ideas }: { ideas: StockIdea[] }) {
  const [filters, setFilters] = useState<FilterState>({
    sector: "ALL",
    scoreMin: 60,
    signal: "ALL",
    sortBy: "score"
  });

  const sectors = useMemo(() => Array.from(new Set(ideas.map((idea) => idea.sector))).sort(), [ideas]);

  const filteredIdeas = useMemo(() => {
    return ideas
      .filter((idea) => filters.sector === "ALL" || idea.sector === filters.sector)
      .filter((idea) => idea.score.total >= filters.scoreMin)
      .filter((idea) => filters.signal === "ALL" || idea.score.signal === filters.signal)
      .sort((a, b) => {
        if (filters.sortBy === "volume") return b.volume - a.volume;
        if (filters.sortBy === "change") return b.changePercent - a.changePercent;
        return b.score.total - a.score.total;
      });
  }, [filters, ideas]);

  const buyCount = ideas.filter((idea) => idea.score.signal === "BUY").length;
  const avgScore =
    ideas.length > 0
      ? Math.round(ideas.reduce((sum, idea) => sum + idea.score.total, 0) / ideas.length)
      : 0;
  const totalVolume = ideas.reduce((sum, idea) => sum + idea.volume, 0);

  return (
    <main className="min-h-screen bg-terminal-bg terminal-grid">
      <FilterBar filters={filters} setFilters={setFilters} sectors={sectors} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-terminal-cyan">
              AI scoring feed
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">
              Stock Ideas Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-terminal-muted">
              Momentum, volume expansion, moving average structure, and volatility stability combined into a focused idea discovery feed.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
            <MetricCard label="Ideas" value={filteredIdeas.length} meta={`${ideas.length} qualified`} />
            <MetricCard label="BUY Signals" value={buyCount} meta="score >= 75" />
            <MetricCard label="Feed Volume" value={formatCompact(totalVolume)} meta={`avg score ${avgScore}`} />
          </div>
        </section>

        {filteredIdeas.length === 0 ? (
          <div className="rounded-md border border-terminal-border bg-terminal-panel p-8 text-center text-terminal-muted">
            No ideas match the current filters.
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.ticker} idea={idea} />
              ))}
            </section>

            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Ideas Table</h2>
                <span className="font-mono text-xs text-terminal-muted">
                  sorted by {filters.sortBy.toUpperCase()}
                </span>
              </div>
              <IdeasTable ideas={filteredIdeas} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
