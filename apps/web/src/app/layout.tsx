import type { Metadata } from "next";
import { Inter, Spline_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Readiness Assessment | Accelerator Solutions",
  description: "Discover how AI-ready your organisation is with our comprehensive assessment. Get personalised insights and actionable recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${splineSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
