"use client";

import type { Dispatch, SetStateAction } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Signal } from "@/types/stock";

export type SortKey = "score" | "volume" | "change";

export interface FilterState {
  sector: string;
  scoreMin: number;
  signal: "ALL" | Signal;
  sortBy: SortKey;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  sectors: string[];
}

export function FilterBar({ filters, setFilters, sectors }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-terminal-border bg-terminal-bg/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mr-2 flex items-center gap-2 text-sm font-medium text-slate-200">
          <SlidersHorizontal className="h-4 w-4 text-terminal-cyan" />
          Filters
        </div>

        <label className="grid gap-1 text-xs text-terminal-muted">
          Sector
          <select
            value={filters.sector}
            onChange={(event) => setFilters((state) => ({ ...state, sector: event.target.value }))}
            className="h-9 rounded-md border border-terminal-border bg-terminal-panel px-3 text-sm text-slate-100 outline-none focus:border-terminal-cyan"
          >
            <option value="ALL">All sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </label>

        <label className="grid min-w-40 gap-1 text-xs text-terminal-muted">
          Min Score: {filters.scoreMin}
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.scoreMin}
            onChange={(event) =>
              setFilters((state) => ({ ...state, scoreMin: Number(event.target.value) }))
            }
            className="accent-cyan-300"
          />
        </label>

        <label className="grid gap-1 text-xs text-terminal-muted">
          Signal
          <select
            value={filters.signal}
            onChange={(event) =>
              setFilters((state) => ({ ...state, signal: event.target.value as FilterState["signal"] }))
            }
            className="h-9 rounded-md border border-terminal-border bg-terminal-panel px-3 text-sm text-slate-100 outline-none focus:border-terminal-cyan"
          >
            <option value="ALL">All signals</option>
            <option value="BUY">BUY</option>
            <option value="HOLD">HOLD</option>
            <option value="SELL">SELL</option>
          </select>
        </label>

        <label className="grid gap-1 text-xs text-terminal-muted">
          Sort
          <select
            value={filters.sortBy}
            onChange={(event) =>
              setFilters((state) => ({ ...state, sortBy: event.target.value as SortKey }))
            }
            className="h-9 rounded-md border border-terminal-border bg-terminal-panel px-3 text-sm text-slate-100 outline-none focus:border-terminal-cyan"
          >
            <option value="score">Score</option>
            <option value="volume">Volume</option>
            <option value="change">Change</option>
          </select>
        </label>
      </div>
    </div>
  );
}
