import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import PaddleInit from "@/components/PaddleInit";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pitchagent-pro.vercel.app"),
  title: {
    default: "PitchAgent Pro - AI-Powered Cold Email Automation",
    template: "%s | PitchAgent Pro"
  },
  description: "PitchAgent Pro analyzes target websites using four specialized AI agents to write hyper-personalized cold email pitches in under 3 minutes. The ultimate automation tool for B2B sales professionals.",
  keywords: ["AI Cold Email", "Sales Automation", "B2B Sales", "Sales AI", "PitchAgent", "Cold Outreach", "AI Agent", "Hyper-personalization"],
  authors: [{ name: "PitchAgent Team" }],
  robots: "index, follow",
  openGraph: {
    title: "PitchAgent Pro - AI-Powered Hyper-Personalized Cold Email",
    description: "4 specialized AI agents analyze your target client and write a pitch that sounds human — in under 3 minutes. Try it free.",
    url: "https://pitchagent-pro.vercel.app",
    siteName: "PitchAgent Pro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PitchAgent Pro Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PitchAgent Pro | B2B Sales AI Agent",
    description: "Multi-agent automation for hyper-personalized cold emails.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "F2-pKIeQYZIi3Rnm523tIFaNwSkTzNynZrV0H17NCUo",
  },
};


const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ fontSize: "15px" }}>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased text-slate-200`}
      >
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        {children}
        <PaddleInit />
      </body>

    </html>
  );
}
