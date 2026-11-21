import type { Metadata } from "next";
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "./globals.css";
import { AnalyticsClicks } from "@/components/layout/analytics-clicks";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { MotionEffects } from "@/components/layout/motion-effects";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { UtilityBar } from "@/components/layout/utility-bar";
import { AppProvider } from "@/components/providers/app-provider";
import { site, siteUrl } from "@/lib/site";

const title = "tyrespeed Harare: tyres, fitting and wheel alignment";
const description =
  "Tyres for Harare roads. Check indicative sizes, then book fitting, balancing and four-wheel alignment at our Eastlea workshop.";
const imageUrl = `${siteUrl}/images/hero-tyre-stack.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | tyrespeed Harare",
  },
  description,
  applicationName: "tyrespeed",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZW",
    siteName: site.name,
    url: siteUrl,
    title,
    description,
    images: [
      {
        url: imageUrl,
        width: 1400,
        height: 1000,
        alt: "Stack of car tyres with an alloy wheel in a workshop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
  robots: { index: true, follow: true },
};

// Mirrors site.hours. No ratings or reviews are included until real ones exist.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: site.name,
  telephone: site.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: "20 McChlery Road",
    addressLocality: "Eastlea",
    addressRegion: "Harare",
    addressCountry: "ZW",
  },
  openingHours: ["Mo-Fr 08:00-17:30", "Sa 08:00-13:00"],
  url: siteUrl,
  image: imageUrl,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZW" data-scroll-behavior="smooth" className="is-loaded">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <MotionEffects />
        <AnalyticsClicks />
        <AppProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          <UtilityBar />
          <SiteHeader />
          <main id="main" className="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <MobileActionBar />
        </AppProvider>
      </body>
    </html>
  );
}
