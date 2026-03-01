import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
  description: "피치에이전트 프로(PitchAgent Pro)는 4개의 전문 AI 에이전트를 통해 타겟 웹사이트를 분석하고, 3분 안에 초개인화된 콜드 이메일 피치를 작성합니다. B2B 영업 사원을 위한 최강의 자동화 도구입니다.",
  keywords: ["AI 콜드 이메일", "영업 자동화", "B2B 영업", "세일즈 AI", "PitchAgent", "콜드 아웃리치", "AI 에이전트", "초개인화 이메일"],
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
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
      </body>
    </html>
  );
}
