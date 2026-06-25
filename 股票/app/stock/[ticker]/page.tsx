import { StockDetail } from "@/components/StockDetail";

interface StockPageProps {
  params: {
    ticker: string;
  };
}

export default function StockPage({ params }: StockPageProps) {
  return <StockDetail ticker={params.ticker} />;
}
