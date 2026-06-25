import type { Sector, Stock } from "@/types/stock";

const sectors: Sector[] = [
  "Technology",
  "Healthcare",
  "Financials",
  "Consumer",
  "Energy",
  "Industrials"
];

const seedStocks = [
  ["NVDA", "NVIDIA Corporation", "Technology", 128.64],
  ["MSFT", "Microsoft Corporation", "Technology", 446.95],
  ["AAPL", "Apple Inc.", "Technology", 214.29],
  ["AVGO", "Broadcom Inc.", "Technology", 1728.14],
  ["LLY", "Eli Lilly and Company", "Healthcare", 882.13],
  ["UNH", "UnitedHealth Group", "Healthcare", 489.23],
  ["JPM", "JPMorgan Chase & Co.", "Financials", 207.84],
  ["V", "Visa Inc.", "Financials", 271.62],
  ["COST", "Costco Wholesale", "Consumer", 851.77],
  ["AMZN", "Amazon.com Inc.", "Consumer", 193.25],
  ["XOM", "Exxon Mobil Corporation", "Energy", 113.12],
  ["SLB", "Schlumberger Limited", "Energy", 46.52],
  ["CAT", "Caterpillar Inc.", "Industrials", 331.91],
  ["GE", "GE Aerospace", "Industrials", 162.44],
  ["AMD", "Advanced Micro Devices", "Technology", 159.47],
  ["CRM", "Salesforce Inc.", "Technology", 256.11],
  ["MRK", "Merck & Co.", "Healthcare", 127.89],
  ["GS", "Goldman Sachs Group", "Financials", 458.39],
  ["HD", "Home Depot Inc.", "Consumer", 356.44],
  ["CVX", "Chevron Corporation", "Energy", 156.91]
] as const;

function deterministicNoise(seed: number, index: number): number {
  const raw = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function buildPriceSeries(base: number, seed: number, days: number): number[] {
  const trend = (deterministicNoise(seed, 4) - 0.34) * 1.25;
  let current = base * (0.86 + deterministicNoise(seed, 2) * 0.18);

  return Array.from({ length: days }, (_, day) => {
    const swing = (deterministicNoise(seed, day) - 0.45) * 2.4;
    current = Math.max(2, current * (1 + (trend + swing) / 100));
    return Number(current.toFixed(2));
  });
}

export const mockStocks: Stock[] = seedStocks.map(([ticker, name, sector, basePrice], index) => {
  const prices30d = buildPriceSeries(basePrice, index + 11, 30);
  const isBreakoutCandidate = index % 3 !== 1;

  if (isBreakoutCandidate) {
    const previousClose = prices30d[prices30d.length - 2];
    const breakoutMove = 0.026 + deterministicNoise(index, 21) * 0.046;
    prices30d[prices30d.length - 1] = Number((previousClose * (1 + breakoutMove)).toFixed(2));
  }

  const prices7d = prices30d.slice(-7);
  const prior = prices30d[prices30d.length - 2];
  const price = prices30d[prices30d.length - 1];
  const changePercent = ((price - prior) / prior) * 100;
  const avgVolume = Math.round((8_000_000 + deterministicNoise(index, 8) * 58_000_000) / 1000) * 1000;
  const volumeMultiplier = isBreakoutCandidate
    ? 1.28 + deterministicNoise(index, 9) * 0.82
    : 0.72 + deterministicNoise(index, 9) * 0.82;
  const volume = Math.round((avgVolume * volumeMultiplier) / 1000) * 1000;
  const marketCap = Math.round((35_000_000_000 + deterministicNoise(index, 12) * 2_900_000_000_000) / 1_000_000) * 1_000_000;

  return {
    ticker,
    name,
    sector: sector as Sector,
    price,
    changePercent: Number(changePercent.toFixed(2)),
    volume,
    avgVolume,
    marketCap,
    prices7d,
    prices30d
  };
});

export function getStockByTicker(ticker: string): Stock | undefined {
  return mockStocks.find((stock) => stock.ticker.toLowerCase() === ticker.toLowerCase());
}
