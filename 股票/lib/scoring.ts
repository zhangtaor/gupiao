import type { ScoreBreakdown, Signal, Stock, StockIdea } from "@/types/stock";
import { clamp } from "@/utils/format";

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  const avg = average(values);
  const variance = average(values.map((value) => (value - avg) ** 2));
  return Math.sqrt(variance);
}

export function calculatePriceMomentum7d(stock: Stock): number {
  const first = stock.prices7d[0];
  const last = stock.prices7d[stock.prices7d.length - 1];
  const pct = ((last - first) / first) * 100;
  return clamp(((pct + 10) / 25) * 100);
}

export function calculateVolumeChange(stock: Stock): number {
  const ratio = stock.volume / stock.avgVolume;
  return clamp((ratio / 2.2) * 100);
}

export function calculateMovingAverageTrend(stock: Stock): number {
  const ma20 = average(stock.prices30d.slice(-20));
  const ma50Proxy = average(stock.prices30d);
  const latest = stock.price;
  let score = 35;

  if (latest > ma20) score += 30;
  if (latest > ma50Proxy) score += 25;
  if (ma20 > ma50Proxy) score += 10;

  return clamp(score);
}

export function calculateVolatilityScore(stock: Stock): number {
  const returns = stock.prices30d.slice(1).map((price, index) => {
    const previous = stock.prices30d[index];
    return ((price - previous) / previous) * 100;
  });
  const volatility = standardDeviation(returns);
  return clamp(100 - volatility * 24);
}

export function getSignal(total: number): Signal {
  if (total >= 75) return "BUY";
  if (total >= 55) return "HOLD";
  return "SELL";
}

export function calculateScore(stock: Stock): ScoreBreakdown {
  const priceMomentum7d = calculatePriceMomentum7d(stock);
  const volumeChange = calculateVolumeChange(stock);
  const movingAverageTrend = calculateMovingAverageTrend(stock);
  const volatilityScore = calculateVolatilityScore(stock);
  const total =
    priceMomentum7d * 0.3 +
    volumeChange * 0.2 +
    movingAverageTrend * 0.3 +
    volatilityScore * 0.2;

  return {
    priceMomentum7d: Math.round(priceMomentum7d),
    volumeChange: Math.round(volumeChange),
    movingAverageTrend: Math.round(movingAverageTrend),
    volatilityScore: Math.round(volatilityScore),
    total: Math.round(total),
    signal: getSignal(total)
  };
}

export function generateIdeas(stocks: Stock[]): StockIdea[] {
  return stocks
    .map((stock) => ({
      ...stock,
      score: calculateScore(stock)
    }))
    .filter((stock) => stock.changePercent > 2 && stock.score.total > 60)
    .sort((a, b) => b.score.total - a.score.total);
}
