import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBotanicals } from "@/components/decoration/botanicals";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Easy Reviews — leave a review they'll remember",
    template: "%s · Easy Reviews",
  },
  description:
    "A 60-second interview becomes an honest, well-written Google review — in your words, grounded in your visit.",
  openGraph: {
    title: "Easy Reviews",
    description:
      "Your favorite spot asked for a review. We'll help you write a great one — in under a minute.",
    url: "/",
    siteName: "Easy Reviews",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <PageBotanicals />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
