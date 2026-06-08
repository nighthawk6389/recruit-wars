import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/../config/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ComplianceBar } from "@/components/compliance-bar";
import { DemoBanner } from "@/components/demo-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} dark`}>
      <body className="min-h-screen flex flex-col">
        <DemoBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <ComplianceBar />
        <Footer />
      </body>
    </html>
  );
}
