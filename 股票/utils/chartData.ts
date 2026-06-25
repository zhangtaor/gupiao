import type { ChartPoint, Stock } from "@/types/stock";

export function buildChartData(stock: Stock): ChartPoint[] {
  const today = new Date("2026-06-25T00:00:00Z");

  return stock.prices30d.map((close, index, series) => {
    const previous = series[index - 1] ?? close * 0.99;
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (series.length - 1 - index));
    const drift = (close - previous) / previous;
    const high = close * (1 + Math.abs(drift) + 0.006);
    const low = close * (1 - Math.abs(drift) - 0.006);

    return {
      date: date.toISOString().slice(5, 10),
      open: Number(previous.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close,
      volume: Math.round(stock.avgVolume * (0.8 + ((index % 5) + 1) * 0.08))
    };
  });
}
