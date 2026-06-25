import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  meta?: ReactNode;
}

export function MetricCard({ label, value, meta }: MetricCardProps) {
  return (
    <div className="rounded-md border border-terminal-border bg-terminal-panel/88 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-terminal-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
      {meta ? <div className="mt-1 text-sm text-terminal-muted">{meta}</div> : null}
    </div>
  );
}
