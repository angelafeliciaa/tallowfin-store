import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tallowfin",
  description: "Insulated steel bottles.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <Link href="/" className="brand">Tallowfin</Link>
          <Link href="/cart">Cart</Link>
        </header>
        <main>{children}</main>
        <footer className="foot">
          Tallowfin is a research test store run by The Prompting Company to study how AI shopping agents read
          product pages. Products are not for sale and checkout is disabled.
        </footer>
      </body>
    </html>
  );
}
