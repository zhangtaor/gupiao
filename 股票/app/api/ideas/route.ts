import { NextResponse } from "next/server";
import { getMarketDataProvider } from "@/lib/marketData";
import { generateIdeas } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = getMarketDataProvider();
  const stocks = await provider.listStocks();
  const ideas = generateIdeas(stocks);

  return NextResponse.json(
    {
      ideas
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
