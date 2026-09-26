import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "MarketHub",
  description: "Multi-vendor shopping cart marketplace"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <header className="nav">
            <div className="container nav-inner">
              <Link className="brand" href="/">
                <span className="brand-mark">M</span>
                MarketHub
              </Link>
              <nav className="nav-links" aria-label="Main navigation">
                <Link href="/">Shop</Link>
                <Link href="/cart">Cart</Link>
                <Link href="/login">Login</Link>
              </nav>
            </div>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}