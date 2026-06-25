import { getStockByTicker, mockStocks } from "@/data/mockStocks";
import type { ChartPoint, Stock } from "@/types/stock";
import { buildChartData } from "@/utils/chartData";

export async function fetchMarketData(): Promise<Stock[]> {
  return mockStocks;
}

export async function fetchStockPrice(ticker: string): Promise<number | undefined> {
  return getStockByTicker(ticker)?.price;
}

export async function fetchVolume(
  ticker: string
): Promise<{ volume: number; avgVolume: number } | undefined> {
  const stock = getStockByTicker(ticker);

  if (!stock) {
    return undefined;
  }

  return {
    volume: stock.volume,
    avgVolume: stock.avgVolume
  };
}

export interface MarketDataProvider {
  listStocks(): Promise<Stock[]>;
  getStock(ticker: string): Promise<Stock | undefined>;
  getChartData(stock: Stock): Promise<ChartPoint[]>;
}

export const mockMarketDataProvider: MarketDataProvider = {
  async listStocks() {
    return fetchMarketData();
  },
  async getStock(ticker: string) {
    return getStockByTicker(ticker);
  },
  async getChartData(stock: Stock) {
    return buildChartData(stock);
  }
};

export function getMarketDataProvider(): MarketDataProvider {
  return mockMarketDataProvider;
}
