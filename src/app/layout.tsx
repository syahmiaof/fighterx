import type { Metadata, Viewport } from "next";
import { Inter, Teko } from "next/font/google";
import { HomeScrollReset } from "@/components/home-scroll-reset";
import "./globals.css";

const display = Teko({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "FighterX — Train Smarter. Fight Stronger.",
  description: "A training and performance platform for Silat Seni and Silat Olahraga.",
  applicationName: "FighterX",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = { themeColor: "#08090B" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body><HomeScrollReset />{children}</body>
    </html>
  );
}
