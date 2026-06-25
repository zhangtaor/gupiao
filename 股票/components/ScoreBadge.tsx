import clsx from "clsx";
import type { Signal } from "@/types/stock";

export function SignalBadge({ signal }: { signal: Signal }) {
  return (
    <span
      className={clsx(
        "inline-flex min-w-16 items-center justify-center rounded px-2.5 py-1 text-xs font-semibold",
        signal === "BUY" && "bg-emerald-400/12 text-terminal-green ring-1 ring-emerald-400/35",
        signal === "HOLD" && "bg-amber-400/12 text-terminal-amber ring-1 ring-amber-400/35",
        signal === "SELL" && "bg-rose-400/12 text-terminal-red ring-1 ring-rose-400/35"
      )}
    >
      {signal}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 75
      ? "text-terminal-green bg-emerald-400/10"
      : score >= 60
        ? "text-terminal-amber bg-amber-400/10"
        : "text-terminal-red bg-rose-400/10";

  return (
    <span className={clsx("inline-flex items-center rounded px-2.5 py-1 font-mono text-sm", tone)}>
      {score}
    </span>
  );
}
