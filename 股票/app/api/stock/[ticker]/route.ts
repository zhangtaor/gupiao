import { NextResponse } from "next/server";
import { getMarketDataProvider } from "@/lib/marketData";
import { calculateScore } from "@/lib/scoring";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    ticker: string;
  };
}

export async function GET(_: Request, { params }: RouteContext) {
  const provider = getMarketDataProvider();
  const stock = await provider.getStock(params.ticker);

  if (!stock) {
    return NextResponse.json(
      {
        error: "Stock not found"
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      stock,
      score: calculateScore(stock),
      chartData: await provider.getChartData(stock)
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
