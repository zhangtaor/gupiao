"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ChartPoint } from "@/types/stock";
import { formatCompact, formatCurrency } from "@/utils/format";

interface StockChartProps {
  data: ChartPoint[];
  compact?: boolean;
}

function CandlestickSvg({ data }: { data: ChartPoint[] }) {
  const width = 920;
  const height = 420;
  const padding = { top: 20, right: 76, bottom: 34, left: 18 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const lows = data.map((point) => point.low);
  const highs = data.map((point) => point.high);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const range = Math.max(max - min, 1);
  const candleGap = innerWidth / data.length;
  const bodyWidth = Math.max(7, candleGap * 0.48);
  const grid = Array.from({ length: 5 }, (_, index) => min + (range / 4) * index);

  const yFor = (value: number) => padding.top + ((max - value) / range) * innerHeight;
  const xFor = (index: number) => padding.left + candleGap * index + candleGap / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="30 day candlestick chart">
      <rect width={width} height={height} fill="transparent" />
      {grid.map((value) => {
        const y = yFor(value);
        return (
          <g key={value}>
            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#223047" strokeDasharray="4 5" />
            <text x={width - padding.right + 12} y={y + 4} fill="#8A97AA" fontSize="12" fontFamily="ui-monospace, monospace">
              {formatCurrency(value)}
            </text>
          </g>
        );
      })}
      {data.map((point, index) => {
        const rising = point.close >= point.open;
        const x = xFor(index);
        const highY = yFor(point.high);
        const lowY = yFor(point.low);
        const openY = yFor(point.open);
        const closeY = yFor(point.close);
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(closeY - openY));
        const color = rising ? "#36D399" : "#FB7185";

        return (
          <g key={`${point.date}-${index}`}>
            <title>
              {`${point.date} O ${point.open} H ${point.high} L ${point.low} C ${point.close}`}
            </title>
            <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} strokeWidth="1.4" />
            <rect
              x={x - bodyWidth / 2}
              y={bodyY}
              width={bodyWidth}
              height={bodyHeight}
              rx="2"
              fill={rising ? "rgba(54, 211, 153, 0.22)" : "rgba(251, 113, 133, 0.22)"}
              stroke={color}
              strokeWidth="1.4"
            />
            {index % 5 === 0 ? (
              <text x={x} y={height - 12} fill="#8A97AA" fontSize="11" textAnchor="middle" fontFamily="ui-monospace, monospace">
                {point.date}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function StockChart({ data, compact = false }: StockChartProps) {
  if (compact) {
    return (
      <ResponsiveContainer width="100%" height={92}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.42} />
              <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            dataKey="close"
            stroke="#22D3EE"
            strokeWidth={2}
            fill="url(#spark)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
      <div className="h-[420px] rounded-md border border-terminal-border bg-terminal-panel p-4">
        <CandlestickSvg data={data} />
      </div>
      <div className="h-[420px] rounded-md border border-terminal-border bg-terminal-panel p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#223047" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke="#8A97AA" tickLine={false} axisLine={false} />
            <YAxis
              stroke="#8A97AA"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompact(Number(value))}
            />
            <Tooltip
              contentStyle={{
                background: "#0B111C",
                border: "1px solid #223047",
                borderRadius: 6,
                color: "#E5EDF8"
              }}
              formatter={(value) => [formatCompact(Number(value)), "Volume"]}
            />
            <Bar dataKey="volume" fill="#36D399" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
