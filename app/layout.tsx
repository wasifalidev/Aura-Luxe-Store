import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura Luxe — Premium Signature Objects & Crafted Essentials",
  description: "Curating the world's most thoughtfully designed objects. Discover premium furniture, electronics, and lifestyle accessories designed for modern minimalist aesthetics.",
  metadataBase: new URL("https://aura-luxe-store.vercel.app"),
  openGraph: {
    title: "Aura Luxe — Premium Signature Objects & Crafted Essentials",
    description: "Curating the world's most thoughtfully designed objects. Discover premium furniture, electronics, and lifestyle accessories designed for modern minimalist aesthetics.",
    url: "https://auraluxestore.vercel.app",
    siteName: "Aura Luxe",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aura Luxe Store Preview - Designer Furniture and Crafted Lifestyle Objects",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Luxe — Premium Signature Objects & Crafted Essentials",
    description: "Curating the world's most thoughtfully designed objects. Discover premium furniture, electronics, and lifestyle accessories designed for modern minimalist aesthetics.",
    images: ["/og-image.png"],
    creator: "@wasifalidev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
