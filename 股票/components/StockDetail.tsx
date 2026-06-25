"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, BarChart3, LineChart, RefreshCw, ShieldCheck } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ScoreBadge, SignalBadge } from "@/components/ScoreBadge";
import { StockChart } from "@/components/StockChart";
import type { ChartPoint, ScoreBreakdown, Stock } from "@/types/stock";
import { formatCompact, formatCurrency, formatPercent } from "@/utils/format";

interface StockDetailResponse {
  stock: Stock;
  score: ScoreBreakdown;
  chartData: ChartPoint[];
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-terminal-muted">{label}</span>
        <span className="font-mono text-slate-100">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-slate-800">
        <div className="h-full rounded bg-terminal-cyan" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function StockDetail({ ticker }: { ticker: string }) {
  const [data, setData] = useState<StockDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStock() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/stock/${encodeURIComponent(ticker)}`, {
          signal: controller.signal,
          cache: "no-store"
        });

        if (response.status === 404) {
          throw new Error("Stock not found in the current market universe");
        }

        if (!response.ok) {
          throw new Error(`Stock request failed with ${response.status}`);
        }

        setData((await response.json()) as StockDetailResponse);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load stock");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadStock();

    return () => controller.abort();
  }, [ticker]);

  const trend = useMemo(() => {
    if (!data) {
      return {
        sevenDayReturn: 0,
        thirtyDayReturn: 0
      };
    }

    const { stock } = data;

    return {
      sevenDayReturn:
        ((stock.prices7d[stock.prices7d.length - 1] - stock.prices7d[0]) / stock.prices7d[0]) * 100,
      thirtyDayReturn:
        ((stock.prices30d[stock.prices30d.length - 1] - stock.prices30d[0]) /
          stock.prices30d[0]) *
        100
    };
  }, [data]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-terminal-bg terminal-grid px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-800" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-md bg-terminal-panel" />
            <div className="h-28 animate-pulse rounded-md bg-terminal-panel" />
            <div className="h-28 animate-pulse rounded-md bg-terminal-panel" />
          </div>
          <div className="mt-6 h-[420px] animate-pulse rounded-md bg-terminal-panel" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-terminal-bg px-6 text-slate-100">
        <div className="max-w-md rounded-md border border-terminal-border bg-terminal-panel p-6">
          <AlertTriangle className="mb-4 h-6 w-6 text-terminal-amber" />
          <h1 className="text-xl font-semibold">Stock detail unavailable</h1>
          <p className="mt-2 text-sm text-terminal-muted">{error ?? "No stock data returned"}</p>
          <div className="mt-5 flex gap-3">
            <Link
              href="/ideas"
              className="rounded-md border border-terminal-border px-4 py-2 text-sm hover:border-terminal-cyan hover:text-terminal-cyan"
            >
              Back to ideas
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-md border border-terminal-border px-4 py-2 text-sm hover:border-terminal-cyan hover:text-terminal-cyan"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { stock, score, chartData } = data;

  return (
    <main className="min-h-screen bg-terminal-bg terminal-grid px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-sm text-terminal-muted hover:text-terminal-cyan"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to ideas
        </Link>

        <section className="mt-6 flex flex-col gap-5 border-b border-terminal-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-4xl font-semibold">{stock.ticker}</h1>
              <SignalBadge signal={score.signal} />
              <ScoreBadge score={score.total} />
            </div>
            <p className="mt-2 text-terminal-muted">{stock.name}</p>
            <p className="mt-1 text-sm text-terminal-muted">{stock.sector}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[560px]">
            <MetricCard label="Price" value={formatCurrency(stock.price)} meta="latest close" />
            <MetricCard
              label="Daily Change"
              value={<span className="text-terminal-green">{formatPercent(stock.changePercent)}</span>}
              meta="market session"
            />
            <MetricCard label="Market Cap" value={formatCompact(stock.marketCap)} meta="equity value" />
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            label="7D Trend"
            value={
              <span className={trend.sevenDayReturn >= 0 ? "text-terminal-green" : "text-terminal-red"}>
                {formatPercent(trend.sevenDayReturn)}
              </span>
            }
            meta="price momentum input"
          />
          <MetricCard
            label="30D Trend"
            value={
              <span className={trend.thirtyDayReturn >= 0 ? "text-terminal-green" : "text-terminal-red"}>
                {formatPercent(trend.thirtyDayReturn)}
              </span>
            }
            meta="trend context"
          />
          <MetricCard label="Volume" value={formatCompact(stock.volume)} meta={`avg ${formatCompact(stock.avgVolume)}`} />
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-terminal-cyan" />
            <h2 className="text-lg font-semibold">Price and Volume</h2>
          </div>
          <StockChart data={chartData} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-md border border-terminal-border bg-terminal-panel/88 p-5">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-terminal-cyan" />
              <h2 className="text-lg font-semibold">Scoring Breakdown</h2>
            </div>
            <div className="grid gap-5">
              <ScoreRow label="Price momentum 7D" value={score.priceMomentum7d} />
              <ScoreRow label="Volume change" value={score.volumeChange} />
              <ScoreRow label="Moving average trend" value={score.movingAverageTrend} />
              <ScoreRow label="Volatility stability" value={score.volatilityScore} />
            </div>
          </div>

          <div className="rounded-md border border-terminal-border bg-terminal-panel/88 p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-terminal-green" />
              <h2 className="text-lg font-semibold">Signal Logic</h2>
            </div>
            <div className="space-y-3 text-sm leading-6 text-terminal-muted">
              <p>
                Score combines 7-day momentum, relative volume, moving average trend, and volatility stability.
              </p>
              <p>Ideas enter the feed only when daily change is above 2% and total score is above 60.</p>
              <p className="font-mono text-slate-200">
                score = momentum * 0.3 + volume * 0.2 + MA trend * 0.3 + volatility * 0.2
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
