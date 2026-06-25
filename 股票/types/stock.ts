export type Signal = "BUY" | "HOLD" | "SELL";

export type Sector =
  | "Technology"
  | "Healthcare"
  | "Financials"
  | "Consumer"
  | "Energy"
  | "Industrials";

export interface Stock {
  ticker: string;
  name: string;
  sector: Sector;
  price: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  prices7d: number[];
  prices30d: number[];
}

export interface ScoreBreakdown {
  priceMomentum7d: number;
  volumeChange: number;
  movingAverageTrend: number;
  volatilityScore: number;
  total: number;
  signal: Signal;
}

export interface StockIdea extends Stock {
  score: ScoreBreakdown;
}

export interface ChartPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
