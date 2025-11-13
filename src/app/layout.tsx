import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/Provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Aliff Services - Win Government Contracts with AI + Expert Teams",
    template: "%s | Aliff Services",
  },
  description:
    "$47M+ in government contracts won. Full business development teams with 24/7 RFP intelligence. 5-7 day turnaround. Zero hallucinations. 100% compliance guaranteed.",
  keywords: [
    "government contracts",
    "federal contracts",
    "GSA Schedule",
    "RFP response",
    "proposal writing",
    "government contracting",
    "federal procurement",
    "OASIS+",
    "DLA TLS",
    "compliance audit",
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
    title: "Aliff Services - Win Government Contracts with AI + Expert Teams",
    description:
      "$47M+ in contracts won. AI + Human expertise. 5-7 day turnaround. Get your readiness audit today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aliff Services - Government Contracting Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliff Services - Win Government Contracts with AI + Expert Teams",
    description:
      "$47M+ in contracts won. AI + Human expertise. 5-7 day turnaround.",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-gray-900 font-sans">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
