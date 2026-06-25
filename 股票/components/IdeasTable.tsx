import Link from "next/link";
import type { StockIdea } from "@/types/stock";
import { formatCompact, formatCurrency, formatPercent } from "@/utils/format";
import { ScoreBadge, SignalBadge } from "@/components/ScoreBadge";

export function IdeasTable({ ideas }: { ideas: StockIdea[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-terminal-border bg-terminal-panel/88">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-terminal-panel2 text-xs uppercase tracking-[0.16em] text-terminal-muted">
            <tr>
              <th className="px-4 py-3">Ticker</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Daily</th>
              <th className="px-4 py-3 text-right">Volume</th>
              <th className="px-4 py-3 text-right">Market Cap</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-terminal-border">
            {ideas.map((idea) => (
              <tr key={idea.ticker} className="hover:bg-cyan-400/5">
                <td className="px-4 py-3">
                  <Link href={`/stock/${idea.ticker}`} className="font-mono font-semibold text-terminal-cyan">
                    {idea.ticker}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-200">{idea.name}</td>
                <td className="px-4 py-3 text-terminal-muted">{idea.sector}</td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(idea.price)}</td>
                <td className="px-4 py-3 text-right font-mono text-terminal-green">
                  {formatPercent(idea.changePercent)}
                </td>
                <td className="px-4 py-3 text-right font-mono">{formatCompact(idea.volume)}</td>
                <td className="px-4 py-3 text-right font-mono">{formatCompact(idea.marketCap)}</td>
                <td className="px-4 py-3 text-center">
                  <ScoreBadge score={idea.score.total} />
                </td>
                <td className="px-4 py-3 text-center">
                  <SignalBadge signal={idea.score.signal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
