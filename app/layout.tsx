import type { Metadata } from "next";
import Link from "next/link";
import { currentBrand } from "@/lib/brand";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await currentBrand();
  return { title: brand.name, description: "Insulated steel bottles.", robots: { index: false, follow: false } };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = await currentBrand();
  return (
    <html lang="en">
      <body>
        <header className="top">
          <Link href="/" className="brand">{brand.name}</Link>
          <Link href="/cart">Cart</Link>
        </header>
        <main>{children}</main>
        <footer className="foot">{`© 2026 ${brand.name}`}</footer>
      </body>
    </html>
  );
}
