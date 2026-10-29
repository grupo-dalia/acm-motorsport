import { HomeHero } from "@/components/sections/home/hero";
import { Marquee } from "@/components/sections/home/marquee";
import { About } from "@/components/sections/home/about";
import { DakarBand, FeaturedProducts, LatestVideos, NewsletterBand, SimRacingTeaser, SponsorsBand, WorkshopTeaser } from "@/components/sections/home/rest";
import { catalog } from "@/integrations/commerce";
import { JsonLd, personLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = { alternates: { canonical: absoluteUrl("/") } };

export default async function HomePage() {
  const products = (await catalog.listProducts()).filter((p) => p.featured);
  return (
    <>
      <JsonLd data={personLd()} />
      <HomeHero />
      <Marquee />
      <About />
      <DakarBand />
      <FeaturedProducts products={products} />
      <LatestVideos />
      <WorkshopTeaser />
      <SimRacingTeaser />
      <SponsorsBand />
      <NewsletterBand />
    </>
  );
}
