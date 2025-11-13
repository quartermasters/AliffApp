import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

export const metadata: Metadata = {
  title: {
    default: "Aliff Services - Strategic Thinking + AI Execution",
    template: "%s | Aliff Services",
  },
  description:
    "Win 22% of federal contracts. Build enterprise systems at startup speed. Create authentic content, not AI slop. Strategic thinking + AI execution beats AI commodity competitors.",
  keywords: [
    "government contracts",
    "federal contracts",
    "GOVCON services",
    "SLED services",
    "proposal writing",
    "IT services",
    "software development",
    "content writing",
    "strategic content",
    "AI execution",
    "government contracting",
    "enterprise architecture",
  ],
  authors: [{ name: "Aliff Services" }],
  creator: "Aliff Services",
  publisher: "Aliff Services",
  metadataBase: new URL("https://aliffservices.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aliffservices.com",
    siteName: "Aliff Services",
    title: "Aliff Services - Strategic Thinking + AI Execution",
    description:
      "Win government contracts. Build better systems. Create authentic content. Strategic thinking + AI execution beats AI commodity competitors.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aliff Services - Strategic Thinking + AI Execution",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliff Services - Strategic Thinking + AI Execution",
    description:
      "Win 22% of contracts. Build enterprise systems at startup speed. Create authentic content.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900 font-sans">
        <Header />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
