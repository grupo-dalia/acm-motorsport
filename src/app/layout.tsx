import type { Metadata, Viewport } from "next";
import "./globals.css";
import { hubot, mona } from "./fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site";
import { catalog } from "@/integrations/commerce";
import { JsonLd, organizationLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.founder,
  openGraph: { type: "website", locale: site.locale, siteName: site.name },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#101E36",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await catalog.listProducts();
  return (
    <html lang="es" className={`${hubot.variable} ${mona.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
          Saltar al contenido
        </a>
        <JsonLd data={organizationLd()} />
        <Providers catalog={products}>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
        <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID || undefined} />
      </body>
    </html>
  );
}
