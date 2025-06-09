import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./clientProvider";
import { Header } from "./home/header";
import { Footer } from "./home/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayOnce – Instant VTU Recharge, Bills & More",
  description:
    "PayOnce offers fast and affordable airtime, data recharge, bill payments, and more. Enjoy seamless VTU services across Nigeria.",
  keywords: [
    "PayOnce",
    "VTU",
    "Airtime Recharge",
    "Data Recharge",
    "Electricity Bill",
    "TV Subscription",
    "WAEC Payment",
    "Affordable VTU",
    "Recharge Cards",
  ],
  icons: {
    icon: "/images/logo.png",
  },
  metadataBase: new URL("https://mypayonce.vercel.app"),
  openGraph: {
    title: "PayOnce – Instant VTU Recharge, Bills & More",
    description:
      "Fast, reliable and affordable virtual top-up (VTU) services including airtime, data, electricity, education and TV subscriptions.",
    url: "https://mypayonce.vercel.app/",
    siteName: "PayOnce",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
