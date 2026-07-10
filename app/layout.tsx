import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AutomationConnectorFix from "./AutomationConnectorFix";
import MotionEffects from "./MotionEffects";
import ScreenshotSliderEnhancer from "./ScreenshotSliderEnhancer";
import SmoothScroll from "./SmoothScroll";
import "./globals.css";
import "./design-fix.css";
import "./audience-sales-fix.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Badal CRM — Real Estate Lead Management",
  description:
    "Manage real estate leads, listings, follow-ups, showings, documents, agents, and deals from one workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <ScreenshotSliderEnhancer />
        <SmoothScroll />
        <AutomationConnectorFix />
        <MotionEffects />
      </body>
    </html>
  );
}
