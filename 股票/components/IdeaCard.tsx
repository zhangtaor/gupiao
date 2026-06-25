import Link from "next/link";
import { ArrowUpRight, Activity } from "lucide-react";
import type { StockIdea } from "@/types/stock";
import { buildChartData } from "@/utils/chartData";
import { formatCompact, formatCurrency, formatPercent } from "@/utils/format";
import { ScoreBadge, SignalBadge } from "@/components/ScoreBadge";
import { StockChart } from "@/components/StockChart";

export function IdeaCard({ idea }: { idea: StockIdea }) {
  return (
    <Link
      href={`/stock/${idea.ticker}`}
      className="group rounded-md border border-terminal-border bg-terminal-panel/92 p-4 transition duration-200 hover:border-terminal-cyan/70 hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-semibold text-slate-100">{idea.ticker}</span>
            <SignalBadge signal={idea.score.signal} />
          </div>
          <div className="mt-1 max-w-52 truncate text-sm text-terminal-muted">{idea.name}</div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-terminal-muted transition group-hover:text-terminal-cyan" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <div className="text-xs text-terminal-muted">Price</div>
          <div className="mt-1 font-mono text-sm text-slate-100">{formatCurrency(idea.price)}</div>
        </div>
        <div>
          <div className="text-xs text-terminal-muted">Change</div>
          <div className="mt-1 font-mono text-sm text-terminal-green">
            {formatPercent(idea.changePercent)}
          </div>
        </div>
        <div>
          <div className="text-xs text-terminal-muted">Score</div>
          <div className="mt-1">
            <ScoreBadge score={idea.score.total} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <StockChart data={buildChartData(idea)} compact />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-terminal-border pt-3 text-xs text-terminal-muted">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5" />
          Vol {formatCompact(idea.volume)}
        </span>
        <span>Cap {formatCompact(idea.marketCap)}</span>
        <span>{idea.sector}</span>
      </div>
    </Link>
  );
}
