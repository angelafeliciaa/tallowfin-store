import { LOW_STOCK_COUNT, type StockState } from "@/lib/catalog";

export default function StockLine({ stock }: { stock: StockState }) {
  if (stock === "low-stock") return <p className="stock low">{`Only ${LOW_STOCK_COUNT} left in stock`}</p>;
  if (stock === "sold-out") return <p className="stock out">Sold out</p>;
  return <p className="stock">In stock</p>;
}
