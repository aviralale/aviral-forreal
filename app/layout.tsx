import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";

// Fraunces — the display hand for titles. A warm, characterful "old style"
// serif that reads far better at large sizes than a thin Didone.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Newsreader — the text hand. Drawn for on-screen reading: sturdy, even color,
// generous x-height. The whole body is set in it.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aviral, for real",
    template: "%s — Aviral, for real",
  },
  description: "Writing by Aviral Ale. Kathmandu, Nepal.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "Aviral, for real",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@aviralale",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
